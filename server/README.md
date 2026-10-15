# Study AI server

The server behind Interview.ai's **Study AI** tab and the **Ask AI** panel in its Notes tab. It
handles sign-in (through Neon Auth), students' notes (uploads, reading the text out of PDFs and
photos, folders), answers to questions, the study tools (flashcards, quizzes, summaries, decks, exam
plans) and the shared course library that Ask AI searches.

- Python 3.11 + FastAPI (a Python web framework), run with Uvicorn.
- Live at https://diptidhawade-notescanner.hf.space, on the Hugging Face Space `diptidhawade/NoteScanner`
  (it kept the name of the project Study AI started as). GitHub Actions deploys it from this folder:
  see [DEPLOYMENT.md](../DEPLOYMENT.md).
- How it saves notes, answers questions and makes study material is explained in the main README:
  [How Study AI works](../README.md#how-study-ai-works).

## What's in this folder

```
server/
├── backend/                     The app (Python)
│   ├── api.py                   Starts the app: error handling, request limits, CORS, /health, /config
│   ├── settings.py              All settings, limits and search thresholds in one place
│   ├── routes/                  The server's web addresses, grouped by feature
│   │   ├── account.py           Sign up, sign in, passwords, email check, preferences, delete account
│   │   ├── files.py             Folders, uploads, renaming, moving, viewing and editing text
│   │   ├── chat.py              Asking questions, chat attachments (+)
│   │   ├── study.py             Flashcards, quizzes, summaries, decks, Today, exam mode
│   │   ├── onenote.py           OneNote connect and import
│   │   ├── admin.py             Feedback, and the usage and feedback page for admins
│   │   └── library.py           Shared course library: status, admin sync
│   │
│   ├── pipeline/                The notes pipeline (LlamaIndex)
│   │   ├── models.py            The search model, the re-checking model and the language model, in one place
│   │   ├── indexing.py          Text → passages → fingerprints → Postgres (with a keyword index)
│   │   ├── retrieval.py         Question → keyword + meaning search in each place → re-check → best passages
│   │   └── generation.py        Answers, follow-up rewriting, flashcards, quizzes, summaries
│   │
│   ├── db.py                    The Postgres connection and all table definitions
│   ├── store.py                 Account details, folders, file text and OneNote tokens in Postgres
│   ├── ocr.py                   Reading PDFs and photos: Sarvam Vision, with PyMuPDF and Tesseract as backup
│   ├── pages.py                 Works out page numbers for PDF text
│   ├── uploads.py               Reads text out of files; background upload queue
│   ├── library.py               Shared course library: reads course PDFs once, keeps them up to date
│   ├── chat_cache.py            Files attached to one chat (memory only, deleted after 2 hours)
│   ├── study_store.py           Saved decks and the review schedule, quiz results, exam plans
│   ├── vfs_tree.py, paths.py, file_meta.py   Folder tree and file details (e.g. "main source")
│   ├── neon_auth.py             Talks to Neon Auth (accounts, passwords, sign-ins, emails)
│   ├── auth.py, deps.py         Who is making a request (signed-in student or guest)
│   ├── originals.py             Uploaded PDFs and photos in Neon Object Storage
│   ├── rate_limit.py            Request limits
│   ├── usage.py                 Daily usage per student, estimated AI cost, monthly budget
│   ├── preferences.py           Answer language, reminder settings
│   ├── reminders.py, mailer.py  Daily review reminder emails
│   ├── feedback.py, alerts.py   Answer ratings and feedback; error alerts to Slack/Discord
│   ├── onenote_sync.py          Imports OneNote pages through Microsoft sign-in
│   └── starter_notes.py         "Getting started" folder for new accounts
│
├── tests/                       Tests (pytest); fakes.py has stand-ins for Neon Auth and the file bucket
├── scripts/
│   ├── index_library.py         Reads the course PDFs into the shared course library
│   └── answer_quality.py        Asks a fixed list of questions and scores the answers
├── evals/                       Sample questions for answer_quality.py (see evals/README.md)
├── requirements.txt             Python packages (requirements-dev.txt adds test tools)
├── Dockerfile, .dockerignore    Builds the server for Hugging Face Spaces
├── docker-compose.yml           Postgres with pgvector, and the server, on your computer
└── .env                         Your local settings and keys (not in git)
```

## Running it

All commands below run in `server/`. You need Python 3.11, Tesseract, and a `.env` file in this
folder: see [Running it on your computer](../README.md#running-it-on-your-computer) in the main
README for what goes in it.

```bash
python3.11 -m venv venv
venv/bin/pip install --index-url https://download.pytorch.org/whl/cpu torch==2.8.0
venv/bin/pip install -r requirements-dev.txt
venv/bin/uvicorn backend.api:app --port 8000
```

- The CPU-only build of torch goes first: the default one bundles about 2 GB of GPU libraries the
  server doesn't use.
- The first start downloads the two search models (about 1 GB together). The tables are created
  automatically on the first start too.
- Interactive API docs: http://localhost:8000/docs.

**With Docker:** `docker compose up --build` starts Postgres with pgvector (`localhost:5433`; user,
password and database: `notescanner`, kept in the `db_data` volume) and the server on
http://localhost:8000. That server uses the Docker database, whatever `DATABASE_URL` says in `.env`;
sign-in still goes to Neon Auth. `docker compose up db` starts only the database, for a server run
as above with `DATABASE_URL=postgresql://notescanner:notescanner@localhost:5433/notescanner`.

> Run the server as **one process** (one Uvicorn worker, as the `Dockerfile` does). Upload jobs, the
> chat-upload cache, request limits and per-user locks are kept in the server's memory.

## Tests

```bash
venv/bin/python -m pytest -q tests
```

- No AI key, Neon account or Docker needed (Tesseract is). The tests start their own throwaway
  Postgres with pgvector through `pgserver`, use stand-ins for Neon Auth and the file bucket
  (`tests/fakes.py`), and never call Sarvam. They do use the real search models.
- To use your own Postgres instead, set `TEST_DATABASE_URL` (its Study AI tables are emptied!).
- They run on every push and pull request (`.github/workflows/ci.yml`), against a Postgres service
  with pgvector.

---

## Reference

### Settings

The server reads its settings from the environment: `.env` on your computer, the Space's
**Variables and secrets** on Hugging Face.

**Required:** `SARVAM_API_KEY`, `DATABASE_URL` (Postgres with pgvector) and `NEON_AUTH_BASE_URL` (sign-in).

**Optional** (default in brackets):

| Area | Settings |
|---|---|
| Sarvam AI | `SARVAM_API_BASE`, `SARVAM_MODEL_RAG` (`sarvam-105b`), `SARVAM_MODEL_STUDY` (`sarvam-105b`), `SARVAM_DOC_INTEL_LANGUAGE` (`en-IN`), `SARVAM_DOC_INTEL_TIMEOUT` (180 s) |
| Models | `EMBED_MODEL` (`intfloat/multilingual-e5-small`) and `EMBED_DIM` (384): changing them means fingerprinting every passage again; `RERANK_MODEL` (`cross-encoder/mmarco-mMiniLMv2-L12-H384-v1`, empty = off); `LLM_PROVIDER` (`sarvam`, or `openai_like` with `LLM_API_BASE`, `LLM_API_KEY`, `LLM_MODEL` for any OpenAI-style chat service, e.g. DeepSeek on NVIDIA); `LLM_THINKING_OFF` (how that service switches thinking off) and `ANSWER_THINKING` (`true`; `false` = answers start straight away) |
| Security and sizes | `CORS_ORIGINS`: the websites allowed to call the server, comma-separated (`http://localhost:8001`, `http://localhost:5173`, the same two with `127.0.0.1`, and `https://cherie-dips.github.io`). `AUTH_CACHE_SECONDS` (60), `MAX_UPLOAD_MB` (20), `MAX_CHAT_UPLOAD_CHARS` (300000), `CHAT_CACHE_TTL_SECONDS` (7200), `USER_DOCUMENT_MAX_BYTES` (2000000), `RATE_LIMIT_MULTIPLIER` (1) |
| Sign-in | `NEON_AUTH_BASE_URL`; `FRONTEND_URL` (`https://cherie-dips.github.io/SDE-Prep/`): the site's address. Password-reset and reminder emails link there, and it is sent to Neon Auth as the trusted site. Use `http://localhost:8001/` on your computer. |
| Uploaded files | `AWS_ENDPOINT_URL_S3`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `S3_BUCKET`; `MAX_STORED_FILES_MB_PER_USER` (200), `MAX_STORED_FILES_MB_TOTAL` (4500) |
| Reminder emails | `SMTP_HOST`, `SMTP_PORT` (587), `SMTP_USERNAME`, `SMTP_PASSWORD`, `SMTP_FROM`, `SMTP_STARTTLS` (true). Turned on only when `SMTP_HOST` and `SMTP_FROM` are set. Only confirmed emails get reminders. |
| OneNote | `MICROSOFT_CLIENT_ID`, `MICROSOFT_CLIENT_SECRET`, `MICROSOFT_REDIRECT_URI` (`http://localhost:8000/integrations/onenote/callback`) |
| Course library | `LIBRARY_ENABLED` (true), `LIBRARY_SUPABASE_URL` / `LIBRARY_SUPABASE_KEY` / `LIBRARY_BUCKET` (Interview.ai's public bucket), `LIBRARY_PREFIXES` (`plaksha-university`), `LIBRARY_OCR` (`auto`), `LIBRARY_SYNC_HOURS` (0 = by hand). See [DEPLOYMENT.md](../DEPLOYMENT.md#shared-course-library-ask-ai). |
| Pilot | `ADMIN_EMAILS`, `ALERT_WEBHOOK_URL`, `AI_PRICE_PER_PAGE`, `AI_PRICE_PER_1K_INPUT_TOKENS`, `AI_PRICE_PER_1K_OUTPUT_TOKENS`, `AI_PRICE_CURRENCY` (INR), `AI_MONTHLY_BUDGET` (0 = off), `APP_TIMEZONE` (Asia/Kolkata), `REMINDER_HOUR` (8), `REMINDERS_ENABLED` (true), `STARTER_NOTES` (true) |

What each one does, and which to set on the Space, is in [DEPLOYMENT.md](../DEPLOYMENT.md).

Search settings are in `backend/settings.py`: `MIN_SCORE_*` (how high the re-check score, 0 to 1, must
be before a place is used), `CANDIDATES_PER_SEARCH`, `SOURCE_SCORE_WINDOW`, `CHUNK_CHARS` and
`HISTORY_TURNS` (earlier messages used to understand a follow-up).

### Request limits

Limits stop password guessing and keep AI costs predictable. They are the `LIMIT_*` values in
`backend/settings.py`; `RATE_LIMIT_MULTIPLIER` raises or lowers all of them at once.

| What | Limit |
|---|---|
| Any request | 1200 / minute per network address, 300 / minute per signed-in browser (`/health` is never limited) |
| Sign-up / login | 50 sign-ups per hour per address; 10 login attempts per 15 min per email and address (200 per address) |
| Password checks, forgot / reset password | 10 per 15 min per user; 3 reset emails per hour per email; 20 reset attempts per hour per address |
| Uploads (notes and chat attachments) | 30 per 10 min and **200 per day** per user |
| Questions | 60 per 10 min and **300 per day** per user |
| Flashcards / quizzes / summaries | 20 per 10 min and **100 per day** per user |
| Folder changes, saving edited text, decks | 120 per minute; 60 per 10 min; 60 per 10 min per user |
| Delete all notes, OneNote connect / sync | 5 per hour; 10 and 5 per 10 min per user |

Going over a limit returns HTTP `429` with a `Retry-After` header and a clear message, such as
"You've reached the daily limit of 300 questions…". Counters reset when the server restarts.

### API routes

Sign-in uses the `X-Session-Id` header (the sign-in Neon Auth gave at sign-up or sign-in; it lasts 7
days). Study AI and Ask AI both send it. Anything that saves data or uses AI needs a signed-in user.
Full interactive docs are at `/docs` on the running server.

| Area | Routes |
|---|---|
| Accounts | `POST /register`, `POST /register/confirm` (the emailed code; signs in), `POST /register/send_code`, `POST /login`, `POST /logout`, `GET /me`, `GET /guest_id`, `POST /account/change_password` (returns a new `session_id`), `POST /account/delete`, `POST /account/verify_email/send`, `POST /account/verify_email`, `POST /password/forgot`, `POST /password/reset`, `GET/POST /account/preferences` |
| Files | `GET /list_tree`, `POST /create_folder`, `POST /create_file`, `POST /upload_note`, `GET /jobs`, `GET /jobs/{job_id}`, `POST /move_path`, `POST /rename_path`, `POST /delete_path`, `GET/POST /file_text`, `GET /file_original` (a link to the uploaded PDF or photo, valid for 10 minutes), `GET/POST /file_meta`, `DELETE /notes` |
| Chat | `POST /query_folder`, `POST /query_folder/stream` (optional `history`: earlier messages as JSON `[{"role", "content"}]`), `POST /chat/upload_ephemeral`, `POST /chat/session/clear` |
| Study | `POST /study/generate`, `POST /study/summary`, `POST /study/decks`, `GET /study/decks`, `GET /study/decks/{id}/cards`, `POST /study/cards/{id}/review`, `DELETE /study/decks/{id}`, `GET /study/decks/{id}/export`, `GET /study/dashboard`, `POST /study/mcq_results`, `POST /study/exam`, `POST /study/exam_plan`, `GET /study/exams`, `DELETE /study/exams/{id}` |
| Feedback and admin | `POST /feedback`, `GET /admin/stats`, `GET /admin/feedback` (admins only: an `ADMIN_EMAILS` address, confirmed with an emailed code) |
| Course library | `GET /library/status` (public), `GET /admin/library`, `POST /admin/library/sync` (admins only). `library_path` on `/query_folder`, `/query_folder/stream`, `/study/generate` and `/study/summary` asks about a course PDF (this is how Ask AI asks) |
| OneNote | `GET /integrations/onenote/status`, `GET /integrations/onenote/auth_url`, `GET /integrations/onenote/callback`, `POST /integrations/onenote/sync` |
| Service | `GET /health`, `GET /config` |

`/query_folder/stream` sends one JSON object per line: first `meta`, then `delta` lines with pieces of
the answer, then `done` (or `error`). `meta` holds the sources, the place they came from
(`selection_stage`), each place's best re-check score (`score_*_best`, -1 = not searched), and
`search_query` (the question as searched, after a follow-up was rewritten).

### What is stored where (Postgres tables)

| Table | Contents |
|---|---|
| `users` | Study AI's details per account: name, email, privacy acceptance, preferences (passwords and sign-ins are in Neon Auth's own `neon_auth` tables) |
| `documents` | The full text of every file, and where its uploaded original is kept |
| `folders` | Each student's folder tree and file details |
| `decks`, `cards` | Flashcard decks, and each card with its review schedule |
| `quiz_results`, `exams` | Quiz scores per file ("weak topics") and exam plans |
| `usage_daily`, `feedback` | Daily usage counts per student; ratings and feedback |
| `library_files` | Shared course library: one row per PDF (status, page counts) and its full text |
| `onenote_tokens`, `onenote_oauth_states` | OneNote connection |
| `data_notes` | Students' passages: text, fingerprint, keyword index, and file / course / page (made by LlamaIndex) |
| `data_library` | Course library passages: the same, plus how far down the page each one starts |

All tables are defined in `backend/db.py`, except the two passage tables, which LlamaIndex creates
(see `backend/pipeline/indexing.py`). Every search of `data_notes` is limited to one student.

Uploaded PDFs and photos are not in Postgres: they are in Neon Object Storage (`backend/originals.py`).
The course PDFs stay in Interview.ai's Supabase bucket; only their text and passages are stored here.
