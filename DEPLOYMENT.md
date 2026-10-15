# Putting Interview.ai online

Interview.ai goes online in two parts:

| Part | Where it runs | Deployed by |
|---|---|---|
| The site (`site/`), with Study AI built into `site/study-ai/` | GitHub Pages: https://cherie-dips.github.io/SDE-Prep/ | `.github/workflows/deploy-site.yml`, on every push to `main` that changes `site/` or `study-ai/` |
| The Study AI server (`server/`) | Hugging Face Space `diptidhawade/NoteScanner`: https://diptidhawade-notescanner.hf.space | `.github/workflows/deploy-server.yml`, on every push to `main` that changes `server/` |

The server uses [Neon](https://neon.com) for its database, sign-in and students' uploaded files, and
Sarvam AI for reading files and writing answers. The course PDFs in the Notes tab stay in
Interview.ai's Supabase bucket.

## Moving from the two old repos (once)

Before the merge, this repo published the site from its branch, and Study AI and its server lived in
the NoteScanner repo, which also had its own site at https://cherie-dips.github.io/NoteScanner/.
To switch over:

- [ ] **Publish the site with GitHub Actions.** In SDE-Prep: Settings → Pages → Build and deployment →
  Source: **GitHub Actions**. Publishing from a branch can only use the repo's top folder or
  `docs/`, and the site now lives in `site/`.
- [ ] **Add the secrets and the variable to SDE-Prep** (Settings → Secrets and variables → Actions).
  GitHub never shows a secret's value again, so take each value from its source (Hugging Face,
  the Neon Console, your password manager):
  - secret `HF_TOKEN`: a Hugging Face token with write access ([Automatic deploy](#automatic-deploy-github-actions));
  - secrets `DATABASE_URL` and `BACKUP_PASSPHRASE` ([Backups and restore](#backups-and-restore));
  - variable `BACKEND_URL` = `https://diptidhawade-notescanner.hf.space` ([Uptime check](#uptime-check)).
- [ ] **Fix `FRONTEND_URL` on the Space** (Space → Settings → Variables and secrets): set it to
  `https://cherie-dips.github.io/SDE-Prep/`, or delete it (that is the default). While it still
  points to `/NoteScanner/`, password-reset and reminder emails lead to the old address.
- [ ] **Deploy and check.** Push to `main` (or run both deploy workflows by hand from the Actions
  tab), then go through [Check it works](#check-it-works).
- [ ] **Retire the NoteScanner repo.** First turn off its GitHub Pages site (its Settings → Pages), so
  https://cherie-dips.github.io/NoteScanner/ stops serving the old app. Then archive the repo
  (Settings → General → Danger Zone → Archive this repository). Pages comes first because an
  archived repo is read-only.

## The site: GitHub Pages

1. In SDE-Prep, set Settings → Pages → Build and deployment → Source to **GitHub Actions** (once).
2. Push to `main`. `.github/workflows/deploy-site.yml` runs when `site/`, `study-ai/` or the workflow
   itself has changed (or by hand: Actions tab → "Deploy site to GitHub Pages" → Run workflow). It:
   - installs Study AI's packages at the exact versions in `study-ai/package-lock.json` (`npm ci`),
     so commit the lockfile whenever you add or update packages;
   - runs the code checker (ESLint) and builds Study AI into `site/study-ai/`;
   - publishes the whole `site/` folder to https://cherie-dips.github.io/SDE-Prep/.

No secrets are needed. `site/study-ai/` isn't in git: the workflow builds it every time. The site and
Study AI find the server by themselves. Its address is in `site/js/study-ai.js` (`STUDY_AI_API`) and
`study-ai/src/config.js`; keep the two in step if the server moves.

## The Study AI server: Hugging Face Space

The server runs on the Hugging Face Space `diptidhawade/NoteScanner` (it kept the name of the project
Study AI started as): https://diptidhawade-notescanner.hf.space. A Space is an app hosted by Hugging
Face. This one is a Docker Space: it builds `server/Dockerfile`, which downloads the two search
models during the build and runs the server on `${PORT}` (default `7860`) as one process.

1. In the Space's **Settings → Variables and secrets**, add the settings below (at least the
   [required ones](#required-space-secrets)).
2. Deploy the code, automatically (recommended) or by hand.
3. Wait for the Space to finish building, then open https://diptidhawade-notescanner.hf.space/health.
   It should show `{"status":"ok"}`.

### Automatic deploy (GitHub Actions)

`.github/workflows/deploy-server.yml` sends the server to the Space on every push to `main` that
changes `server/` (a push that only changes `server/tests/` or `server/evals/` doesn't deploy), or
by hand (Actions tab → "Deploy server to Hugging Face" → Run workflow).

1. On Hugging Face, create a **write** access token: Settings → Access Tokens → New token (type: Write).
2. In SDE-Prep, go to Settings → Secrets and variables → Actions → New repository secret and add
   `HF_TOKEN` = that token.
3. Push to `main`. Without `HF_TOKEN` the workflow skips the deploy and shows a notice instead of failing.

What it sends: `server/backend/`, `server/Dockerfile`, `server/.dockerignore` and
`server/requirements.txt`, into the Space's top folder, replacing the Space's other files. It also
writes the Space's `README.md` (below). The site isn't sent (it lives on GitHub Pages), and no binary
files are sent (Spaces reject them unless they use Git LFS). The Space then rebuilds and restarts.

### Space README front matter

Hugging Face reads the Space's settings from a YAML block at the very top of its `README.md` (the
"front matter"):

```yaml
---
title: Study AI server
emoji: "📚"
colorFrom: green
colorTo: gray
sdk: docker
app_port: 7860
pinned: false
---
```

The deploy workflow writes this block, followed by two lines saying what the Space is and where its
code lives. If you upload files to the Space by hand, keep this block at the top of the Space's `README.md`.

### Manual deploy (only if you don't use the workflow)

In the Space's **Files** tab, upload what the workflow sends: `backend/`, `Dockerfile`,
`.dockerignore` and `requirements.txt` from `server/`, and a `README.md` that starts with the front
matter above.

### Required Space secrets

- `SARVAM_API_KEY`
- `DATABASE_URL` and `NEON_AUTH_BASE_URL`
- For students' uploaded files: `AWS_ENDPOINT_URL_S3`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`,
  `AWS_REGION` and `S3_BUCKET`

The Neon ones come from the Neon Console: see [Neon: database, sign-in and file storage](#neon-database-sign-in-and-file-storage).

### The site's address

- `FRONTEND_URL`: leave it unset, or set it to `https://cherie-dips.github.io/SDE-Prep/` (the
  default). Password-reset emails lead back there (to the Study AI tab), reminder emails link there,
  and the server tells Neon Auth that this is the site it signs people in for. `http://localhost:8001/`
  belongs only in a local `server/.env`.
- `CORS_ORIGINS`: the websites allowed to call the server (CORS is the browser's rule for which sites
  may do that), comma-separated. Only needed if the site moves away from `https://cherie-dips.github.io`.
  The default also allows the local addresses (`http://localhost:8001`, `http://localhost:5173`, and
  the same two with `127.0.0.1`); setting it replaces the whole list.

### Sarvam settings (optional)

`SARVAM_API_BASE` (the default works), `SARVAM_MODEL_RAG` and `SARVAM_MODEL_STUDY` (both default to
`sarvam-105b`), `SARVAM_DOC_INTEL_LANGUAGE` (default `en-IN`) and `SARVAM_DOC_INTEL_TIMEOUT` (default
180 seconds).

### AI models (optional)

The search model and the re-checking model are downloaded while the image is built and run on the
Space itself (free). The defaults are multilingual; change them only together with a re-index.

- `EMBED_MODEL` (default `intfloat/multilingual-e5-small`) and `EMBED_DIM` (default `384`)
- `RERANK_MODEL` (default `cross-encoder/mmarco-mMiniLMv2-L12-H384-v1`; empty turns re-checking off)
- `LLM_PROVIDER`: `sarvam` (default) or `openai_like` to try another language model with an
  OpenAI-style chat API; then also set `LLM_API_BASE`, `LLM_API_KEY` and `LLM_MODEL`. Sarvam Vision
  still reads PDFs and photos. Run the [answer-quality test](#answer-quality-test) before and after switching.
  Example, DeepSeek on NVIDIA: `LLM_API_BASE=https://integrate.api.nvidia.com/v1`,
  `LLM_MODEL=deepseek-ai/deepseek-v4.1-flash`, `LLM_API_KEY` = your `nvapi-...` key (as a secret).
  NVIDIA's free API is a trial for testing (about 40 requests a minute, not for a live app); the same
  model on a paid service (DeepInfra, Together, OpenRouter) needs only these three settings changed.
- `LLM_THINKING_OFF` (with `openai_like`): the request fields that switch the model's thinking off,
  as JSON. Default `{"chat_template_kwargs": {"thinking": false}}` (NVIDIA, DeepInfra, Together);
  for OpenRouter use `{"reasoning": {"enabled": false}}`.
- `ANSWER_THINKING` (default `true`): `false` makes answers start straight away, without the model
  thinking first. Follow-up rewriting, flashcards, quizzes and summaries never use thinking.

### Security settings (optional)

- `MAX_UPLOAD_MB`, `MAX_CHAT_UPLOAD_CHARS`, `CHAT_CACHE_TTL_SECONDS`, `AUTH_CACHE_SECONDS` and
  `USER_DOCUMENT_MAX_BYTES` (defaults in [the server's settings](server/README.md#settings)).
- Request limits (overall per address and browser, logins, uploads, questions, study tools, daily AI
  caps) are the `LIMIT_*` values in `server/backend/settings.py`; see
  [Request limits](server/README.md#request-limits). To loosen or tighten all of them without a code
  change, set `RATE_LIMIT_MULTIPLIER` (e.g. `2` doubles every limit).

### Emails

Password-reset and email-confirmation emails are sent by Neon Auth (see below); nothing to set here
apart from `FRONTEND_URL`.

**Daily review reminders** need your own email account (SMTP, the standard way to send email), and
only go to confirmed emails:

- `SMTP_HOST`: your email provider's SMTP server, e.g. `smtp.gmail.com`
- `SMTP_PORT`: usually `587`
- `SMTP_USERNAME` and `SMTP_PASSWORD`: the login for that server (for Gmail, an app password)
- `SMTP_FROM`: the sender address shown to students, e.g. `Study AI <noreply@example.com>`
- `SMTP_STARTTLS`: `true` (default) for port 587

Students turn reminders on in Account settings. `REMINDER_HOUR` (default `8`, in `APP_TIMEZONE`,
default `Asia/Kolkata`) is the hour after which the day's emails go out; `REMINDERS_ENABLED=false`
turns the feature off.

### OneNote import (optional)

`MICROSOFT_CLIENT_ID`, `MICROSOFT_CLIENT_SECRET` and `MICROSOFT_REDIRECT_URI`, from a Microsoft app
registration. The redirect address is the server's `/integrations/onenote/callback`, e.g.
`https://diptidhawade-notescanner.hf.space/integrations/onenote/callback` (the default is the
`localhost:8000` one). Without these settings, the profile menu doesn't offer Connect OneNote.

### Running a pilot (optional settings)

- `ADMIN_EMAILS`: comma-separated emails that can open "Usage & feedback" in the profile menu
  (active students, questions, uploads, pages read, reviews, ratings, feedback, estimated cost).
  The email must be confirmed first: Account settings → "Confirm your email".
- `ALERT_WEBHOOK_URL`: a Slack or Discord incoming-webhook address. Server crashes, failed uploads,
  AI outages and failed reminder emails are posted there (each kind at most once per 10 minutes).
- AI cost estimate: `AI_PRICE_PER_PAGE` (Sarvam Vision, per page), `AI_PRICE_PER_1K_INPUT_TOKENS`,
  `AI_PRICE_PER_1K_OUTPUT_TOKENS` and `AI_PRICE_CURRENCY` (default `INR`). Copy the prices from
  your Sarvam plan; until they're set the admin page shows usage counts but no cost.
- `AI_MONTHLY_BUDGET`: once this month's estimated cost reaches it, reading files, answers and study
  tools pause until next month (notes and flashcard reviews keep working). `0` (default) = no limit.
  Needs the prices above.
- `STARTER_NOTES=false`: don't give new accounts the "Getting started" folder.

## Neon: database, sign-in and file storage

One [Neon](https://neon.com) project (free plan) gives the server three things:

- **Postgres** with **pgvector** (the add-on that stores and searches the passages' meaning
  fingerprints): account details, folders, file text, decks, usage, and the passages. The server
  turns on pgvector and creates its tables on first start.
- **Neon Auth**: accounts and passwords, password-reset and email-confirmation emails.
- **Object storage**: students' uploaded PDFs and photos only. The course PDFs stay in Interview.ai's
  Supabase bucket and are never copied to Neon.

Setting it up:

1. Create a project and pick a region; it can't be changed later. Every database call travels between
   the server and the database, so the nearer the two are, the faster each request. This project's
   database is in AWS Singapore (`ap-southeast-1`) while the Hugging Face server runs in AWS US East
   (N. Virginia), which adds roughly 0.2 s to each database call; for a new project, pick the region
   nearest the server. Turn on **Postgres**, **Object storage** and **Neon Auth**.
2. **Connect** → copy the connection string → Space secret `DATABASE_URL` (and the SDE-Prep repository
   secret `DATABASE_URL`, for the backups).
3. **Auth** → copy the Auth URL → Space secret `NEON_AUTH_BASE_URL`. Under **Domains**, add the
   site's address, `https://cherie-dips.github.io` (localhost is allowed already). Without it,
   sign-up and sign-in fail with "Sign-in isn't set up correctly on this server".
   Email and password sign-in must be on. Neon sends the emails from its own address; you can
   switch to your own email provider in the same place.
   **Require email verification** is optional (it is on in this project). When it's on, Neon emails
   new students a code, and Study AI asks for that code before their first sign-in (also when they
   sign in before confirming). Either way, admins and reminder emails need a confirmed email.
4. **Storage** → create a private bucket (e.g. `usernotes`) and an access key with read and write
   access → Space secrets `AWS_ENDPOINT_URL_S3`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`,
   `AWS_REGION` (e.g. `ap-southeast-1`) and `S3_BUCKET`. Without these, only the text of uploads is
   kept. The free plan has 5 GB; `MAX_STORED_FILES_MB_PER_USER` (200) and `MAX_STORED_FILES_MB_TOTAL`
   (4500) keep the server within it.

## Checks on every push (CI)

`.github/workflows/ci.yml` runs on every push to `main` and on pull requests:

- **Server tests**: in `server/`, installs Tesseract and the pinned packages and runs the tests in
  `server/tests/` against a Postgres service with pgvector (no AI service needed). On your computer
  the tests start their own Postgres instead.
- **Study AI**: runs ESLint and a production build in `study-ai/`.

## Check it works

1. https://diptidhawade-notescanner.hf.space/health shows `{"status":"ok"}`.
2. Open https://cherie-dips.github.io/SDE-Prep/ and the **Study AI** tab. Sign up or sign in, then check:
   - uploading a file in the explorer
   - asking a question
   - attaching a file to a chat with **+**
   - making flashcards or a quiz
3. Ask for a password reset: the email's link should open the site with the reset box in the Study AI tab.
4. Check Ask AI as in [Check the course library](#check-the-course-library).

## Shared course library (Ask AI)

The Notes tab shows course PDFs from Interview.ai's public Supabase bucket; they stay there. **Ask AI**
asks the server about them: questions, flashcards, quizzes and summaries. The server reads each PDF
**once** into the shared course library (`server/backend/library.py`), which every student searches;
nothing is copied per student. `https://cherie-dips.github.io` is already allowed by the default
`CORS_ORIGINS`.

### Index the course PDFs (once)

From your computer, with `DATABASE_URL` (the database it writes into) and `SARVAM_API_KEY` in
`server/.env`, and the server's packages installed (see [the README](README.md#2-start-the-server)):

```bash
cd server
venv/bin/python scripts/index_library.py --dry-run   # lists the PDFs, how many pieces need OCR, and the cost
venv/bin/python scripts/index_library.py             # reads and indexes them
```

OCR means reading text from an image of a page. Handwritten and scanned pages are read with Sarvam
Vision (≈ ₹0.5 per piece at Sarvam's listed price; `--dry-run` prints the total first). Typed pages
are read for free. Without a Sarvam key the script uses Tesseract instead (free, much weaker on
handwriting). Running it again only reads new or changed PDFs.

Other options: `--only <folder>` (only PDFs under that bucket folder, e.g.
`plaksha-university/discrete-maths`; can be repeated), `--limit N` (at most N PDFs), `--force`
(re-read PDFs even when unchanged) and `--redo-tesseract` (re-read PDFs where Sarvam failed and
Tesseract was used).

Or from the server, as an admin (`ADMIN_EMAILS`): `POST /admin/library/sync` starts a sync in the
background, and `GET /admin/library` shows each PDF's status.

### Keep it up to date

- After adding PDFs to the Supabase bucket, run the script again (or the admin sync), or
- set `LIBRARY_SYNC_HOURS` (e.g. `24`) on the Space to check the bucket automatically.

Library OCR counts towards `AI_MONTHLY_BUDGET`; when the budget is used up, PDFs that need OCR wait for
the next sync (typed PDFs are still indexed).

### Settings (all optional)

| Setting | Default | What it does |
|---|---|---|
| `LIBRARY_ENABLED` | `true` | Turn the shared library (and Ask AI's course search) on or off |
| `LIBRARY_SUPABASE_URL`, `LIBRARY_SUPABASE_KEY`, `LIBRARY_BUCKET` | Interview.ai's bucket | Where the PDFs are (the key is the public, read-only anon key) |
| `LIBRARY_PREFIXES` | `plaksha-university` | Bucket folders to index (comma-separated) |
| `LIBRARY_OCR` | `auto` | `auto` (Sarvam if a key is set, else Tesseract), `sarvam`, `tesseract` or `off` |
| `LIBRARY_SYNC_HOURS` | `0` | Re-check the bucket every N hours (`0` = only when started by hand) |

### Check the course library

1. https://diptidhawade-notescanner.hf.space/library/status lists the indexed PDFs.
2. In Interview.ai, open Notes → a course PDF → **Ask AI**: sign in, ask a question, click a source
   (the PDF scrolls to that spot).
3. Open the **Study AI** tab: you are already signed in, and a deck saved from Ask AI is under Review.

## Good to know

- A free Space may sleep when idle, so the first request after a quiet spell is slow. The two search
  models are downloaded while the image is built, so waking up doesn't download them again; they load
  in the background right after start-up.
- The server must run as a single process (one Uvicorn worker, as the `Dockerfile` does): upload jobs,
  the chat-upload cache, request limits and per-user locks live in that process's memory.
- If Study AI or Ask AI can't reach the server, check `/health` and the Space's build logs first. A
  browser where `studyai_api` was set in browser storage uses that address instead (see the
  [README](README.md#4-serve-the-site)).
- If the browser console shows a CORS error, add the site's address to `CORS_ORIGINS`.

## Backups and restore

Postgres holds the only copy of every student's account details, notes, folders and flashcard decks
(Neon Auth's accounts are in the same database, in the `neon_auth` schema). Regular backups, and
checking that they can be restored, are how this project protects against losing that data (a bad
deploy, an accidental delete, or a problem with the database account). Neon also keeps its own short
history, but don't rely on that alone. The backup covers the database only: students' uploaded PDFs
and photos in Neon Object Storage aren't in it (the text read from them is).

### Weekly automatic backup

`.github/workflows/backup.yml` runs every Sunday at 03:00 India time (and on demand from the
Actions tab → "Weekly backup" → Run workflow). It runs `pg_dump` (from the official Postgres 18
image, the same version as Neon's) and encrypts the result. Add these repository secrets to SDE-Prep
(Settings → Secrets and variables → Actions → Secrets):

- `DATABASE_URL`: the same value as on the Space.
- `BACKUP_PASSPHRASE`: a long random passphrase. **Store it somewhere safe outside GitHub** (a
  password manager): without it the backups can't be opened.

Until both are set, the workflow skips with a notice. Each run saves one encrypted file,
`study-ai-backup-<time>.dump.gpg`, as a workflow artifact named `study-ai-backup-<run id>` (kept 90
days). The backup holds password hashes and students' notes, so it's encrypted before upload:
artifacts of a public repository can be downloaded by others.

### Back up by hand

With Docker installed (no local Postgres tools needed), and `DATABASE_URL` set in your terminal:

```bash
docker run --rm -e DATABASE_URL postgres:18 \
  sh -c 'pg_dump --format=custom --no-owner --no-privileges "$DATABASE_URL"' > study-ai.dump
```

Keep backup files private.

### Open an encrypted backup

Download the artifact from the workflow run (it's a zip containing the `.gpg` file), then:

```bash
gpg --decrypt study-ai-backup-<time>.dump.gpg > study-ai.dump
```

(gpg asks for `BACKUP_PASSPHRASE`.)

### Restore

Restore into an **empty** database (for example a new Neon branch or Supabase project), check it, then
point `DATABASE_URL` at it:

```bash
docker run --rm -i -e DATABASE_URL postgres:18 \
  sh -c 'pg_restore --no-owner --no-privileges --dbname="$DATABASE_URL"' < study-ai.dump
```

### Test a restore (do this at least once, and after big changes)

A backup you have never restored isn't proof you can recover. To test without touching live data:

1. Create a second, empty database (a Neon branch, or a second Supabase project).
2. Restore into it as above, with `DATABASE_URL` set to the test database for that one command.
3. Run the server locally against it
   (`cd server && DATABASE_URL=<test database> venv/bin/uvicorn backend.api:app --port 8000`), serve
   the site as in the [README](README.md#4-serve-the-site), and check you can sign in, see your folders
   and files, ask a question and review a deck.
4. Delete the test database afterwards.

## Uptime check

`.github/workflows/uptime.yml` calls the server's `/health` every 15 minutes and fails if it doesn't
answer `{"status":"ok"}` within 30 seconds. GitHub emails a failed run to the person who last changed
the workflow's schedule. To turn it on, add the repository variable `BACKEND_URL` to SDE-Prep
(Settings → Secrets and variables → Actions → Variables): `https://diptidhawade-notescanner.hf.space`.

- A free Space that has gone to sleep can take longer than 30 seconds to wake up, so expect a failure
  now and then until the server is on always-on hosting. The regular checks also keep a free Space awake.
- GitHub pauses scheduled workflows in repositories with no activity for 60 days; re-enable it from the
  Actions tab if that happens.

## Answer-quality test

`server/scripts/answer_quality.py` signs in to a running server, asks a fixed list of questions and
scores whether each answer contains the key points it should (0–100 overall). Run it before and after
changing the AI prompts, the AI model or the search settings, and compare the two runs. From `server/`:

```bash
export STUDYAI_PASSWORD='test account password'
venv/bin/python scripts/answer_quality.py --api https://diptidhawade-notescanner.hf.space \
  --email answer-test@example.com --questions evals/sample_questions.json \
  --baseline evals/results/<earlier run>.json --min-score 70 --max-drop 5
```

`STUDYAI_EMAIL` and `STUDYAI_API` can stand in for `--email` and `--api`. Use a separate test account,
with its email confirmed (Neon asks for that before the first sign-in).
`evals/sample_questions.json` works with the "Getting started" notes every new account receives; write
about 30 questions from a real course's notes as described in `server/evals/README.md`. Results are
saved in `server/evals/results/`, which isn't in git: copy a run into `server/evals/` to keep it as a
baseline.
