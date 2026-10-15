"""
The database: one Postgres (with the pgvector extension) for everything Study AI stores.

- Folders, file text, decks, usage and feedback are ordinary tables (SCHEMA). Accounts, passwords and
  sign-ins belong to Neon Auth (its own neon_auth schema); `users` keeps Study AI's details per account.
- Note passages and their search fingerprints are two more tables, data_notes and data_library,
  created and searched through LlamaIndex (see backend/pipeline/indexing.py).

DATABASE_URL points at it, e.g. postgresql://user:password@host/dbname?sslmode=require
(Neon and Supabase both offer a free Postgres with pgvector).
"""
import logging
import threading
from contextlib import contextmanager

from sqlalchemy import create_engine, text
from sqlalchemy.engine import Connection, Engine

from backend import settings

logger = logging.getLogger(__name__)

# Keep in step with usage.COUNTERS (one column per daily counter).
SCHEMA = """
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS users (
    id             TEXT PRIMARY KEY,  -- the Neon Auth user id
    email          TEXT NOT NULL UNIQUE,
    name           TEXT NOT NULL DEFAULT '',
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at     BIGINT NOT NULL,
    meta           JSONB NOT NULL DEFAULT '{}'::jsonb  -- preferences (pref_*), privacy acceptance, ...
);

CREATE TABLE IF NOT EXISTS folders (
    user_id         TEXT PRIMARY KEY,
    tree            JSONB NOT NULL DEFAULT '[]'::jsonb,  -- the folder tree shown in the explorer
    file_meta       JSONB NOT NULL DEFAULT '{}'::jsonb   -- per-file details, e.g. "main source"
);

CREATE TABLE IF NOT EXISTS documents (
    user_id           TEXT NOT NULL,
    path              TEXT NOT NULL,
    original_filename TEXT NOT NULL DEFAULT '',
    content           TEXT NOT NULL DEFAULT '',  -- the full text read from the file
    truncated         BOOLEAN NOT NULL DEFAULT FALSE,
    updated_at        BIGINT NOT NULL,
    original_key      TEXT NOT NULL DEFAULT '',  -- the original PDF/photo in file storage ('' = none)
    original_type     TEXT NOT NULL DEFAULT '',
    original_size     BIGINT NOT NULL DEFAULT 0,
    PRIMARY KEY (user_id, path)
);

CREATE TABLE IF NOT EXISTS decks (
    id          TEXT PRIMARY KEY,
    user_id     TEXT NOT NULL,
    name        TEXT NOT NULL,
    source_path TEXT NOT NULL DEFAULT '',
    created_at  BIGINT NOT NULL
);
CREATE INDEX IF NOT EXISTS decks_user_id ON decks (user_id);

CREATE TABLE IF NOT EXISTS cards (
    id            TEXT PRIMARY KEY,
    deck_id       TEXT NOT NULL REFERENCES decks (id) ON DELETE CASCADE,
    user_id       TEXT NOT NULL,
    position      INTEGER NOT NULL DEFAULT 0,
    front         TEXT NOT NULL,
    back          TEXT NOT NULL,
    source        TEXT NOT NULL DEFAULT 'notes',
    due_at        BIGINT NOT NULL,
    interval_days DOUBLE PRECISION NOT NULL DEFAULT 0,
    ease          DOUBLE PRECISION NOT NULL DEFAULT 2.5,
    reps          INTEGER NOT NULL DEFAULT 0,
    lapses        INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS cards_user_due ON cards (user_id, due_at);
CREATE INDEX IF NOT EXISTS cards_deck_id ON cards (deck_id);

CREATE TABLE IF NOT EXISTS quiz_results (
    user_id    TEXT NOT NULL,
    path       TEXT NOT NULL,
    correct    INTEGER NOT NULL DEFAULT 0,
    total      INTEGER NOT NULL DEFAULT 0,
    updated_at BIGINT NOT NULL,
    PRIMARY KEY (user_id, path)
);

CREATE TABLE IF NOT EXISTS exams (
    id         TEXT PRIMARY KEY,
    user_id    TEXT NOT NULL,
    course     TEXT NOT NULL,
    exam_date  DATE NOT NULL,
    plan       JSONB NOT NULL,
    created_at BIGINT NOT NULL
);
CREATE INDEX IF NOT EXISTS exams_user_id ON exams (user_id);

CREATE TABLE IF NOT EXISTS usage_daily (
    user_id           TEXT NOT NULL,
    day               DATE NOT NULL,
    questions         BIGINT NOT NULL DEFAULT 0,
    uploads           BIGINT NOT NULL DEFAULT 0,
    pages_read        BIGINT NOT NULL DEFAULT 0,
    upload_failures   BIGINT NOT NULL DEFAULT 0,
    study_requests    BIGINT NOT NULL DEFAULT 0,
    reviews           BIGINT NOT NULL DEFAULT 0,
    prompt_tokens     BIGINT NOT NULL DEFAULT 0,
    completion_tokens BIGINT NOT NULL DEFAULT 0,
    ratings_up        BIGINT NOT NULL DEFAULT 0,
    ratings_down      BIGINT NOT NULL DEFAULT 0,
    PRIMARY KEY (user_id, day)
);
CREATE INDEX IF NOT EXISTS usage_daily_day ON usage_daily (day);

CREATE TABLE IF NOT EXISTS feedback (
    id              TEXT PRIMARY KEY,
    user_id         TEXT NOT NULL,
    kind            TEXT NOT NULL,
    rating          TEXT NOT NULL DEFAULT '',
    selection_stage TEXT NOT NULL DEFAULT '',
    comment         TEXT NOT NULL DEFAULT '',
    question        TEXT NOT NULL DEFAULT '',
    answer          TEXT NOT NULL DEFAULT '',
    sources         TEXT NOT NULL DEFAULT '',
    created_at      BIGINT NOT NULL
);
CREATE INDEX IF NOT EXISTS feedback_created_at ON feedback (created_at);
CREATE INDEX IF NOT EXISTS feedback_user_id ON feedback (user_id);

CREATE TABLE IF NOT EXISTS onenote_tokens (
    user_id    TEXT PRIMARY KEY,
    token      JSONB NOT NULL,
    expires_at BIGINT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS onenote_oauth_states (
    state      TEXT PRIMARY KEY,
    user_id    TEXT NOT NULL,
    expires_at BIGINT NOT NULL
);

CREATE TABLE IF NOT EXISTS library_files (
    path       TEXT PRIMARY KEY,
    subject    TEXT NOT NULL,
    etag       TEXT NOT NULL DEFAULT '',
    status     TEXT NOT NULL,                      -- ok | empty | failed | pending
    details    JSONB NOT NULL DEFAULT '{}'::jsonb,  -- size, pages, OCR counts, method, error, ...
    content    TEXT NOT NULL DEFAULT '',            -- full text, used by the study tools
    updated_at BIGINT NOT NULL
);
"""

APP_TABLES = (
    "cards", "decks", "quiz_results", "exams", "usage_daily", "feedback",
    "onenote_tokens", "onenote_oauth_states", "documents", "folders", "library_files", "users",
)

_engine: Engine | None = None
_async_engine = None
_engine_lock = threading.Lock()
_init_lock = threading.Lock()  # separate from _engine_lock: init() creates the engine while holding it
_ready = False


def _url(driver: str) -> str:
    raw = settings.DATABASE_URL
    if not raw:
        raise RuntimeError("DATABASE_URL is not set. See README.md (Neon: database, sign-in and file storage).")
    for prefix in ("postgresql+psycopg2://", "postgresql+asyncpg://", "postgresql://", "postgres://"):
        if raw.startswith(prefix):
            return f"postgresql+{driver}://" + raw[len(prefix):]
    raise RuntimeError("DATABASE_URL must start with postgresql:// (or postgres://).")


def engine() -> Engine:
    """The shared connection pool (created on first use)."""
    global _engine
    if _engine is None:
        with _engine_lock:
            if _engine is None:
                # pre_ping: free hosts (Neon, Supabase) close idle connections; check before reuse.
                _engine = create_engine(
                    _url("psycopg2"), pool_pre_ping=True, pool_size=5, max_overflow=10, pool_recycle=1800
                )
    return _engine


def async_engine():
    """LlamaIndex's vector store wants an async engine as well; Study AI itself never uses it."""
    global _async_engine
    if _async_engine is None:
        with _engine_lock:
            if _async_engine is None:
                from sqlalchemy.ext.asyncio import create_async_engine

                url = _url("asyncpg").split("?", 1)[0]  # asyncpg doesn't take libpq options like sslmode
                _async_engine = create_async_engine(url)
    return _async_engine


def init() -> None:
    """Create the pgvector extension and the tables if they don't exist yet (safe to repeat)."""
    global _ready
    if _ready:
        return
    with _init_lock:
        if _ready:
            return
        with engine().begin() as conn:
            conn.exec_driver_sql(SCHEMA)
        _ready = True


@contextmanager
def transaction():
    """A connection whose statements all succeed or all roll back together."""
    init()
    with engine().begin() as conn:
        yield conn


def execute(sql: str, conn: Connection | None = None, **params) -> int:
    """Run a statement; returns the number of rows it changed."""
    if conn is not None:
        return conn.execute(text(sql), params).rowcount
    with transaction() as c:
        return c.execute(text(sql), params).rowcount


def rows(sql: str, conn: Connection | None = None, **params) -> list[dict]:
    if conn is not None:
        return [dict(r._mapping) for r in conn.execute(text(sql), params)]
    with transaction() as c:
        return [dict(r._mapping) for r in c.execute(text(sql), params)]


def one(sql: str, conn: Connection | None = None, **params) -> dict | None:
    found = rows(sql, conn, **params)
    return found[0] if found else None


def scalar(sql: str, conn: Connection | None = None, **params):
    found = one(sql, conn, **params)
    return next(iter(found.values())) if found else None


def table_exists(name: str) -> bool:
    return bool(scalar("SELECT to_regclass(:name) IS NOT NULL AS ok", name=f"public.{name}"))


def empty_all_tables() -> None:
    """Delete every row (tests use this between cases). Passage tables are emptied too."""
    init()
    extra = [t for t in ("data_notes", "data_library") if table_exists(t)]
    with engine().begin() as conn:
        conn.exec_driver_sql("TRUNCATE " + ", ".join((*APP_TABLES, *extra)) + " CASCADE")
