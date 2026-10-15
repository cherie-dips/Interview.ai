# Interview.ai

**Live: https://cherie-dips.github.io/SDE-Prep/**

Complete SDE roadmap with a schedule you can pace yourself — pick 1, 2, 4 or 6 months
and the calendar fills in from your start date.

- **Roadmap** — 265 topics across C++, DSA, System Design, OS, CN, DBMS, MERN + DevOps,
  GenAI and Aptitude, each with notes, MCQs and practice problems. System Design includes
  an **App Design** tab covering the app architecture & data modeling round.
- **Calendar** — choose a plan length and date range; the full curriculum is re-paced
  across it. Longer plans add review days. Ticking a topic syncs both ways with the roadmap.
- **Notes** — subject PDFs from Plaksha CSAI courses, served live from Supabase. Every PDF has
  **Ask AI**: ask questions about it and get answers that point to the exact spot in the PDF (click a
  source and the PDF scrolls there), or turn it into flashcards, a quiz or a summary.
- **Study AI** — your own study space: upload your class notes, handouts or photos of handwritten
  pages, ask questions about them, and review flashcards on a schedule. Decks saved from Ask AI show up
  here. One free account works for both Study AI and Ask AI.

> **Note:** the **Roadmap** content — explanations, MCQs and practice sets — is
> AI-generated, so verify anything you rely on. The **Notes** PDFs are real course
> material and are not AI-generated. **Ask AI** answers are written by AI from those PDFs
> and list their sources, so check the spot they cite.

---

## Study AI

Study AI is a study assistant that works from your own notes. Upload your course notes (PDFs, photos
of handwritten pages, text files or OneNote pages), then ask questions and get answers taken from
those notes, with the exact file and page they came from. It can also make flashcards and practice
quizzes, remind you when cards are due, and build a day-by-day revision plan before an exam.

Study AI's server also powers **Ask AI** in the Notes tab. It reads the course PDFs shown there once,
into a shared course library, so students don't have to upload them.

Study AI and its server started as a separate project, NoteScanner, and now live in this repo. A few
internal names, such as the Hugging Face Space's, still say NoteScanner.

### What it helps with

| Problem | What Study AI does |
|---|---|
| **Notes are scattered**: slides, scanned handouts, phone photos of a friend's notebook, a few OneNote pages. | One place for all your notes, in folders (one folder per course). |
| **Photos and scans can't be searched**: Ctrl+F doesn't work on a photo. | Reads the text out of every PDF and photo, including handwriting, so all of it can be searched. You can view and correct that text. |
| **General chatbots don't know your course**: the method, notation or definition can differ from what your class taught. | Answers come from **your notes first**, with clickable sources (file and page). If the notes don't fully cover a question, anything added from general knowledge is marked **📖 Beyond notes**. |
| **Making study material takes time**, so most students skip it and just re-read. | Makes flashcards, multiple-choice quizzes (with explanations) and short summaries from any file in one click. |
| **Cramming doesn't stick**: reviewing a little every day works better, but it's hard to keep track. | Saves flashcards into decks and shows each card again at the right time. A "Today" dashboard, an exam planner, and an optional daily reminder email. |

Answers and study material can be written in English or in one of 10 Indian languages (Hindi, Bengali,
Gujarati, Kannada, Malayalam, Marathi, Odia, Punjabi, Tamil, Telugu).

### Features

**Your notes**
- Folders and files: upload many files at once (or drag and drop), rename, move, delete.
- Uploads are processed in the background, with progress shown for each file.
- Mark a file as a **main source** (for example, the professor's official notes) so answers prefer it.
- **Text view**: see the text Study AI read from a file, fix reading mistakes, or type notes into a new file.
- **OneNote import**: Connect OneNote and Sync OneNote in the profile menu (when Microsoft sign-in is set up on the server).
- Uploaded PDFs and photos are kept too, so they open on any device, not just the one you uploaded from.

**Ask your notes**
- Answers appear word by word as they are written, with sources you can click (with page numbers for PDFs).
- Ask in English or an Indian language: a question in Hindi finds notes written in English, and the other way round.
- Follow-up questions work: "explain that more simply" or "give another example of it" are understood from the chat so far.
- Select any passage in a file and choose **Ask about this**.
- Attach a file to just one chat with the **+** button, without saving it to your notes.
- Maths is shown properly (fractions, equations, symbols).

**Study tools**
- Flashcards and multiple-choice quizzes (with a score and explanations), made from the open file.
  Optional: make flashcards automatically for every upload.
- Short 100–150 word summaries of a file.
- Saved decks with spaced review (Again / Hard / Good / Easy). Export a deck as CSV for Anki.
- **Today**: cards due, streak, weak topics (from quiz scores), last 14 days of activity.
- **Exam**: a day-by-day revision plan up to an exam date, and timed mock tests from a whole course folder.

**Ask AI (Notes tab)**
- Ask about the PDF that's open: answers come from that PDF first, then the rest of its course, and each
  source says where in the PDF it is (click it and the PDF scrolls there).
- Flashcards, quizzes and summaries from a course PDF. Saved decks show up in Study AI's Review tab.

**Accounts and running a pilot**
- Sign up, sign in, change or reset password (by email), confirm your email, delete account.
- The profile menu in the header has Account settings, Send feedback, Privacy, Connect / Sync OneNote and
  Sign out. Admins also see **Usage & feedback**: usage, estimated AI cost and feedback.
- New accounts get a "Getting started" folder with sample notes, so the first question works right away.
- 👍 / 👎 on every answer, and a feedback form.
- An optional monthly AI budget, error alerts to Slack or Discord, weekly encrypted backups, and an uptime check.

---

## How Study AI works

### How the parts fit together

```
 Interview.ai  (site/, on GitHub Pages)
 ├── Calendar, Roadmap   run in your browser; progress is saved in browser storage
 ├── Notes               course PDFs from Supabase; each has an Ask AI panel  ──┐
 └── Study AI tab        a frame showing site/study-ai/ (built from study-ai/) ─┤
                                                                                ▼
 Study AI server  (server/, on Hugging Face Spaces)
 ├── Neon             Postgres + pgvector, Neon Auth (sign-in), file storage
 ├── Sarvam AI        reads PDFs and photos, writes answers
 └── Supabase         the course PDFs, read once into the shared course library
```

- **The site** (`site/`) is one plain HTML page. Calendar, Roadmap and Notes run in the browser.
- **The Study AI tab** shows a second page, `site/study-ai/`, in a frame (a page shown inside another
  page). That page is the React app in `study-ai/`, built into the site. Opened on its own, it sends you
  to the Study AI tab.
- **One sign-in for both.** Study AI and the site are on the same address, so they share browser
  storage: the header and Ask AI read the sign-in that Study AI keeps there.
- **The profile menu** (Account settings, Send feedback, Usage & feedback for admins, Privacy,
  Connect / Sync OneNote, Sign out) is part of the site's header. It asks Study AI, by message, to open
  its windows.
- **Ask AI and Study AI talk to the same server** (`server/`), which does the saving, searching and
  answering described below.

The server has three main flows: **saving a note**, **answering a question**, and **making study
material**, plus the **shared course library** behind Ask AI. The part that saves, searches and
answers is built with **[LlamaIndex](https://www.llamaindex.ai)**, a widely used open-source toolkit
for "ask questions about your documents" apps, on top of one **Postgres** database (see
[Why these tools](#why-these-tools)).

### 1. Saving a note

```
 You upload a file
        │
        ▼
 Quick check: type and size ──► file is queued, you see "processing"
        │
        ▼
 Read the text out of the file
   • PDF   → Sarvam Vision  (backup: PyMuPDF reads the PDF's built-in text)
   • Photo → Sarvam Vision  (backup: Tesseract)
   • .txt / .md / .csv / .json / .log → used as is
        │
        ▼
 Note which page each part of the text came from (PDFs)
        │
        ▼
 Cut the text into short overlapping passages (about 750 characters each),
 breaking at sentence ends where possible
        │
        ▼
 Turn each passage into a "meaning fingerprint" (a list of numbers that captures
 what the passage is about). The model understands 100 languages, including Hindi,
 Bengali, Tamil and the other Indian languages. It runs on the server itself, for free.
        │
        ▼
 Save passages + fingerprints in Postgres. The same rows also get a keyword index,
 so exact words can be found too. The full text is saved separately.
        │
        ▼
 Only now does the file appear in your folder. If any step fails, you see an error and
 the file never shows up half-saved.
```

Reading a long scanned PDF can take a minute or two, which is why this happens in the background.

### 2. Answering a question

```
 You ask a question (optionally about a highlighted passage)
        │
        ▼
 Is it a follow-up ("explain that more simply")? Then rewrite it into a question that
 stands on its own, using the last few messages of the chat
        │
        ▼
 Look for passages in each place, in this order:
   1. Files attached to this chat with +   (kept in memory for 2 hours, never saved)
   2. The file you have open
   3. Other files in the same course folder
   4. All your other notes
 In each place, two searches run together:
   • by meaning: passages whose fingerprint is closest to the question's
   • by keywords: passages containing the question's words ("RREF", "Dijkstra")
        │
        ▼
 A second model re-checks every passage it found: it reads the question and the
 passage together and scores from 0 to 1 how well the passage answers it
        │
        ▼
 Use the first place with a passage that scores high enough (if none does, the best
 place found). Keep up to 8 passages close to the best one. Files marked "main source"
 get a small boost.
        │
        ▼
 Send the question, the earlier messages and those passages to Sarvam AI
 (sarvam-105b) with these rules:
   • Use the notes first and refer to them.
   • If the notes don't fully answer it, add standard textbook knowledge for the
     same subject and label it "📖 Beyond notes".
   • Stay within the course's subject.
   • Write in the student's chosen language.
        │
        ▼
 The answer streams back to you, with the source files and page numbers.
```

Why two searches and a re-check: the meaning search finds a passage about "rate of reaction" for
a question about "how fast a reaction happens"; the keyword search catches exact terms that meaning
alone can miss; and the re-check throws out passages that are only loosely related, so the AI gets
fewer but better passages. A place is only searched if the places before it had nothing good enough,
so most answers need just one search.

### 3. Making study material

```
 You open a file and choose Flashcards, Quiz or Summary
        │
        ▼
 Collect the text: the open file, plus short parts of other files in the same course folder
        │
        ▼
 Send it to Sarvam AI (sarvam-105b, with its long reasoning turned off, so it takes a second or two):
   • Flashcards and quizzes: about 70% straight from the notes, about 30% on closely
     related topics from the same subject (those are labelled "📖 Beyond notes")
   • Quizzes: 4 options each, one-line explanation, answer order shuffled
   • Summaries: 100–150 words, only from the notes
        │
        ▼
 Check the result is in the right format. Retry up to 3 times if not.
 If it still fails, show an error. Study AI never makes up questions on its own,
 because a wrong answer key is worse than no answer key.
```

Saved flashcards follow the same idea as Anki: each time you review a card you grade it
(Again / Hard / Good / Easy), and Study AI decides when to show it next. Easy cards come back
after longer and longer gaps; cards you forget come back in 10 minutes.

### 4. The shared course library (behind Ask AI)

The Notes tab shows course PDFs from a public Supabase Storage bucket. Instead of every student
uploading the same PDFs, the server reads each one **once** and keeps it in shared tables. The PDFs
themselves stay in Supabase.

```
 server/scripts/index_library.py  (or POST /admin/library/sync, or every LIBRARY_SYNC_HOURS)
        │
        ▼
 List the bucket. Skip PDFs that haven't changed (same eTag, the version tag Supabase gives
 each file); remove PDFs that were deleted.
        │
        ▼
 For each page:
   • typed text       → PyMuPDF (free)
   • handwriting/scan → cut into page-shaped pieces at blank rows (no line of writing is split),
                        read with Sarvam Vision, at most 10 pieces per job (Sarvam's limit);
                        Tesseract when there's no Sarvam key
        │
        ▼
 Cut into passages and fingerprint them, like a note. Each passage remembers its page and how far down
 the page it starts, so the Notes tab can scroll to the exact spot.
```

When Ask AI asks a question it sends `library_path` (the open PDF). The search ranks that PDF and the
rest of its course together, with a small lead for the open PDF, so a lecture that clearly answers the
question wins. The student's own notes are used only when they really match.

---

## Tech stack

Interview.ai itself is plain HTML, CSS and JavaScript: there is no build step, and the browser opens
the files as they are. Study AI is a React app that is built into the site. Both AI features talk to
one server.

| Part | Tool | What it's used for |
|---|---|---|
| **Site** | HTML, CSS, JavaScript | Interview.ai: Calendar, Roadmap, Notes, and the Study AI tab's frame. |
| | Browser storage | Saves your ticked topics and calendar plan on your own device (no login needed), and the sign-in that Study AI and Ask AI share. |
| | Supabase Storage | Holds the Notes PDFs. |
| | PDF.js | Shows the PDFs inside the page. |
| | marked, DOMPurify, KaTeX | Show Ask AI answers: formatting, safely cleaned, with maths. Loaded the first time Ask AI is used. |
| | Google Analytics | Counts site visits. |
| **Study AI** | React 19 + Vite | The Study AI tab. Vite builds it into `site/study-ai/`. |
| | react-markdown, KaTeX | Showing formatted answers and maths. |
| **Server** | Python 3.11 + FastAPI (run with Uvicorn) | Handles sign-in, uploads, questions and study tools, for both Study AI and Ask AI. |
| **Reading files** | Sarvam Vision (Sarvam AI Document Intelligence) | Reads text from PDFs, scans and handwriting. |
| | PyMuPDF | Backup for PDFs that already contain text; reads the typed pages of course PDFs. |
| | Tesseract | Backup for photos of printed text. |
| **Notes pipeline** | [LlamaIndex](https://www.llamaindex.ai) | Cuts notes into passages, makes fingerprints, runs the keyword + meaning search in Postgres, re-checks passages, and talks to the language model. |
| **Search models** (free, on the server) | `intfloat/multilingual-e5-small` | Makes the "meaning fingerprints". Understands 100 languages. |
| | `cross-encoder/mmarco-mMiniLMv2-L12-H384-v1` | Re-checks how well each passage answers the question (also multilingual). |
| **Database** | [Neon](https://neon.com) Postgres with the pgvector extension | One database for everything: account details, folders, file text, decks, usage, and the passages with their fingerprints and keyword index. pgvector is the Postgres add-on that stores and searches fingerprints. |
| **File storage** | Neon Object Storage (S3-compatible, so it works like Amazon S3) | Keeps students' uploaded PDFs and photos. The course PDFs stay in Supabase. |
| **Writing answers** | Sarvam AI `sarvam-105b`, through LlamaIndex | Writes answers, rewrites follow-up questions, and makes flashcards, quizzes and summaries. Another provider can be switched in with a setting. |
| **Sign-in** | Neon Auth | Accounts and passwords (stored scrambled), password-reset and email-confirmation emails. The server talks to it for the browser, so sign-in works in every browser. |
| **Hosting** | GitHub Pages | Hosts the site, with Study AI built in. |
| | Hugging Face Spaces (Docker) | Hosts the Study AI server. |
| | GitHub Actions | Runs tests on every change, deploys, makes weekly backups, checks the server is up. |
| **Testing** | pytest (with a throwaway Postgres from pgserver), ESLint | Server tests and Study AI code checks. |

### Why these tools

- **LlamaIndex** for the notes pipeline. We compared the RAG frameworks (RAG: find the passages that
  answer a question, then have a language model write the answer from them) in
  [DataCamp's list](https://www.datacamp.com/blog/rag-framework) against what Study AI needs: a
  per-student library of notes in many languages, a fixed search order (open file, course,
  everything), page numbers, and a cheap free-tier server. LlamaIndex fits best: it is built for "ask
  questions about your documents", has a ready Sarvam connector, works with Postgres for keyword +
  meaning search, and has the re-checking step built in, while still letting us keep our own search
  order and file reading. Haystack would also work, but needs more wiring for the same result;
  LangChain is broader (agents, tools) than we need. RAGFlow, Cognita, R2R and Verba are whole separate
  apps with their own accounts and databases (RAGFlow wants 8–16 GB of memory), so they would
  duplicate Study AI instead of powering it, and don't fit a free server. The rest are small
  projects, research tools, or aimed at other jobs.
- **Postgres** for storage: one ordinary database holds everything. Keyword search, meaning search
  and filters run in one place, and changes are all-or-nothing (no half-saved files). Each search
  covers one student's notes or one course, which Postgres scans exactly in milliseconds.
- **Sarvam AI** as the language model: it is built for Indian languages (answers in 10 of them), the
  same key already reads PDFs and photos, and costs are in rupees. To compare another model, set
  `LLM_PROVIDER=openai_like` (see [the server's settings](server/README.md#settings)) and run the
  answer-quality test before and after.

---

## Project structure

```
SDE-Prep/
├── site/                         The website, published to GitHub Pages
│   ├── index.html                Interview.ai's only page. Loads all the CSS and JS below.
│   ├── css/
│   │   ├── style.css             Look of the whole site
│   │   ├── notes.css             Look of the Notes tab
│   │   └── study-ai.css          Study AI tab's frame, the Ask AI panel and the header's profile menu
│   ├── js/
│   │   ├── app.js                Runs the Calendar and Roadmap, holds the study schedule, saves progress
│   │   ├── content-cpp-dsa.js    C++ topics (also the old DSA list, now hidden)
│   │   ├── content-dsa.js        DSA Patterns: 94 patterns, each with practice problems
│   │   ├── content-sysdes.js     System Design topics
│   │   ├── content-appdesign.js  App Design tab (shown inside System Design)
│   │   ├── content-cs.js         Operating Systems, Computer Networks, DBMS
│   │   ├── content-dev.js        MERN + DevOps, GenAI / ML / DL, Aptitude
│   │   ├── notes-data.js         List of Notes subjects, and the Supabase address
│   │   ├── notes.js              Runs the Notes tab and the PDF viewer
│   │   └── study-ai.js           Study AI tab's frame, Ask AI panel, header profile menu
│   │                             (incl. OneNote connect / sync), and the shared sign-in
│   ├── assets/notes/             Cover image for the Notes category
│   └── study-ai/                 The Study AI build (not in git; made by `npm run build` in study-ai/
│                                 and by the deploy workflow)
│
├── study-ai/                     Study AI's code (React + Vite). Builds into site/study-ai/.
│   ├── package.json, vite.config.js, ...   Packages, build and code-check settings
│   └── src/
│       ├── main.jsx, App.jsx     Start-up and sign-in boxes (opened on its own, goes to the Study AI tab)
│       ├── pages/                Home (the main app), ChatPage (shown when signed out), Login, Register,
│       │                         ResetPassword
│       ├── components/           Parts of the page: Explorer (folders), QueryInterface (chat),
│       │                         StudyPanel, StudyDecks, StudyToday, ExamMode, FileTextView,
│       │                         upload progress, settings, feedback, privacy note, admin page
│       ├── config.js             The server's address
│       ├── auth.js               Sign-in state (kept in browser storage, shared with the site)
│       ├── embed.js              Messages from the Interview.ai page around it (header menu, sign-in)
│       ├── index.css, embed.css  Styles, in Interview.ai's colours
│       ├── localFileStore.js     Keeps a copy of your files on this device for quick viewing
│       ├── localDiskFolder.js    Optional: mirror your folders into a "Study AI" folder on your computer
│       └── studyApi.js, studyUtils.js, chatHistory.js, virtualPath.js   Small helpers
│
├── server/                       The Study AI server (FastAPI), runs on Hugging Face. See server/README.md
│   ├── backend/                  The app: api.py, routes/, pipeline/ (LlamaIndex), db.py, store.py,
│   │                             neon_auth.py, originals.py, library.py, ...
│   ├── tests/                    Server tests (pytest), with stand-ins for Neon Auth and the file bucket
│   ├── scripts/                  index_library.py (read the course PDFs into the shared library),
│   │                             answer_quality.py (score answers to a fixed list of questions)
│   ├── evals/                    Sample questions for answer_quality.py
│   ├── requirements.txt          Python packages (requirements-dev.txt adds test tools)
│   ├── Dockerfile, .dockerignore Builds the server for Hugging Face Spaces
│   ├── docker-compose.yml        Postgres with pgvector, and the server, on your computer
│   └── .env                      Your local settings and keys (not in git)
│
├── .github/workflows/
│   ├── deploy-site.yml           Builds Study AI and publishes site/ to GitHub Pages
│   ├── deploy-server.yml         Sends the server to the Hugging Face Space
│   ├── ci.yml                    Server tests, Study AI code check and build
│   ├── backup.yml                Weekly encrypted database backup
│   └── uptime.yml                Checks every 15 minutes that the server answers
│
└── DEPLOYMENT.md                 How to put it online
```

---

## Running it on your computer

You need Python 3.11, Node 20.19 or newer (Vite needs it) and Tesseract (`brew install tesseract` on
macOS, `apt install tesseract-ocr` on Ubuntu). You also need a [Neon](https://neon.com) project for the
database, sign-in and file storage (see [DEPLOYMENT.md](DEPLOYMENT.md#neon-database-sign-in-and-file-storage)),
and a Sarvam API key from [sarvam.ai](https://www.sarvam.ai).

### 1. Create `server/.env`

In the `server/` folder, create a file named `.env` (it is not in git):

```bash
SARVAM_API_KEY=your-sarvam-key

# Neon (neon.com): Postgres, sign-in and file storage. All three come from the Neon Console.
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
NEON_AUTH_BASE_URL=https://ep-....neonauth.<region>.aws.neon.tech/neondb/auth
AWS_ENDPOINT_URL_S3=https://....storage.<region>.aws.neon.tech
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=ap-southeast-1
S3_BUCKET=usernotes
# The site on your computer (Neon Auth trusts localhost): where password-reset links lead back to.
FRONTEND_URL=http://localhost:8001/
```

- Without the file-storage settings (`AWS_*`, `S3_BUCKET`), only the text read from each file is kept.
- Without a Sarvam key, uploads fall back to PyMuPDF and Tesseract, but questions and study tools
  won't work.
- To keep the database on your computer instead of Neon, run `docker compose up db` in `server/`
  (Postgres with pgvector on port 5433) and set
  `DATABASE_URL=postgresql://notescanner:notescanner@localhost:5433/notescanner`. Sign-in still goes to
  Neon Auth.
- The tables are created automatically the first time the server starts.

### 2. Start the server

```bash
cd server
python3.11 -m venv venv
venv/bin/pip install --index-url https://download.pytorch.org/whl/cpu torch==2.8.0
venv/bin/pip install -r requirements-dev.txt
venv/bin/uvicorn backend.api:app --port 8000
```

The CPU-only build of torch goes first because the default one bundles about 2 GB of GPU libraries the
server doesn't use. The first start downloads the two search models (about 1 GB together), so it
takes a little longer. The server runs at http://localhost:8000, with interactive API docs at
http://localhost:8000/docs.

### 3. Build Study AI into the site

In a second terminal, from the project folder:

```bash
cd study-ai
npm ci
npm run build
```

This puts Study AI into `site/study-ai/`. Run `npm run build` again after changing anything in `study-ai/`.

### 4. Serve the site

From the project folder:

```bash
python3 -m http.server 8001 -d site
```

Then open http://localhost:8001.

- When the site is served from `localhost`, Ask AI and Study AI both use the server at
  http://localhost:8000 automatically.
- To point both at another server, for example the live one, run this in the browser console and reload:

  ```js
  localStorage.setItem('studyai_api', 'https://diptidhawade-notescanner.hf.space')
  ```

  `localStorage.removeItem('studyai_api')` (then reload) goes back to the local server.
- Keep `FRONTEND_URL=http://localhost:8001/` in `server/.env` while working locally: password-reset
  emails lead back there.
- The server accepts requests from http://localhost:8001 and http://localhost:5173 (and the live
  site) without any setting. Other addresses need `CORS_ORIGINS` (see [the server's settings](server/README.md#settings)).

### Working on Study AI by itself

```bash
cd study-ai
npm run dev
```

Open http://localhost:5173. Changes show up as soon as you save, without a build. It talks to
http://localhost:8000. It is shown without Interview.ai's header, so the profile menu (account
settings, sign out, ...) isn't there; use the full site for those.

### With Docker

```bash
cd server
docker compose up --build
```

- This starts Postgres with pgvector (`localhost:5433`; user, password and database: `notescanner`) and
  the server (http://localhost:8000). The database is kept in the `db_data` volume.
- The server in Docker uses that database, whatever `DATABASE_URL` says in `server/.env`. The rest of
  `server/.env` still applies: sign-in goes to Neon Auth, so it needs `NEON_AUTH_BASE_URL` and
  `FRONTEND_URL=http://localhost:8001/`.
- Then build Study AI and serve the site as in steps 3 and 4.

### Tests

The server, from `server/`:

```bash
venv/bin/python -m pytest -q tests
```

Study AI (code check and build), from `study-ai/`:

```bash
npx eslint . && npm run build
```

The server tests need Tesseract, but no AI key, Neon account or Docker: they start their own
throwaway Postgres (with pgvector) through `pgserver`, and use stand-ins for Neon Auth and the file
bucket (`server/tests/fakes.py`). To use your own Postgres instead, set `TEST_DATABASE_URL` (its
Study AI tables are emptied!). Both run automatically on every push and pull request
(`.github/workflows/ci.yml`).

---

## Putting it online

- The site, with Study AI built in → **GitHub Pages**, published by `.github/workflows/deploy-site.yml`
  on every push to `main` that changes `site/` or `study-ai/`. The repo's Settings → Pages → Source
  must be **GitHub Actions**.
- The Study AI server → **Hugging Face Spaces** (Docker), deployed by `.github/workflows/deploy-server.yml`
  on every push to `main` that changes `server/`, once the `HF_TOKEN` secret is set.

Step-by-step instructions, the server's settings, backups and checks are in [DEPLOYMENT.md](DEPLOYMENT.md).

> Run the server as **one process** (one Uvicorn worker). Upload jobs, chat attachments and request
> limits are kept in the server's memory.

---

## Reference

The server's settings, request limits, API routes and database tables are in
[server/README.md](server/README.md#reference).
