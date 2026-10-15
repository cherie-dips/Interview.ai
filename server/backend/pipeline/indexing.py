"""
Saving text for search: cut it into passages, make a meaning fingerprint for each passage, and store
both in Postgres through LlamaIndex's vector store. The same rows also get a keyword index, so search
can match exact words ("RREF", "Dijkstra") as well as meaning.

Two passage tables (LlamaIndex adds the data_ prefix):
- data_notes     every student's own notes; every read and search is limited to one user_id
- data_library   the shared course library (library.py): one copy, searched by every student

Safety: LlamaIndex writes metadata filter values straight into its SQL, so filters only ever use
values the server made itself: user ids (checked) and hashed keys of paths, courses and subjects
(path_key, course_key, subject_key). SQL written here always uses bound parameters.
"""
import hashlib
import logging
import re
import threading
import uuid

from llama_index.core import Document
from llama_index.core.node_parser import SentenceSplitter
from llama_index.core.schema import TextNode
from llama_index.core.vector_stores.types import FilterOperator, MetadataFilter, MetadataFilters

from backend import db, settings
from backend.pages import PageStarts, page_at
from backend.pipeline import models
from backend.store import clean_text

logger = logging.getLogger(__name__)

NOTES_TABLE = "notes"      # → data_notes
LIBRARY_TABLE = "library"  # → data_library
EMBED_BATCH = 64
_SAFE_ID = re.compile(r"^[A-Za-z0-9_-]{1,80}$")

_stores: dict[str, object] = {}
_stores_lock = threading.Lock()


# ---------- Keys used in filters ----------
def key(kind: str, value: str) -> str:
    """Filter-safe key for a path, course or subject: a letter and 40 hex digits."""
    return kind[0] + hashlib.sha256((value or "").encode("utf-8")).hexdigest()[:40]


def path_key(path: str) -> str:
    return key("p", path)


def course_key(course: str) -> str:
    return key("c", course)


def subject_key(subject: str) -> str:
    return key("s", subject)


def safe_user_id(user_id: str) -> str:
    if not _SAFE_ID.match(user_id or ""):
        raise ValueError("Invalid user id")
    return user_id


def where(**equals: str) -> MetadataFilters:
    """LlamaIndex filters: every key equals its value (values must be safe keys or user ids)."""
    return MetadataFilters(filters=[MetadataFilter(key=k, value=v) for k, v in equals.items()])


def where_not(filters: MetadataFilters, **not_equal: str) -> MetadataFilters:
    extra = [MetadataFilter(key=k, value=v, operator=FilterOperator.NE) for k, v in not_equal.items()]
    return MetadataFilters(filters=[*filters.filters, *extra])


# ---------- The vector stores ----------
def _store(table: str, indexed: set[tuple[str, str]]):
    store = _stores.get(table)
    if store is not None:
        return store
    with _stores_lock:
        if table not in _stores:
            from llama_index.vector_stores.postgres import PGVectorStore

            db.init()
            store = PGVectorStore(
                engine=db.engine(),
                async_engine=db.async_engine(),
                table_name=table,
                embed_dim=settings.EMBED_DIM,
                hybrid_search=True,           # keyword search (Postgres full text) next to meaning search
                text_search_config="english",  # English words are stemmed; other scripts are kept as they are
                use_jsonb=True,
                indexed_metadata_keys=indexed,
                # No approximate (HNSW) index: each search covers one student's or one course's passages,
                # which Postgres scans exactly in milliseconds, and an exact scan never misses a passage.
            )
            store.get_nodes(node_ids=["-"])  # creates the table and its indexes once, before any search
            _stores[table] = store
    return _stores[table]


def notes_store():
    return _store(NOTES_TABLE, {("user_id", "text"), ("path_key", "text"), ("course_key", "text")})


def library_store():
    return _store(LIBRARY_TABLE, {("path_key", "text"), ("subject_key", "text")})


def forget_stores() -> None:
    with _stores_lock:
        _stores.clear()


# ---------- Cutting text into passages ----------
_splitter = SentenceSplitter(
    chunk_size=settings.CHUNK_CHARS,
    chunk_overlap=settings.CHUNK_OVERLAP_CHARS,
    tokenizer=list,  # sizes in characters (the same in every language), not model tokens
    paragraph_separator="\n\n",
    secondary_chunking_regex="[^,.;।。？！?!]+[,.;।。？！?!]?",  # also ends sentences at the Hindi danda (।)
    include_metadata=False,
    include_prev_next_rel=False,
)


def split_text(text: str) -> list[tuple[str, int]]:
    """Passages of about CHUNK_CHARS characters, each with where it starts in `text`."""
    text = clean_text(text)
    if not text.strip():
        return []
    out: list[tuple[str, int]] = []
    prev_start, prev_end = -1, 0
    for node in _splitter.get_nodes_from_documents([Document(text=text)]):
        chunk = node.get_content()
        if not chunk.strip():
            continue
        # LlamaIndex finds a passage's first occurrence, which is wrong for repeated text: search
        # forward instead. A passage starts after the previous one, at most CHUNK_OVERLAP_CHARS back.
        frm = max(prev_start + 1, prev_end - settings.CHUNK_OVERLAP_CHARS)
        start = text.find(chunk, frm)
        if start < 0:
            start = text.find(chunk[:80], frm)
        if start < 0:
            start = max(frm, 0)
        out.append((chunk, start))
        prev_start, prev_end = start, start + len(chunk)
    return out


def _with_embeddings(nodes: list[TextNode]) -> list[TextNode]:
    for i in range(0, len(nodes), EMBED_BATCH):
        batch = nodes[i : i + EMBED_BATCH]
        for node, emb in zip(batch, models.embed_passages([n.text for n in batch])):
            node.embedding = emb
    return nodes


def join_chunks(chunks: list[str], max_overlap: int = 300) -> str:
    """Join ordered passages, dropping the text repeated between neighbours (passages overlap on purpose)."""
    out = ""
    for ch in chunks:
        if not out:
            out = ch
            continue
        overlap = 0
        for k in range(min(max_overlap, len(ch), len(out)), 0, -1):
            if out.endswith(ch[:k]):
                overlap = k
                break
        out += ch[overlap:] if overlap else "\n\n" + ch
    return out


# ---------- A student's notes ----------
def _note_metadata(user_id: str, path: str, source_file: str) -> dict:
    from backend.file_meta import course_id_from_path, get_entry

    fm = get_entry(user_id, path)
    course = course_id_from_path(path)
    return {
        "user_id": safe_user_id(str(user_id)),
        "path": str(path or ""),
        "path_key": path_key(path),
        "source_file": str(source_file or ""),
        "course_id": course,
        "course_key": course_key(course),
        "is_primary_authority": int(bool(fm.get("is_primary_authority"))),
        "doc_type": str(fm.get("doc_type") or "other"),
    }


def _replace_note_passages(user_id: str, path: str, nodes: list[TextNode], version: str) -> None:
    """Add the new passages first, then drop older versions: a failure never leaves the file empty."""
    if nodes:
        notes_store().add(nodes)
    db.execute(
        "DELETE FROM data_notes WHERE metadata_->>'user_id' = :u AND metadata_->>'path_key' = :pk "
        "AND coalesce(metadata_->>'ver', '') <> :ver",
        u=user_id,
        pk=path_key(path),
        ver=version,
    )


# Page breaks and markup a passage may start with (Sarvam writes "---" between pages).
_LEADING_BREAKS = re.compile(r"^(?:\s|-{3,}|\*{3,}|_{3,}|<br\s*/?>|<hr\s*/?>)+", re.IGNORECASE)


def text_start(chunk: str, start: int) -> int:
    """Where the passage's first real words are: its page is the page those words are on."""
    m = _LEADING_BREAKS.match(chunk)
    return start + (m.end() if m and m.end() < len(chunk) else 0)


def index_note(user_id: str, path: str, source_file: str, text: str, page_starts: PageStarts | None = None) -> dict:
    """Make a file searchable (replacing what was stored for it before)."""
    pieces = [
        (chunk, page_at(text_start(chunk, start), page_starts) if page_starts else None)
        for chunk, start in split_text(text)
    ]
    if not pieces:
        return {"chunks_created": 0, "message": "Empty text."}
    count = save_note_passages(user_id, path, source_file, pieces)
    return {"chunks_created": count, "message": f"Saved {count} passages."}


def save_note_passages(user_id: str, path: str, source_file: str, pieces: list[tuple[str, int | None]]) -> int:
    """Store already-cut passages (text, page) of a file, replacing what was stored for it before."""
    base = _note_metadata(user_id, path, source_file)
    version = "v" + uuid.uuid4().hex
    nodes = []
    for i, (chunk, page) in enumerate(pieces):
        meta = {**base, "chunk_index": i, "ver": version}
        if page is not None:
            meta["page"] = int(page)
        nodes.append(TextNode(text=clean_text(chunk), metadata=meta))
    _replace_note_passages(user_id, path, _with_embeddings(nodes), version)
    return len(nodes)


def note_text(user_id: str, path: str) -> str:
    """A file's text rebuilt from its passages, in order, without the repeated overlap."""
    if not path:
        return ""
    notes_store()
    found = db.rows(
        "SELECT text FROM data_notes WHERE metadata_->>'user_id' = :u AND metadata_->>'path_key' = :pk "
        "ORDER BY (metadata_->>'chunk_index')::int",
        u=user_id,
        pk=path_key(path),
    )
    return join_chunks([r["text"].strip() for r in found if (r["text"] or "").strip()])


def note_passages(user_id: str, path: str) -> list[dict]:
    """[{text, metadata}] of one file's passages in order (for checks and admin tools)."""
    notes_store()
    found = db.rows(
        "SELECT text, metadata_ FROM data_notes WHERE metadata_->>'user_id' = :u AND metadata_->>'path_key' = :pk "
        "ORDER BY (metadata_->>'chunk_index')::int",
        u=user_id,
        pk=path_key(path),
    )
    return [{"text": r["text"], "metadata": {k: v for k, v in (r["metadata_"] or {}).items() if not k.startswith("_")}}
            for r in found]


def delete_note_passages(user_id: str, paths: list[str]) -> int:
    """Remove the passages of these files. Returns how many passages were removed."""
    if not paths:
        return 0
    notes_store()
    return db.execute(
        "DELETE FROM data_notes WHERE metadata_->>'user_id' = :u AND metadata_->>'path_key' = ANY(:keys)",
        u=user_id,
        keys=[path_key(p) for p in paths],
    )


def delete_all_note_passages(user_id: str) -> int:
    notes_store()
    return db.execute("DELETE FROM data_notes WHERE metadata_->>'user_id' = :u", u=user_id)


def _rewrite_note(user_id: str, old_path: str, new_path: str, source_file: str | None = None) -> int:
    """Store a file's passages again under new_path and current file details (same text and fingerprints)."""
    old = notes_store().get_nodes(filters=where(user_id=safe_user_id(user_id), path_key=path_key(old_path)))
    if not old:
        return 0
    name = source_file or new_path.replace("\\", "/").rsplit("/", 1)[-1]
    base = _note_metadata(user_id, new_path, name)
    version = "v" + uuid.uuid4().hex
    nodes = []
    for n in old:
        meta = {**base, "chunk_index": int(n.metadata.get("chunk_index") or 0), "ver": version}
        if n.metadata.get("page") is not None:
            meta["page"] = int(n.metadata["page"])
        nodes.append(TextNode(text=n.get_content(), metadata=meta, embedding=n.embedding))
    if any(n.embedding is None for n in nodes):
        _with_embeddings(nodes)
    if old_path == new_path:
        _replace_note_passages(user_id, new_path, nodes, version)
    else:
        notes_store().add(nodes)
        delete_note_passages(user_id, [old_path])
    return len(nodes)


def move_note(user_id: str, old_path: str, new_path: str, source_file: str | None = None) -> int:
    """Move a file's passages to its new path (rename or move). Returns how many were moved."""
    if old_path != new_path:
        delete_note_passages(user_id, [new_path])  # leftovers from a deleted file of that name
    return _rewrite_note(user_id, old_path, new_path, source_file)


def move_folder_notes(user_id: str, file_paths: list[str], old_prefix: str, new_prefix: str) -> int:
    """Move the passages of each file under old_prefix (paths from the folder tree) to new_prefix."""
    old_prefix = old_prefix.replace("\\", "/").strip("/")
    new_prefix = new_prefix.replace("\\", "/").strip("/")
    moved = 0
    for p in file_paths:
        if p == old_prefix or p.startswith(old_prefix + "/"):
            moved += move_note(user_id, p, new_prefix + p[len(old_prefix):])
    return moved


def refresh_note_details(user_id: str, paths: list[str]) -> int:
    """Store the current file details (e.g. "main source") on each passage of these files."""
    updated = 0
    for p in paths:
        try:
            updated += _rewrite_note(user_id, p, p)
        except Exception:
            logger.warning("Updating passage details failed for %s", p, exc_info=True)
    return updated


# ---------- The shared course library ----------
def index_library_file(path: str, base: dict, pieces: list[tuple[str, int | None, float | None]]) -> int:
    """
    Replace the passages of one library PDF. `pieces` are (text, page, y) where y is how far down the
    page the passage starts (0 = top, 1 = bottom), so a viewer can scroll to it.
    """
    version = "v" + uuid.uuid4().hex
    common = {**base, "path": path, "path_key": path_key(path), "subject_key": subject_key(base.get("subject") or "")}
    nodes = []
    for i, (text, page, y) in enumerate(pieces):
        meta = {**common, "chunk_index": i, "ver": version}
        if page is not None:
            meta["page"] = int(page)
        if y is not None:
            meta["y"] = round(float(y), 4)
        nodes.append(TextNode(text=clean_text(text), metadata=meta))
    if nodes:
        library_store().add(_with_embeddings(nodes))
    db.execute(
        "DELETE FROM data_library WHERE metadata_->>'path_key' = :pk AND coalesce(metadata_->>'ver', '') <> :ver",
        pk=path_key(path),
        ver=version,
    )
    return len(nodes)


def delete_library_file(path: str) -> int:
    library_store()
    return db.execute("DELETE FROM data_library WHERE metadata_->>'path_key' = :pk", pk=path_key(path))


def library_passage_count(path: str) -> int:
    library_store()
    count = db.scalar("SELECT count(*) FROM data_library WHERE metadata_->>'path_key' = :pk", pk=path_key(path))
    return int(count or 0)


def library_passages(path: str) -> list[dict]:
    """[{text, metadata}] of one library PDF in order (for checks and admin tools)."""
    library_store()
    found = db.rows(
        "SELECT text, metadata_ FROM data_library WHERE metadata_->>'path_key' = :pk "
        "ORDER BY (metadata_->>'chunk_index')::int",
        pk=path_key(path),
    )
    return [{"text": r["text"], "metadata": {k: v for k, v in (r["metadata_"] or {}).items() if not k.startswith("_")}}
            for r in found]
