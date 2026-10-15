"""
Account details, folders, file text and OneNote tokens in Postgres (tables in db.SCHEMA).

The function names match the older ChromaDB version, so routes didn't need to change. Note passages
(the searchable pieces of each file) are in backend/pipeline/indexing.py.
"""
import json
import logging
import os
import threading
import time

from backend import db, originals, settings

logger = logging.getLogger(__name__)

_user_locks: dict[str, threading.RLock] = {}
_user_locks_guard = threading.Lock()


def user_lock(user_id: str) -> threading.RLock:
    """Per-user lock so two requests can't overwrite each other's folder tree or file metadata."""
    with _user_locks_guard:
        lock = _user_locks.get(user_id)
        if lock is None:
            lock = _user_locks[user_id] = threading.RLock()
        return lock


def clean_text(text: str) -> str:
    """Postgres text can't hold NUL characters (some PDFs contain them)."""
    return (text or "").replace("\x00", "")


def _under(param: str) -> str:
    """SQL condition: `path` is the folder in :param or inside it (no LIKE: names may contain % or _)."""
    return f"(path = :{param} OR left(path, length(:{param}) + 1) = :{param} || '/')"


# ---------- Users ----------
# Accounts and passwords are in Neon Auth (backend/neon_auth.py); this table keeps Study AI's own
# details per account (preferences, privacy acceptance), under the Neon Auth user id.
def _user(row: dict | None) -> dict | None:
    if not row:
        return None
    meta = {"email": row["email"], "name": row["name"], "created_at": int(row["created_at"]), **(row["meta"] or {})}
    return {
        "user_id": row["id"],
        "email": row["email"],
        "name": row["name"],
        "email_verified": bool(row["email_verified"]),
        "meta": meta,
    }


def user_create(user_id: str, email: str, name: str, email_verified: bool = False, **extra) -> bool:
    """Add a user (no-op if the id exists already). Returns True if it was added."""
    return db.execute(
        "INSERT INTO users (id, email, name, email_verified, created_at, meta) "
        "VALUES (:id, :email, :name, :verified, :now, CAST(:meta AS jsonb)) ON CONFLICT (id) DO NOTHING",
        id=user_id,
        email=email.lower(),
        name=name or email.split("@")[0],
        verified=bool(email_verified),
        now=int(time.time()),
        meta=json.dumps(extra),
    ) > 0


def user_sync(user_id: str, email: str, name: str, email_verified: bool) -> bool:
    """Copy the email, name and email check from Neon Auth. False if the user isn't in this table."""
    row = db.one(
        "UPDATE users SET email = :email, name = CASE WHEN :name = '' THEN name ELSE :name END, "
        "email_verified = :verified WHERE id = :id RETURNING id",
        id=user_id,
        email=email.lower(),
        name=name,
        verified=bool(email_verified),
    )
    return row is not None


def user_get_by_id(user_id: str) -> dict | None:
    """User record, or None if it doesn't exist. Database errors raise."""
    return _user(db.one("SELECT * FROM users WHERE id = :id", id=user_id))


def user_update_metadata(user_id: str, **fields) -> dict:
    """Set some metadata fields on a user record (other fields are kept). Returns the new metadata."""
    row = db.one(
        "UPDATE users SET meta = meta || CAST(:fields AS jsonb) WHERE id = :id RETURNING *",
        id=user_id,
        fields=json.dumps(fields),
    )
    if not row:
        raise ValueError("User not found")
    return _user(row)["meta"]


def users_where(where: dict) -> list[dict]:
    """Users whose metadata contains these values, e.g. {"pref_reminders": 1}."""
    found = db.rows("SELECT * FROM users WHERE meta @> CAST(:w AS jsonb) ORDER BY created_at", w=json.dumps(where))
    return [_user(r) for r in found]


def user_delete(user_id: str) -> None:
    db.execute("DELETE FROM users WHERE id = :id", id=user_id)


# ---------- File text (the full text read from each file) ----------
def _truncate_utf8_bytes(text: str, max_bytes: int) -> tuple[str, int]:
    raw = (text or "").encode("utf-8")
    if len(raw) <= max_bytes:
        return (text or ""), len(raw)
    return raw[: max(0, max_bytes)].decode("utf-8", errors="ignore"), len(raw)


def _drop_originals(removed: list[dict]) -> None:
    """Delete the stored originals of document rows that were just deleted."""
    originals.remove([r["original_key"] for r in removed if r.get("original_key")])


def user_document_upsert(user_id: str, path: str, content: str, original_filename: str):
    """Store extracted text for a path (an edit keeps the file's stored original, see originals.py)."""
    trimmed, full_bytes = _truncate_utf8_bytes(clean_text(content), settings.USER_DOCUMENT_MAX_BYTES)
    db.execute(
        "INSERT INTO documents (user_id, path, original_filename, content, truncated, updated_at) "
        "VALUES (:u, :p, :name, :content, :trunc, :now) "
        "ON CONFLICT (user_id, path) DO UPDATE SET original_filename = EXCLUDED.original_filename, "
        "content = EXCLUDED.content, truncated = EXCLUDED.truncated, updated_at = EXCLUDED.updated_at",
        u=str(user_id),
        p=str(path or ""),
        name=str(original_filename or ""),
        content=trimmed,
        trunc=len(trimmed.encode("utf-8")) < full_bytes,
        now=int(time.time()),
    )


def user_document_get(user_id: str, path: str) -> dict | None:
    """{"content", "truncated", "original_filename"} for a path, or None if nothing is stored."""
    row = db.one(
        "SELECT content, truncated, original_filename FROM documents WHERE user_id = :u AND path = :p",
        u=str(user_id),
        p=str(path),
    )
    return dict(row) if row else None


def user_document_get_content(user_id: str, path: str) -> str | None:
    doc = user_document_get(user_id, path)
    return doc["content"] if doc else None


def user_document_delete_by_path(user_id: str, path: str):
    _drop_originals(db.rows(
        "DELETE FROM documents WHERE user_id = :u AND path = :p RETURNING original_key", u=str(user_id), p=str(path)
    ))


def user_document_delete_many(user_id: str, path_filter=None):
    """Delete documents for user_id. path_filter: if callable(path) -> bool, only delete matching paths."""
    if path_filter is None:
        _drop_originals(db.rows("DELETE FROM documents WHERE user_id = :u RETURNING original_key", u=str(user_id)))
        return
    paths = [r["path"] for r in db.rows("SELECT path FROM documents WHERE user_id = :u", u=str(user_id))]
    doomed = [p for p in paths if path_filter(p)]
    if doomed:
        _drop_originals(db.rows(
            "DELETE FROM documents WHERE user_id = :u AND path = ANY(:paths) RETURNING original_key",
            u=str(user_id),
            paths=doomed,
        ))


def user_documents_relocate_prefix(user_id: str, old_prefix: str, new_prefix: str) -> int:
    """Rename stored document paths under old_prefix to new_prefix (a folder move or rename)."""
    with db.transaction() as conn:
        # Anything already stored at the destination is left over from deleted files: replace it.
        removed = db.rows(
            f"DELETE FROM documents WHERE user_id = :u AND {_under('new')} AND NOT {_under('old')} RETURNING original_key",
            conn,
            u=str(user_id),
            old=old_prefix,
            new=new_prefix,
        )
        moved = db.execute(
            f"UPDATE documents SET path = :new || substr(path, length(:old) + 1) WHERE user_id = :u AND {_under('old')}",
            conn,
            u=str(user_id),
            old=old_prefix,
            new=new_prefix,
        )
    _drop_originals(removed)
    return moved


def user_document_rename_path(user_id: str, old_path: str, new_path: str) -> bool:
    """Move stored extracted text from old_path to new_path."""
    with db.transaction() as conn:
        if not db.one("SELECT 1 AS ok FROM documents WHERE user_id = :u AND path = :p", conn, u=user_id, p=old_path):
            return False
        removed = db.rows(
            "DELETE FROM documents WHERE user_id = :u AND path = :p RETURNING original_key", conn, u=user_id, p=new_path
        )
        db.execute(
            "UPDATE documents SET path = :new, original_filename = CASE WHEN original_filename = '' "
            "THEN :name ELSE original_filename END WHERE user_id = :u AND path = :old",
            conn,
            u=user_id,
            old=old_path,
            new=new_path,
            name=os.path.basename(new_path.replace("\\", "/")),
        )
    _drop_originals(removed)
    return True


# ---------- Folder tree + file metadata ----------
def _folders_value(user_id: str, column: str, default):
    raw = db.scalar(f"SELECT {column} FROM folders WHERE user_id = :u", u=user_id)
    return raw if isinstance(raw, type(default)) else default


def _folders_set(user_id: str, column: str, value) -> None:
    db.execute(
        f"INSERT INTO folders (user_id, {column}) VALUES (:u, CAST(:v AS jsonb)) "
        f"ON CONFLICT (user_id) DO UPDATE SET {column} = EXCLUDED.{column}",
        u=user_id,
        v=json.dumps(value, ensure_ascii=False),
    )


def vfs_get_tree(user_id: str) -> list:
    """The user's folder tree ([] if none yet). Database errors raise, so a failed read is never
    mistaken for an empty tree (which a caller might then save over the real one)."""
    return _folders_value(user_id, "tree", [])


def vfs_set_tree(user_id: str, tree: list) -> None:
    _folders_set(user_id, "tree", tree)


def vfs_get_file_meta_dict(user_id: str) -> dict:
    return _folders_value(user_id, "file_meta", {})


def vfs_set_file_meta_dict(user_id: str, meta: dict) -> None:
    _folders_set(user_id, "file_meta", meta)



def delete_user_vfs(user_id: str) -> bool:
    """Remove the folder tree and file details. True if there were any."""
    return db.execute("DELETE FROM folders WHERE user_id = :u", u=user_id) > 0


# ---------- OneNote sign-in ----------
def onenote_oauth_state_create(user_id: str, state: str, expires_at_epoch: int) -> None:
    db.execute(
        "INSERT INTO onenote_oauth_states (state, user_id, expires_at) VALUES (:s, :u, :exp) "
        "ON CONFLICT (state) DO UPDATE SET user_id = EXCLUDED.user_id, expires_at = EXCLUDED.expires_at",
        s=state,
        u=str(user_id),
        exp=int(expires_at_epoch),
    )


def onenote_oauth_state_pop_user_id(state: str) -> str | None:
    try:
        row = db.one("DELETE FROM onenote_oauth_states WHERE state = :s RETURNING user_id, expires_at", s=state)
    except Exception:
        logger.warning("OneNote OAuth state lookup failed", exc_info=True)
        return None
    if not row or not row["user_id"]:
        return None
    if row["expires_at"] and int(row["expires_at"]) < int(time.time()):
        return None
    return row["user_id"]


def onenote_token_upsert(user_id: str, token_payload: dict) -> None:
    payload = token_payload if isinstance(token_payload, dict) else {}
    try:
        expires_at = int(payload.get("expires_at") or 0)
    except (TypeError, ValueError):
        expires_at = 0
    db.execute(
        "INSERT INTO onenote_tokens (user_id, token, expires_at) VALUES (:u, CAST(:t AS jsonb), :exp) "
        "ON CONFLICT (user_id) DO UPDATE SET token = EXCLUDED.token, expires_at = EXCLUDED.expires_at",
        u=str(user_id),
        t=json.dumps(payload, ensure_ascii=False),
        exp=expires_at,
    )


def onenote_token_get(user_id: str) -> dict | None:
    try:
        token = db.scalar("SELECT token FROM onenote_tokens WHERE user_id = :u", u=str(user_id))
    except Exception:
        logger.warning("OneNote token lookup failed for %s", user_id, exc_info=True)
        return None
    return token if isinstance(token, dict) else None


def onenote_token_delete(user_id: str) -> None:
    db.execute("DELETE FROM onenote_tokens WHERE user_id = :u", u=str(user_id))
