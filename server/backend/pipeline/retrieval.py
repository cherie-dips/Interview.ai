"""
Finding the passages that answer a question (the "retrieval" step of the pipeline).

Places are searched in this order, and the first one with a relevant enough passage is used:
chat uploads (+ button) → the shared course PDF that is open and the rest of its course (Interview.ai)
→ the open file → other files in the same course folder → all other notes. If no place is relevant
enough, the best-scoring one is used (the answer then says what is beyond the notes).

In each place:
1. LlamaIndex runs a hybrid search in Postgres: the passages closest in meaning to the question
   (fingerprints) plus the passages sharing its keywords (full-text search), CANDIDATES_PER_SEARCH each.
2. The re-checking model scores every candidate 0..1 for how well it answers the question. Scores
   are comparable across places, so "relevant enough" means the same thing everywhere.
A place is only searched when the places before it had nothing relevant enough.
"""
import re
from dataclasses import dataclass, field
from typing import Callable

import numpy as np
from llama_index.core.vector_stores.types import VectorStoreQuery, VectorStoreQueryMode

from backend import library, settings
from backend.pipeline import indexing, models
from backend.settings import (
    CANDIDATES_PER_SEARCH,
    MAIN_SOURCE_BOOST,
    MIN_KEEP_SCORE,
    MIN_SCORE_ALL_NOTES,
    MIN_SCORE_CHAT_UPLOAD,
    MIN_SCORE_COURSE,
    MIN_SCORE_LIBRARY_FILE,
    MIN_SCORE_LIBRARY_SUBJECT,
    MIN_SCORE_OPEN_FILE,
    SOURCE_SCORE_WINDOW,
)

MAX_SELECTED = 8
FALLBACK_KEEP = 3              # when nothing is relevant, the best few still go to the AI
OPEN_LIBRARY_FILE_LEAD = 0.10  # ranking lead for the course PDF the student has open
OPEN_PDF_KEEP = 3              # passages of the open PDF always sent when it is nearly as relevant...
OPEN_PDF_KEEP_GAP = 0.25       # ...as the best passage of its course (within this much)
_INTERNAL_KEYS = ("ver", "path_key", "course_key", "subject_key")


@dataclass
class SearchResult:
    stage: str = ""
    selected: list[dict] = field(default_factory=list)
    best_scores: dict[str, float] = field(default_factory=dict)

    def context(self) -> str:
        parts = []
        for d in self.selected:
            content = (d.get("content") or "").strip()
            if not content:
                continue
            md = d.get("metadata") or {}
            label = md.get("path") or "chunk"
            if md.get("library"):
                label = f"Course notes: {md.get('label') or label}"
            # Most course PDFs are one long page: a page number would only add noise there.
            if md.get("page") and int(md.get("pages") or 2) > 1:
                label += f", page {md['page']}"
            if md.get("is_primary_authority"):
                label += " (main source)"
            parts.append(f"[{label}]\n{content[:1200]}")
        return "\n\n".join(parts)

    def source_documents(self) -> list[dict]:
        return [{k: v for k, v in d.items() if k != "_score"} for d in self.selected]


# ---------- Candidates ----------
@dataclass
class Question:
    text: str                # what the re-checking model compares passages with
    keywords: str            # words for the keyword search
    embedding: list[float]   # the question's meaning fingerprint


def _public(metadata: dict) -> dict:
    return {k: v for k, v in (metadata or {}).items() if k not in _INTERNAL_KEYS}


def hybrid_search(store, question: Question, filters, k: int = CANDIDATES_PER_SEARCH) -> list[dict]:
    """
    Candidates from one LlamaIndex vector store: by meaning and by keywords (or by meaning only when
    re-checking is off, so the scores stay cosine similarities).
    """
    hybrid = models.reranker() is not None
    res = store.query(
        VectorStoreQuery(
            query_embedding=question.embedding,
            query_str=question.keywords,
            similarity_top_k=k,
            sparse_top_k=k,
            mode=VectorStoreQueryMode.HYBRID if hybrid and question.keywords else VectorStoreQueryMode.DEFAULT,
            filters=filters,
        )
    )
    sims = list(res.similarities or [])
    out = []
    for i, node in enumerate(res.nodes or []):
        content = node.get_content()
        if not content.strip():
            continue
        score = float(sims[i]) if i < len(sims) and sims[i] is not None and not hybrid else 0.0
        out.append({"id": node.node_id, "content": content, "metadata": _public(node.metadata), "_score": score})
    return out


_WORD = re.compile(r"\w{3,}")
_COMMON = {"the", "and", "for", "what", "which", "who", "how", "why", "when", "where", "this", "that", "with",
           "from", "are", "was", "were", "does", "did", "can", "about", "explain", "tell", "give", "into"}


def _keyword_set(text: str) -> set[str]:
    return {w for w in _WORD.findall((text or "").lower()) if w not in _COMMON}


def _chat_upload_candidates(ephemeral: list[dict], question: Question, k: int = CANDIDATES_PER_SEARCH) -> list[dict]:
    """
    Passages of files attached to this chat (+ button; kept in memory only): per file, the closest
    by meaning and the ones sharing the most keywords with the question, like hybrid_search.
    """
    q_vec = np.asarray(question.embedding, dtype=np.float32)
    words = _keyword_set(question.keywords)
    out: list[dict] = []
    for i, it in enumerate(ephemeral):
        chunks = it.get("chunks") or []
        embs = it.get("embeddings")
        if not chunks or embs is None or len(embs) != len(chunks):
            continue
        sims = embs @ q_vec
        by_meaning = [int(j) for j in np.argsort(-sims)]
        hits = [len(words & _keyword_set(c)) for c in chunks] if words else [0] * len(chunks)
        by_keyword = [j for j in sorted(range(len(chunks)), key=lambda j: -hits[j]) if hits[j] > 0]
        picked: list[int] = []
        seen_text: set[str] = set()

        def take(order: list[int]) -> None:
            added = 0
            for j in order:
                if added == k:
                    return
                if chunks[j] not in seen_text:  # repeated text (copied pages) counts once
                    seen_text.add(chunks[j])
                    picked.append(j)
                    added += 1

        take(by_meaning)
        take(by_keyword)
        for j in picked:
            out.append({
                "id": f"ephemeral|{i}|{j}",
                "content": chunks[j],
                "metadata": {
                    "path": f"[chat-upload] {it.get('name') or 'file'}",
                    "source_file": it.get("name") or "chat-upload",
                    "ephemeral_chat_upload": 1,
                },
                "_score": float(sims[j]),
            })
    return out


# ---------- Scoring ----------
def keyword_text(*parts: str) -> str:
    """Text for the keyword search (LlamaIndex drops punctuation and joins the words with OR)."""
    return re.sub(r"\s+", " ", " ".join(p or "" for p in parts)).strip()[:1000]


def score(question: Question, docs: list[dict]) -> list[dict]:
    """Re-check every candidate (0..1), add the main-source boost, best first. Duplicates are dropped."""
    seen, unique = set(), []
    for d in docs:
        if d["id"] not in seen:
            seen.add(d["id"])
            unique.append(d)
    rel = models.relevance(question.text, [d["content"] for d in unique])
    out = []
    for i, d in enumerate(unique):
        s = rel[i] if rel is not None else d["_score"]
        if (d.get("metadata") or {}).get("is_primary_authority"):
            s += MAIN_SOURCE_BOOST
        out.append({**d, "_score": float(s)})
    out.sort(key=lambda d: d["_score"], reverse=True)
    return out


def _closest(docs: list[dict]) -> list[dict]:
    """The best passages of a place: those close to its top match (at most MAX_SELECTED)."""
    if not docs:
        return []
    floor = max(MIN_KEEP_SCORE, docs[0]["_score"] - SOURCE_SCORE_WINDOW)
    keep = [d for d in docs if d["_score"] >= floor][:MAX_SELECTED]
    return keep or docs[:FALLBACK_KEEP]


def course_of(opened: str, course_path: str) -> str:
    course = course_path or ""
    if not course and opened:
        course = opened.split("/", 1)[0] if "/" in opened else opened
    return course.split("/", 1)[0] if course else ""


# ---------- The search ----------
@dataclass
class _Stage:
    name: str
    min_score: float
    find: Callable[[], list[dict]]  # candidates, already scored and sorted


def find_context(
    user_id: str,
    question: str,
    all_paths: list[str],
    opened: str,
    course: str,
    ephemeral: list[dict],
    include_other_notes: bool = True,
    library_path: str = "",
    keywords: str | None = None,
) -> SearchResult:
    """
    The passages to answer `question` from. `keywords` (default: the question) feed the keyword search;
    a follow-up question should already be rewritten to stand on its own (see generation.py).
    """
    user_id = indexing.safe_user_id(user_id)
    q_emb = models.embed_question(question)
    q = Question(text=question, keywords=keyword_text(keywords if keywords is not None else question), embedding=q_emb)
    all_set = set(all_paths)
    notes = indexing.notes_store()
    mine = {"user_id": user_id}

    def in_tree(docs: list[dict]) -> list[dict]:
        # Passages of files no longer in the folder tree never show up (e.g. a delete that failed halfway).
        return [d for d in docs if (d.get("metadata") or {}).get("path") in all_set]

    def chat_uploads() -> list[dict]:
        return score(q, _chat_upload_candidates(ephemeral, q))

    def open_file() -> list[dict]:
        if opened not in all_set:
            return []
        return score(q, in_tree(hybrid_search(notes, q, indexing.where(**mine, path_key=indexing.path_key(opened)))))

    def same_course() -> list[dict]:
        if not (include_other_notes and all_paths and course):
            return []
        filters = indexing.where(**mine, course_key=indexing.course_key(course))
        if opened:
            filters = indexing.where_not(filters, path_key=indexing.path_key(opened))
        return score(q, in_tree(hybrid_search(notes, q, filters)))

    def other_notes() -> list[dict]:
        if not (include_other_notes and all_paths):
            return []
        filters = indexing.where(**mine)
        if course:
            filters = indexing.where_not(filters, course_key=indexing.course_key(course))
        elif opened:
            filters = indexing.where_not(filters, path_key=indexing.path_key(opened))
        return score(q, in_tree(hybrid_search(notes, q, filters)))

    # Shared course library: the open course PDF and the other PDFs of its course, ranked together
    # with a small lead for the open PDF, so a lecture that clearly answers the question wins over a
    # loosely related open PDF.
    lib_file, lib_subject = library.scope_of(library_path)
    lib: dict[str, list[dict]] = {"file": [], "subject": []}

    def course_library() -> list[dict]:
        if not (settings.LIBRARY_ENABLED and lib_subject):
            return []
        store = indexing.library_store()
        if lib_file:
            lib["file"] = hybrid_search(store, q, indexing.where(path_key=indexing.path_key(lib_file)))
        if include_other_notes or not lib_file:
            filters = indexing.where(subject_key=indexing.subject_key(lib_subject))
            if lib_file:
                filters = indexing.where_not(filters, path_key=indexing.path_key(lib_file))
            lib["subject"] = hybrid_search(store, q, filters)
        ranked = score(q, lib["file"] + lib["subject"])
        file_ids = {d["id"] for d in lib["file"]}
        lib["file"] = [d for d in ranked if d["id"] in file_ids]
        lib["subject"] = [d for d in ranked if d["id"] not in file_ids]
        led = [{**d, "_score": d["_score"] + OPEN_LIBRARY_FILE_LEAD} if d["id"] in file_ids else d for d in ranked]
        return sorted(led, key=lambda d: d["_score"], reverse=True)

    stages = [
        _Stage("ephemeral", MIN_SCORE_CHAT_UPLOAD, chat_uploads),
        _Stage("library", 0.0, course_library),  # named after its best passage's file, below
        _Stage("opened", MIN_SCORE_OPEN_FILE, open_file),
        _Stage("course", MIN_SCORE_COURSE, same_course),
        _Stage("all_notes", MIN_SCORE_ALL_NOTES, other_notes),
    ]
    result = SearchResult(best_scores={n: -1.0 for n in ("ephemeral", "library_file", "library_subject", "opened", "course", "all_notes")})
    found: list[tuple[str, list[dict]]] = []
    for stage in stages:
        docs = stage.find()
        if not docs:
            continue
        name = stage.name
        relevant = docs[0]["_score"] >= stage.min_score
        if name == "library":
            name = "library_file" if docs[0]["metadata"].get("path") == lib_file else "library_subject"
            # Judged on the passages' own scores: the open PDF's lead only changes the order.
            relevant = bool(lib["file"]) and lib["file"][0]["_score"] >= MIN_SCORE_LIBRARY_FILE or (
                bool(lib["subject"]) and lib["subject"][0]["_score"] >= MIN_SCORE_LIBRARY_SUBJECT
            )
            for part in ("file", "subject"):
                if lib[part]:
                    result.best_scores[f"library_{part}"] = round(lib[part][0]["_score"], 4)
        else:
            result.best_scores[name] = round(docs[0]["_score"], 4)
        found.append((name, docs))
        if relevant:
            result.stage, result.selected = name, _closest(docs)
            _keep_open_pdf(result, lib["file"], lib["subject"])
            return result
    # A question about a course PDF never falls back to loosely related notes of the student's own
    # (e.g. sample physics notes for a maths course): only the course library itself.
    fallback = [f for f in found if f[0].startswith("library")] if lib_subject else found
    if fallback:
        result.stage, docs = max(fallback, key=lambda f: f[1][0]["_score"])
        result.selected = _closest(docs)
        _keep_open_pdf(result, lib["file"], lib["subject"])
    return result


def _keep_open_pdf(result: SearchResult, file_docs: list[dict], subject_docs: list[dict]) -> None:
    """
    The student asked while reading a course PDF: make sure its best passages reach the answer when
    it is nearly as relevant as the rest of the course, even if many other passages score a little
    higher (e.g. exam answers that all mention "time complexity"). They go first in the context.
    """
    if not file_docs or not result.stage.startswith("library"):
        return
    best_other = subject_docs[0]["_score"] if subject_docs else -1.0
    if file_docs[0]["_score"] < max(MIN_SCORE_LIBRARY_FILE, best_other - OPEN_PDF_KEEP_GAP):
        return
    keep = [d for d in file_docs[:OPEN_PDF_KEEP] if d["_score"] >= MIN_SCORE_LIBRARY_FILE]
    kept_ids = {d["id"] for d in keep}
    result.selected = (keep + [d for d in result.selected if d["id"] not in kept_ids])[:MAX_SELECTED]
