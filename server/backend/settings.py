"""Settings read from the environment, plus request limits and thresholds in one place."""
import json
import os


def _env_str(name: str, default: str) -> str:
    return (os.getenv(name) or default).strip() or default


def _env_float(name: str, default: float) -> float:
    try:
        return float(_env_str(name, str(default)))
    except ValueError:
        return default


def _env_bool(name: str, default: bool) -> bool:
    return _env_str(name, "true" if default else "false").lower() in ("1", "true", "yes", "on")


def _env_json(name: str, default: dict) -> dict:
    try:
        value = json.loads(os.getenv(name) or "null")
    except ValueError:
        return default
    return value if isinstance(value, dict) else default


MAX_UPLOAD_MB = _env_float("MAX_UPLOAD_MB", 20)
MAX_UPLOAD_BYTES = int(MAX_UPLOAD_MB * 1024 * 1024)
MAX_ACTIVE_UPLOADS_PER_USER = 10  # queued + processing; each holds the file in memory until done
CHAT_CACHE_TTL_SECONDS = int(_env_float("CHAT_CACHE_TTL_SECONDS", 7200))
MAX_CHAT_UPLOAD_CHARS = int(_env_float("MAX_CHAT_UPLOAD_CHARS", 300000))
MAX_CHAT_FILES_PER_SESSION = 10
MAX_EDITED_TEXT_CHARS = 500000
USER_DOCUMENT_MAX_BYTES = int(_env_float("USER_DOCUMENT_MAX_BYTES", 2000000))  # stored text per file

# ---------- Database ----------
# One Postgres database (with the pgvector extension) holds everything: accounts, folders, decks,
# usage, and the note passages with their search fingerprints. Neon and Supabase both work.
DATABASE_URL = (os.getenv("DATABASE_URL") or "").strip()

# ---------- Sign-in (Neon Auth, see backend/neon_auth.py) ----------
# Accounts, passwords, password-reset and email-check emails are handled by Neon Auth. Its address is
# in the Neon Console under Auth -> Configuration, e.g. https://ep-....neonauth.<region>.aws.neon.tech/neondb/auth
NEON_AUTH_BASE_URL = (os.getenv("NEON_AUTH_BASE_URL") or "").strip().rstrip("/")
AUTH_CACHE_SECONDS = _env_float("AUTH_CACHE_SECONDS", 60)  # how long a checked sign-in is trusted

# ---------- Students' original files (PDFs and photos) ----------
# Kept in an S3-compatible bucket (Neon Object Storage) so they open on any device. Without these
# settings only the text read from each file is kept. The course library's PDFs stay in Supabase.
FILES_S3_ENDPOINT = (os.getenv("AWS_ENDPOINT_URL_S3") or "").strip()
FILES_S3_BUCKET = (os.getenv("S3_BUCKET") or "").strip()
FILES_S3_REGION = _env_str("AWS_REGION", "us-east-1")
MAX_STORED_FILES_MB_PER_USER = _env_float("MAX_STORED_FILES_MB_PER_USER", 200)
MAX_STORED_FILES_MB_TOTAL = _env_float("MAX_STORED_FILES_MB_TOTAL", 4500)  # Neon's free plan: 5 GB

# ---------- AI models (see backend/pipeline/models.py) ----------
# Search model: turns passages and questions into "meaning fingerprints". Multilingual, so a question
# in Hindi finds notes in English and the other way round. Changing it means re-indexing all notes.
EMBED_MODEL = _env_str("EMBED_MODEL", "intfloat/multilingual-e5-small")
EMBED_DIM = int(_env_float("EMBED_DIM", 384))
# Re-checking model: reads the question and each candidate passage together and scores how well the
# passage answers it (0..1). "" turns it off (search then ranks by the fingerprints alone).
RERANK_MODEL = (os.getenv("RERANK_MODEL") if os.getenv("RERANK_MODEL") is not None
                else "cross-encoder/mmarco-mMiniLMv2-L12-H384-v1").strip()
# Language model: "sarvam" (default) or "openai_like" (any service with an OpenAI-style chat API,
# set LLM_API_BASE, LLM_API_KEY and LLM_MODEL). Sarvam Vision still reads PDFs and photos either way.
LLM_PROVIDER = _env_str("LLM_PROVIDER", "sarvam").lower()
LLM_API_BASE = (os.getenv("LLM_API_BASE") or "").strip()
LLM_API_KEY = (os.getenv("LLM_API_KEY") or "").strip()
LLM_MODEL = (os.getenv("LLM_MODEL") or "").strip()
# With openai_like: extra request fields that switch the model's thinking off. Quick jobs (rewriting
# follow-up questions, flashcards, quizzes, summaries) always run without thinking. The default suits
# DeepSeek and Qwen on NVIDIA, DeepInfra and Together; Gemini and gpt-oss use {"reasoning_effort": "low"};
# OpenRouter uses {"reasoning": {"enabled": false}}.
LLM_THINKING_OFF = _env_json("LLM_THINKING_OFF", {"chat_template_kwargs": {"thinking": False}})
# Whether the model thinks before answering questions: first words come later, hard questions can
# get better answers. Off = answers start straight away.
ANSWER_THINKING = _env_bool("ANSWER_THINKING", True)

# Passages: notes are cut into pieces of about this many characters, overlapping a little.
CHUNK_CHARS = 750
CHUNK_OVERLAP_CHARS = 100

# Relevance (0..1, from the re-checking model) a source needs to count as answering the question.
MIN_SCORE_CHAT_UPLOAD = 0.15
MIN_SCORE_OPEN_FILE = 0.10
MIN_SCORE_COURSE = 0.15
MIN_SCORE_ALL_NOTES = 0.15
MAIN_SOURCE_BOOST = 0.03  # small ranking boost for files the student marked as their main source
SOURCE_SCORE_WINDOW = 0.6  # keep excerpts scoring within this much of the best one...
MIN_KEEP_SCORE = 0.05      # ...and at least this relevant (unless nothing is: then the best few)
CANDIDATES_PER_SEARCH = 8  # passages taken by meaning and (separately) by keywords, per place searched
HISTORY_TURNS = 6          # earlier chat messages used to understand a follow-up question

# Request limits as (max requests, window seconds). Per-IP limits are generous because a whole
# campus can share one public IP; the per-email login limit is what stops password guessing.
LIMIT_REGISTER_PER_IP = (50, 3600)
LIMIT_LOGIN_PER_IP = (200, 900)
LIMIT_LOGIN_PER_EMAIL = (10, 900)
LIMIT_PASSWORD_CHECK_PER_USER = (10, 900)  # change password / delete account
LIMIT_FORGOT_PER_IP = (20, 3600)
LIMIT_FORGOT_PER_EMAIL = (3, 3600)
LIMIT_GUEST_ID_PER_IP = (100, 3600)
LIMIT_UPLOADS_PER_USER = (30, 600)
LIMIT_QUESTIONS_PER_USER = (60, 600)
LIMIT_STUDY_PER_USER = (20, 600)
LIMIT_ONENOTE_SYNC_PER_USER = (5, 600)
LIMIT_ONENOTE_CONNECT_PER_USER = (10, 600)
LIMIT_RESET_PER_IP = (20, 3600)            # using password-reset links
LIMIT_TREE_CHANGES_PER_USER = (120, 60)    # create, move, rename, delete, main-source marking
LIMIT_TEXT_EDITS_PER_USER = (60, 600)      # saving edited text (re-processes the file for search)
LIMIT_DECK_CHANGES_PER_USER = (60, 600)    # creating and deleting flashcard decks
LIMIT_DELETE_ALL_PER_USER = (5, 3600)      # "delete all my notes"

# Overall caps on every request (checked before any route), on top of the per-route limits above.
LIMIT_ALL_PER_IP = (1200, 60)      # one network address (a campus may share one)
LIMIT_ALL_PER_SESSION = (300, 60)  # one signed-in browser
UNLIMITED_PATHS = ("/health",)     # monitoring checks are never limited

# Daily caps on paid AI use per user (cost control): uploads read by Sarvam Vision, questions and
# study tools answered by Sarvam chat models.
LIMIT_UPLOADS_PER_DAY = (200, 86400)
LIMIT_QUESTIONS_PER_DAY = (300, 86400)
LIMIT_STUDY_PER_DAY = (100, 86400)

MIN_PASSWORD_LEN = 8
MAX_PASSWORD_LEN = 128  # Neon Auth's limit

# The website (Interview.ai). Password-reset and reminder emails link here; Neon Auth trusts its origin.
FRONTEND_URL = _env_str("FRONTEND_URL", "https://cherie-dips.github.io/Interview.ai/")

DEFAULT_CORS_ORIGINS = (
    "http://localhost:8001",  # the site on your computer (python3 -m http.server 8001 -d site)
    "http://127.0.0.1:8001",
    "http://localhost:5173",  # Study AI alone (npm run dev in study-ai/)
    "http://127.0.0.1:5173",
    "https://cherie-dips.github.io",
)


def allowed_origins() -> list[str]:
    """Websites allowed to call this API (CORS_ORIGINS env, comma-separated)."""
    raw = (os.getenv("CORS_ORIGINS") or "").strip()
    if not raw:
        return list(DEFAULT_CORS_ORIGINS)
    return [o.strip().rstrip("/") for o in raw.split(",") if o.strip()]


# ---------- Shared course library (read once on the server, searched by every student) ----------
# The PDFs behind Interview.ai's Notes tab: a public Supabase Storage bucket. The key is that project's
# publishable anon key, already served in plain text by Interview.ai (site/js/notes-data.js); it can only
# read the bucket. Never put a service_role key here.
LIBRARY_ENABLED = _env_bool("LIBRARY_ENABLED", True)
LIBRARY_SUPABASE_URL = _env_str("LIBRARY_SUPABASE_URL", "https://jlmzxsaysnvoxbutfkxw.supabase.co").rstrip("/")
LIBRARY_SUPABASE_KEY = _env_str(
    "LIBRARY_SUPABASE_KEY",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpsbXp4c2F5c252b3hidXRma3h3Iiwicm9sZSI6"
    "ImFub24iLCJpYXQiOjE3NzIwNDA2NTcsImV4cCI6MjA4NzYxNjY1N30.VvBgtpcmwuhoBSdjUKE5A3_9At-S2cCznCqfS_ECUkg",
)
LIBRARY_BUCKET = _env_str("LIBRARY_BUCKET", "Notes")
# Top-level folders of the bucket to index (comma-separated). Interview.ai shows only this category.
LIBRARY_PREFIXES = tuple(
    p.strip().strip("/") for p in _env_str("LIBRARY_PREFIXES", "plaksha-university").split(",") if p.strip()
)
# How handwritten and scanned pages are read: auto (Sarvam Vision when SARVAM_API_KEY is set, else
# Tesseract), sarvam, tesseract, or off (only pages that already contain text).
LIBRARY_OCR = _env_str("LIBRARY_OCR", "auto").lower()
# Check the bucket for new or changed PDFs every N hours. 0 = only when started by hand
# (scripts/index_library.py or the admin endpoint), because reading pages with Sarvam costs money.
LIBRARY_SYNC_HOURS = _env_float("LIBRARY_SYNC_HOURS", 0)
MIN_SCORE_LIBRARY_FILE = 0.10     # the course PDF the student has open (same bar as an open file)
MIN_SCORE_LIBRARY_SUBJECT = 0.15  # the other PDFs of that course


# ---------- Running a pilot ----------
APP_TIMEZONE = _env_str("APP_TIMEZONE", "Asia/Kolkata")  # "today", streaks and reminder times use this
STARTER_NOTES = _env_bool("STARTER_NOTES", True)          # new accounts get a "Getting started" folder
PRIVACY_VERSION = "2026-10-15"                            # bump when the privacy note changes
ADMIN_EMAILS = {e.strip().lower() for e in (os.getenv("ADMIN_EMAILS") or "").split(",") if e.strip()}
ALERT_WEBHOOK_URL = (os.getenv("ALERT_WEBHOOK_URL") or "").strip()  # Slack/Discord-style webhook for errors

# AI cost estimate. Prices are 0 (unknown) until you set them from your Sarvam plan.
AI_PRICE_PER_PAGE = _env_float("AI_PRICE_PER_PAGE", 0)                  # Sarvam Vision, per page read
AI_PRICE_PER_1K_INPUT_TOKENS = _env_float("AI_PRICE_PER_1K_INPUT_TOKENS", 0)
AI_PRICE_PER_1K_OUTPUT_TOKENS = _env_float("AI_PRICE_PER_1K_OUTPUT_TOKENS", 0)
AI_PRICE_CURRENCY = _env_str("AI_PRICE_CURRENCY", "INR")
AI_MONTHLY_BUDGET = _env_float("AI_MONTHLY_BUDGET", 0)  # 0 = no budget; otherwise paid AI pauses when reached

# Daily review reminder emails (only when SMTP is set up and the student turned them on).
REMINDERS_ENABLED = _env_bool("REMINDERS_ENABLED", True)
REMINDER_HOUR = int(_env_float("REMINDER_HOUR", 8))  # local hour (APP_TIMEZONE) after which reminders go out

ANSWER_LANGUAGES = (
    "English", "Hindi", "Bengali", "Gujarati", "Kannada", "Malayalam",
    "Marathi", "Odia", "Punjabi", "Tamil", "Telugu",
)
