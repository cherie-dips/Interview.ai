// ====== STUDY AI + ASK AI ======
// Study AI is the "Study AI" tab: its own page, study-ai/ (built from the repo's study-ai/ folder),
// shown in a frame. Ask AI is a panel in the Notes tab that asks the Study AI server about the course
// PDF that is open: the server indexes these PDFs once (its shared course library) and answers from
// them, citing where in the PDF each answer came from.
//
// The frame is on this site, so the two share one sign-in: Study AI keeps its session in localStorage
// under notescanner_session_id, and this file reads it. This page holds the profile menu and asks
// Study AI (by postMessage) to open its windows.

// The Study AI server (keep in step with study-ai/src/config.js). On your computer it's
// http://localhost:8000; set localStorage.studyai_api (e.g. to the live server) and reload to use another.
const STUDY_AI_API = (function () {
  try { const o = localStorage.getItem('studyai_api'); if (o) return o.replace(/\/+$/, ''); } catch (e) {}
  if (['localhost', '127.0.0.1'].indexOf(location.hostname) >= 0) return 'http://localhost:8000';
  return 'https://diptidhawade-notescanner.hf.space';
})();
const STUDY_AI_APP = new URL('study-ai/', location.href).href;
const NS_SESSION_KEY = 'notescanner_session_id';
const NS_NAME_KEY = 'notescanner_user_name';
const NS_USER_KEY = 'notescanner_user_id';
const AI_SUGGESTIONS = [
  'Summarize these notes',
  'Explain the main idea simply',
  'What should I remember for the exam?',
  'Give me 3 practice questions with answers',
];

// ---- session ----
function aiSession() {
  try { return localStorage.getItem(NS_SESSION_KEY) || ''; } catch (e) { return ''; }
}
function aiForgetSession() {
  // The server rejected the session (expired, or signed out elsewhere) - same as Study AI does.
  try { [NS_SESSION_KEY, NS_NAME_KEY, NS_USER_KEY].forEach(k => localStorage.removeItem(k)); } catch (e) {}
}

// ---- server calls ----
function aiErrorText(data, status) {
  if (data && typeof data.detail === 'string' && data.detail) return data.detail;
  if (data && data.error) return String(data.error);
  if (status === 429) return 'Too many requests right now. Please wait a moment and try again.';
  return 'Something went wrong. Please try again.';
}
const AI_OFFLINE = "Can't reach Study AI right now. Please check your connection and try again.";

// POST multipart form data; resolves to the JSON body, rejects with a readable Error.
function aiPost(path, fields) {
  const body = new FormData();
  Object.keys(fields).forEach(k => body.append(k, fields[k]));
  return fetch(STUDY_AI_API + path, { method: 'POST', headers: { 'X-Session-Id': aiSession() }, body })
    .catch(() => { throw new Error(AI_OFFLINE); })
    .then(res => res.json().catch(() => ({})).then(data => {
      if (res.status === 401) { aiForgetSession(); askAiRender(); throw new Error('Please sign in again.'); }
      if (!res.ok) throw new Error(aiErrorText(data, res.status));
      return data;
    }));
}

// /query_folder/stream: newline-delimited JSON - meta (sources), delta (answer text)*, done | error.
async function aiAskStream(question, libraryPath, onMeta, onDelta) {
  const body = new FormData();
  body.append('query', question);
  body.append('library_path', libraryPath);
  let res;
  try {
    res = await fetch(STUDY_AI_API + '/query_folder/stream', {
      method: 'POST', headers: { 'X-Session-Id': aiSession() }, body,
    });
  } catch (e) { throw new Error(AI_OFFLINE); }
  if (res.status === 401) { aiForgetSession(); throw new Error('Please sign in again.'); }
  if (!res.ok || !res.body) {
    const data = await res.json().catch(() => ({}));
    throw new Error(aiErrorText(data, res.status));
  }
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buf = '';
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    let nl;
    while ((nl = buf.indexOf('\n')) >= 0) {
      const line = buf.slice(0, nl).trim();
      buf = buf.slice(nl + 1);
      if (!line) continue;
      let msg;
      try { msg = JSON.parse(line); } catch (e) { continue; }
      if (msg.type === 'meta') onMeta(msg);
      else if (msg.type === 'delta') onDelta(msg.text || '');
      else if (msg.type === 'error') throw new Error(msg.error || 'The AI could not answer right now.');
    }
  }
}

// Which course PDFs the server has read (public, cached by the server for a minute).
let aiLibrary = null;
let aiLibraryLoading = null;
function aiLoadLibrary(force) {
  if (aiLibraryLoading && !force) return aiLibraryLoading;
  aiLibraryLoading = fetch(STUDY_AI_API + '/library/status')
    .then(r => r.ok ? r.json() : null)
    .then(j => { aiLibrary = j && j.enabled ? { ready: new Set(j.ready || []) } : null; })
    .catch(() => { aiLibrary = null; })
    .then(() => askAiRender());
  return aiLibraryLoading;
}

// ---- answer rendering: markdown + math, sanitised ----
// Loaded the first time Ask AI shows an answer, so the rest of the site doesn't pay for them.
let aiLibsPromise = null;
function aiLoadLibs() {
  if (aiLibsPromise) return aiLibsPromise;
  const css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = 'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.19.0/katex.min.css';
  document.head.appendChild(css);
  const load = src => new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src; s.onload = resolve; s.onerror = reject;
    document.head.appendChild(s);
  });
  aiLibsPromise = Promise.all([
    load('https://cdnjs.cloudflare.com/ajax/libs/marked/18.1.0/lib/marked.umd.min.js'),
    load('https://cdnjs.cloudflare.com/ajax/libs/dompurify/3.4.16/purify.min.js'),
    load('https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.19.0/katex.min.js'),
  ]).then(() => {
    if (window.DOMPurify) {
      window.DOMPurify.addHook('afterSanitizeAttributes', node => {
        if (node.tagName === 'A') { node.setAttribute('target', '_blank'); node.setAttribute('rel', 'noopener noreferrer'); }
      });
    }
  }).catch(() => {}).then(() => askAiRender());
  return aiLibsPromise;
}

const AI_MATH = [
  [/\$\$([\s\S]+?)\$\$/g, true],
  [/\\\[([\s\S]+?)\\\]/g, true],
  [/\\\(([\s\S]+?)\\\)/g, false],
  [/\$(?=\S)([^$\n]+?)(?<=\S)\$(?!\d)/g, false],
];

// The answer is untrusted model output: markdown is sanitised by DOMPurify, and maths goes through
// KaTeX (which escapes its input) only after that, swapped in for placeholders.
function aiRender(md) {
  const text = String(md || '');
  if (!window.marked || !window.DOMPurify) return '<p>' + esc(text).replace(/\n/g, '<br>') + '</p>';
  const math = [];
  // Code spans and blocks keep their dollar signs; maths is taken out of the rest.
  const src = text.split(/(```[\s\S]*?```|`[^`\n]*`)/).map((part, i) => {
    if (i % 2) return part;
    AI_MATH.forEach(([re, display]) => {
      part = part.replace(re, (_, tex) => { math.push([tex, display]); return '@@M' + (math.length - 1) + '@@'; });
    });
    return part;
  }).join('');
  const html = window.DOMPurify.sanitize(window.marked.parse(src, { gfm: true, breaks: true }));
  return html.replace(/@@M(\d+)@@/g, (whole, n) => {
    if (!math[+n]) return whole;  // the answer itself contained the placeholder text
    const [tex, display] = math[+n];
    if (!window.katex) return esc(display ? '$$' + tex + '$$' : '$' + tex + '$');
    try {
      return window.katex.renderToString(tex, { displayMode: display, throwOnError: false, output: 'html' });
    } catch (e) { return esc(tex); }
  });
}

// ---- Study AI tab ----
let studyFrame = null;
let studyFrameLoaded = false;
let studyPendingAuth = null;   // 'login' | 'register' to open once the frame is ready
let studyPendingCommand = null; // e.g. {type: 'studyai:open', what: 'settings'} from the header menu
let studyReturnTo = null;      // where to go back to after signing in from Ask AI

// The password-reset email links to this page (?reset=1&token=…, or &error=… once the link has
// expired). Pass those to Study AI, which shows the matching box, and keep them out of this address.
let studyLinkParams = (function () {
  try {
    const params = new URLSearchParams(location.search);
    if (params.get('reset') !== '1') return null;
    const link = new URLSearchParams();
    ['reset', 'token', 'error'].forEach(k => { if (params.has(k)) link.set(k, params.get(k)); params.delete(k); });
    const rest = params.toString();
    history.replaceState(null, '', location.pathname + (rest ? '?' + rest : '') + '#study');
    return link;
  } catch (e) { return null; }
})();

function studyAiOrigin() {
  try { return new URL(STUDY_AI_APP).origin; } catch (e) { return location.origin; }
}

function studyAiView() {
  const host = document.getElementById('v-study');
  if (!host) return;
  if (!studyFrame) {
    const url = new URL(STUDY_AI_APP);
    if (studyLinkParams) studyLinkParams.forEach((v, k) => url.searchParams.set(k, v));
    else if (studyPendingAuth && !aiSession()) url.searchParams.set('auth', studyPendingAuth);
    studyLinkParams = null;
    studyPendingAuth = null;
    host.innerHTML = '<div class="study-loading">Loading Study AI…</div>';
    studyFrame = document.createElement('iframe');
    studyFrame.className = 'study-frame';
    studyFrame.title = 'Study AI';
    studyFrame.allow = 'clipboard-write; microphone; fullscreen';
    studyFrame.src = url.href;
    studyFrame.addEventListener('load', () => {
      studyFrameLoaded = true;
      host.classList.add('loaded');
      if (studyPendingAuth || studyPendingCommand) setTimeout(studyAiFlush, 400);
    });
    host.appendChild(studyFrame);
  } else if (studyFrameLoaded) {
    // Back on this tab: let Study AI reload what may have changed (e.g. a deck saved in Ask AI).
    studyAiPost({ type: 'studyai:shown' });
    studyAiFlush();
  }
}

function studyAiFlush() {
  if (studyPendingAuth) studyAiSendAuth();
  if (studyPendingCommand) { studyAiPost(studyPendingCommand); studyPendingCommand = null; }
}

// Ask Study AI to do something (open a window), switching to its tab first.
function studyAiCommand(msg) {
  studyPendingCommand = msg;
  if (document.getElementById('v-study').classList.contains('on')) studyAiFlush();
  else switchView('study');
}

function studyAiPost(msg) {
  try { studyFrame.contentWindow.postMessage(msg, studyAiOrigin()); } catch (e) {}
}

function studyAiSendAuth() {
  if (!studyFrame || !studyPendingAuth) return;
  studyAiPost({ type: 'studyai:auth', view: studyPendingAuth });
  studyPendingAuth = null;
}

// Ask AI's "Sign in": open Study AI's sign-in box, then come back here once signed in.
function studyAiSignIn(view) {
  studyPendingAuth = view === 'register' ? 'register' : 'login';
  studyReturnTo = location.hash || '#notes';
  switchView('study');
}

function studyAiOpen() { switchView('study'); }

// Signed in or out in Study AI (or another tab): update Ask AI, and return from a sign-in trip.
window.addEventListener('storage', e => {
  if (e.key !== null && e.key !== NS_SESSION_KEY) return;
  askAiRender();
  profileRender();
  const onStudyTab = document.getElementById('v-study').classList.contains('on');
  if (!onStudyTab) studyReturnTo = null;  // they moved on; don't pull them back later
  if (aiSession() && studyReturnTo && /^#notes/.test(studyReturnTo)) {
    const back = studyReturnTo;
    studyReturnTo = null;
    try { history.pushState(null, '', back); } catch (err) {}
    switchView('notes', true);
    if (!notesRestoreFromHash()) notesGoList(false);
    toast('Signed in. Ask away!');
  }
});

// ---- Profile menu (header, right of the stats; shown while signed in) ----
const ICON_USER = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/></svg>';
let profileOpen = false;
let profileInfo = null;       // GET /me: name, email, is_admin
let profileInfoFor = '';      // the session profileInfo belongs to
let profileOneNote = null;    // {connected} when the server offers OneNote; null otherwise
let studyAiConfig = null;     // GET /config (the server's features), once it has loaded

function profileRender() {
  const host = document.getElementById('hdrProfile');
  if (!host) return;
  const session = aiSession();
  if (!session) { host.innerHTML = ''; profileOpen = false; profileInfo = null; profileInfoFor = ''; return; }
  if (profileInfoFor !== session) { profileInfoFor = session; profileInfo = null; profileOneNote = null; profileLoad(session); }
  let name = '';
  try { name = localStorage.getItem(NS_NAME_KEY) || ''; } catch (e) {}
  const info = profileInfo || {};
  let h = `<button type="button" class="hdr-profile-btn${profileOpen ? ' on' : ''}" onclick="profileToggle(event)" title="Account" aria-label="Account" aria-haspopup="menu" aria-expanded="${profileOpen}">${ICON_USER}</button>`;
  if (profileOpen) {
    h += `<div class="hdr-menu" role="menu">
        <div class="hdr-menu-who"><b>${esc(info.name || name || 'Your account')}</b>${info.email ? `<span>${esc(info.email)}</span>` : ''}</div>
        <button type="button" role="menuitem" onclick="profileOpenIn('settings')">Account settings</button>
        <button type="button" role="menuitem" onclick="profileOpenIn('feedback')">Send feedback</button>
        ${info.is_admin ? `<button type="button" role="menuitem" onclick="profileOpenIn('admin')">Usage &amp; feedback</button>` : ''}
        <button type="button" role="menuitem" onclick="profileOpenIn('privacy')">Privacy</button>
        ${profileOneNote ? (profileOneNote.connected
          ? `<button type="button" role="menuitem" onclick="profileOpenIn('onenote-sync')">Sync OneNote</button>`
          : `<button type="button" role="menuitem" onclick="profileOneNoteConnect()">Connect OneNote</button>`) : ''}
        <button type="button" role="menuitem" class="hdr-menu-out" onclick="profileSignOut()">Sign out</button>
      </div>`;
  }
  host.innerHTML = h;
}

function profileLoad(session) {
  fetch(STUDY_AI_API + '/me', { headers: { 'X-Session-Id': session } })
    .then(r => {
      if (r.status === 401) { aiForgetSession(); return null; }
      return r.ok ? r.json() : null;
    })
    .then(j => {
      if (j && aiSession() === session) profileInfo = j;
      profileRender();
      askAiRender();
    })
    .catch(() => {});
}

function profileToggle(e) {
  e.stopPropagation();
  profileOpen = !profileOpen;
  profileRender();
  if (profileOpen) profileLoadOneNote(aiSession());
}

// Whether to offer "Connect OneNote" or "Sync OneNote" (only when the server has OneNote set up).
function profileLoadOneNote(session) {
  const config = studyAiConfig ? Promise.resolve(studyAiConfig)
    : fetch(STUDY_AI_API + '/config').then(r => r.ok ? r.json() : null).then(j => { if (j) studyAiConfig = j; return j; });
  config
    .then(cfg => cfg && cfg.onenote_configured
      ? fetch(STUDY_AI_API + '/integrations/onenote/status', { headers: { 'X-Session-Id': session } }).then(r => r.ok ? r.json() : null)
      : null)
    .then(status => {
      if (aiSession() !== session) return;
      profileOneNote = status ? { connected: !!status.connected } : null;
      if (profileOpen) profileRender();
    })
    .catch(() => {});
}

// Microsoft's sign-in opens in a new tab; that has to happen here, during the click (a frame can't).
// Syncing runs in Study AI (profileOpenIn('onenote-sync')), so the new pages show in its file list.
function profileOneNoteConnect() {
  profileClose();
  const tab = window.open('', '_blank');
  if (tab) tab.opener = null;
  fetch(STUDY_AI_API + '/integrations/onenote/auth_url', { headers: { 'X-Session-Id': aiSession() } })
    .catch(() => { throw new Error(AI_OFFLINE); })
    .then(res => res.json().catch(() => ({})).then(data => {
      if (!res.ok || !data.auth_url) throw new Error(aiErrorText(data, res.status));
      if (tab) tab.location.href = data.auth_url;
      else location.assign(data.auth_url);
      toast('Finish connecting in the new tab, then choose Sync OneNote here.');
    }))
    .catch(err => {
      if (tab) tab.close();
      toast(esc("Couldn't start the OneNote connection. " + (err.message || '')));
    });
}

function profileClose() {
  if (!profileOpen) return;
  profileOpen = false;
  profileRender();
}

// Account settings, feedback and privacy are Study AI's own windows: open them there.
function profileOpenIn(what) {
  profileClose();
  studyAiCommand({ type: 'studyai:open', what });
}

function profileSignOut() {
  const session = aiSession();
  profileClose();
  fetch(STUDY_AI_API + '/logout', { method: 'POST', headers: { 'X-Session-Id': session } }).catch(() => {});
  aiForgetSession();  // Study AI hears this through the storage event and signs out too
  profileRender();
  askAiRender();
  toast('Signed out');
}

document.addEventListener('click', e => { if (profileOpen && !e.target.closest('#hdrProfile')) profileClose(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') profileClose(); });
window.addEventListener('blur', profileClose);  // a click inside the Study AI frame
profileRender();

// ---- Ask AI panel (Notes tab) ----
const askAi = {
  open: (function () {
    try { const v = localStorage.getItem('askai_open'); if (v !== null) return v === '1'; } catch (e) {}
    return window.innerWidth >= 1200;   // open by default where there is room
  })(),
  tab: 'ask',            // ask | cards | quiz | summary
  chats: {},             // subject key → [{ role, text, sources, error }]
  study: {},             // PDF path → { cards, cardIndex, flipped, quiz, picks, summary, saved }
  busy: false,
  slow: false,
  error: '',
};

function askAiContext() {
  if (!notesNav.subjectId) return null;
  const cat = notesCategories.find(c => c.id === notesNav.categoryId);
  const subj = cat && cat.subjects.find(s => s.id === notesNav.subjectId);
  const folderName = SLUG_TO_FOLDER[notesNav.folderSlug];
  const items = (notesFiles && notesFiles[folderName]) || [];
  const active = items.find(i => i.storagePath === notesActivePath) || items[0] || null;
  if (!subj || !active) return null;
  return {
    subjectKey: notesNav.categoryId + '/' + notesNav.subjectId,
    subjectName: subj.name,
    folderName,
    path: active.storagePath,
    title: active.title,
  };
}

function askAiButtonHtml() {
  return `<button class="rpv-btn rpv-ai${askAi.open ? ' rpv-btn-on' : ''}" onclick="askAiToggle()" title="Ask AI about these notes" aria-label="Ask AI" aria-pressed="${askAi.open}"><span class="rpv-ai-spark" aria-hidden="true">✦</span>Ask AI</button>`;
}

function askAiToggle(force) {
  askAi.open = typeof force === 'boolean' ? force : !askAi.open;
  try { localStorage.setItem('askai_open', askAi.open ? '1' : '0'); } catch (e) {}
  const wrap = document.querySelector('#v-notes .notes-section-layout-wrap');
  if (!wrap) return;
  wrap.classList.toggle('askai-on', askAi.open);
  pdfSyncToolbar();
  askAiRender();
  // The viewer just changed width: fit the pages to it again.
  if (pdfState.doc && pdfState.mode === 'page-width') {
    const page = pdfState.page;
    pdfRenderPages(pdfState.token).then(() => pdfGoPage(page));
  }
  if (askAi.open) setTimeout(() => { const t = document.getElementById('askAiInput'); if (t) t.focus(); }, 50);
}

// Called by renderNotes() after the section is drawn.
function askAiMount() {
  const wrap = document.querySelector('#v-notes .notes-section-layout-wrap');
  if (!wrap) return;
  wrap.classList.toggle('askai-on', askAi.open);
  if (aiLibrary === null && !aiLibraryLoading) aiLoadLibrary();
  askAiRender();
}

function askAiStudy(path) {
  return askAi.study[path] || (askAi.study[path] = { cards: null, cardIndex: 0, flipped: false, quiz: null, picks: {}, summary: '', saved: '' });
}

function askAiReadiness(ctx) {
  if (!aiLibrary) return 'unknown';
  if (aiLibrary.ready.has(ctx.path)) return 'ready';
  for (const p of aiLibrary.ready) if (p.startsWith(ctx.subjectKey + '/')) return 'subject';
  return 'none';
}

function askAiRender() {
  const host = document.getElementById('askAi');
  if (!host) return;
  const ctx = askAiContext();
  if (!askAi.open || !ctx) { host.innerHTML = ''; return; }
  const signedIn = !!aiSession();
  const tabs = [['ask', 'Ask'], ['cards', 'Flashcards'], ['quiz', 'Quiz'], ['summary', 'Summary']];
  let h = `<div class="askai-head">
      <div class="askai-title"><span class="askai-spark" aria-hidden="true">✦</span>Ask AI</div>
      <button type="button" class="askai-x" onclick="askAiToggle(false)" aria-label="Close Ask AI">×</button>
    </div>
    <div class="askai-about" title="${esc(ctx.subjectName + ' · ' + ctx.folderName + ' · ' + ctx.title)}">About <b>${esc(ctx.title)}</b> · ${esc(ctx.subjectName)}</div>`;
  if (!signedIn) {
    h += `<div class="askai-signin">
        <p>Ask questions about these notes and get answers that point to the exact spot in the PDF. Turn them into flashcards and quizzes too.</p>
        <button type="button" class="askai-btn prim" onclick="studyAiSignIn('login')">Sign in</button>
        <button type="button" class="askai-btn" onclick="studyAiSignIn('register')">Create a free account</button>
        <p class="askai-fine">One account for Ask AI and Study AI.</p>
      </div>`;
    host.innerHTML = h;
    return;
  }
  h += '<div class="askai-tabs" role="tablist">' + tabs.map(([k, label]) =>
    `<button type="button" role="tab" aria-selected="${askAi.tab === k}" class="askai-tab${askAi.tab === k ? ' on' : ''}" onclick="askAiTab('${k}')">${label}</button>`).join('') + '</div>';
  const readiness = askAiReadiness(ctx);
  if (readiness === 'subject') h += '<div class="askai-note">This PDF is still being prepared for AI. Answers will come from the other notes in this course.</div>';
  else if (readiness === 'none') h += "<div class=\"askai-note\">These notes aren't ready for AI yet. Please check back soon.</div>";
  h += `<div class="askai-body" id="askAiBody">${askAi.tab === 'ask' ? askAiChatHtml(ctx) : askAiStudyHtml(ctx, readiness)}</div>`;
  if (askAi.tab === 'ask') {
    h += `<form class="askai-input" onsubmit="askAiSubmit(event)">
        <textarea id="askAiInput" rows="1" placeholder="Ask about these notes…" aria-label="Ask about these notes"
          onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();askAiSubmit(event)}"
          oninput="this.style.height='auto';this.style.height=Math.min(this.scrollHeight,140)+'px'"${askAi.busy ? ' disabled' : ''}></textarea>
        <button type="submit" class="askai-send" aria-label="Send"${askAi.busy ? ' disabled' : ''}>↑</button>
      </form>`;
  }
  h += '<div class="askai-foot">AI answers from these notes. Check the spot it cites.</div>';
  // Redraws keep what the student is typing, and the cursor.
  const keep = document.getElementById('askAiInput');
  const draft = keep ? keep.value : '';
  const focused = keep && document.activeElement === keep;
  const caret = focused ? keep.selectionStart : null;
  host.innerHTML = h;
  const input = document.getElementById('askAiInput');
  if (input && draft) input.value = draft;
  if (input && focused && !input.disabled) { input.focus(); input.setSelectionRange(caret, caret); }
  const body = document.getElementById('askAiBody');
  if (body && askAi.tab === 'ask') body.scrollTop = body.scrollHeight;
}

function askAiTab(tab) { askAi.tab = tab; askAi.error = ''; askAiRender(); }

// ---- Ask tab ----
function askAiChatHtml(ctx) {
  const msgs = askAi.chats[ctx.subjectKey] || [];
  if (!msgs.length) {
    return `<div class="askai-empty">
        <p>Ask anything about <b>${esc(ctx.title)}</b>. Answers come from this PDF first, then the rest of ${esc(ctx.subjectName)}.</p>
        <div class="askai-chips">${AI_SUGGESTIONS.map((s, i) =>
          `<button type="button" class="askai-chip" onclick="askAiSuggest(${i})">${esc(s)}</button>`).join('')}</div>
      </div>`;
  }
  return msgs.map((m, i) => {
    if (m.role === 'user') return `<div class="askai-msg askai-msg-user"><div class="askai-bubble">${esc(m.text)}</div></div>`;
    let inner;
    if (m.error) inner = `<div class="askai-err">${esc(m.error)}</div>`;
    else if (!m.text) inner = `<div class="askai-thinking">${askAi.slow ? 'Thinking… answers can take up to a minute.' : 'Reading the notes…'}</div>`;
    else inner = `<div class="askai-md" id="askAiMsg${i}">${aiRender(m.text)}</div>`;
    return `<div class="askai-msg askai-msg-ai">${inner}${askAiSourcesHtml(m, i, ctx)}</div>`;
  }).join('');
}

// One chip per spot (several passages often come from the same place).
function askAiSources(m) {
  const seen = new Set(), out = [];
  (m.sources || []).forEach(d => {
    const md = d.metadata || {};
    const key = md.library
      ? md.path + '|' + (md.pages > 1 ? md.page : '') + '|' + Math.round((md.y || 0) * 10)
      : 'own|' + (md.path || md.source_file);
    if (seen.has(key)) return;
    seen.add(key);
    out.push(md);
  });
  return out.slice(0, 6);
}

function askAiSourceLabel(md, ctx) {
  if (!md.library) return 'Your notes · ' + (md.source_file || md.path || 'file');
  let title = md.label || md.path;
  if (md.path === ctx.path) title = ctx.title;
  else if (notesFiles) {
    for (const folder of FOLDER_TYPES) {
      const hit = (notesFiles[folder] || []).find(f => f.storagePath === md.path);
      if (hit) { title = hit.title + ' · ' + folder; break; }
    }
  }
  const where = md.pages > 1 && md.page ? ' · p. ' + md.page : (md.y > 0.05 ? ' · ' + Math.round(md.y * 100) + '% down' : '');
  return title + where;
}

function askAiSourcesHtml(m, i, ctx) {
  const list = askAiSources(m);
  if (!list.length || m.error) return '';
  return '<div class="askai-sources"><span class="askai-sources-h">Sources</span>' + list.map((md, j) =>
    md.library
      ? `<button type="button" class="askai-src" onclick="askAiOpenSource(${i},${j})" title="Show this spot in the PDF">${esc(askAiSourceLabel(md, ctx))}</button>`
      : `<span class="askai-src askai-src-own" title="From the notes you uploaded to Study AI">${esc(askAiSourceLabel(md, ctx))}</span>`
  ).join('') + '</div>';
}

function askAiOpenSource(i, j) {
  const ctx = askAiContext();
  if (!ctx) return;
  const m = (askAi.chats[ctx.subjectKey] || [])[i];
  const md = m && askAiSources(m)[j];
  if (!md) return;
  if (md.path === ctx.path) { pdfGoTo(md.page || 1, md.y || 0); return; }
  const slug = md.path.split('/')[2];
  const folder = SLUG_TO_FOLDER[slug];
  if (!folder || !notesFiles || !(notesFiles[folder] || []).some(f => f.storagePath === md.path)) return;
  pdfState.jump = { page: md.page || 1, y: md.y || 0 };
  notesSelectPdf(slug, md.path);
}

function askAiSuggest(i) {
  const input = document.getElementById('askAiInput');
  if (input) input.value = AI_SUGGESTIONS[i];
  askAiSubmit();
}

function askAiSubmit(e) {
  if (e) e.preventDefault();
  const input = document.getElementById('askAiInput');
  const ctx = askAiContext();
  const q = input ? input.value.trim() : '';
  if (!q || !ctx || askAi.busy) return;
  input.value = '';
  const chat = askAi.chats[ctx.subjectKey] || (askAi.chats[ctx.subjectKey] = []);
  chat.push({ role: 'user', text: q });
  const answer = { role: 'ai', text: '', sources: [], error: '' };
  chat.push(answer);
  askAi.busy = true;
  askAi.slow = false;
  const slowTimer = setTimeout(() => { askAi.slow = true; if (!answer.text) askAiRender(); }, 5000);
  aiLoadLibs();
  askAiRender();
  let scheduled = false;
  const paint = () => {
    // Redraw just this answer as text streams in; the rest of the panel stays put.
    scheduled = false;
    const i = chat.indexOf(answer);
    const el = document.getElementById('askAiMsg' + i);
    if (!el) return;  // another course is open; the answer shows when the student comes back
    el.innerHTML = aiRender(answer.text);
    const body = document.getElementById('askAiBody');
    if (body) body.scrollTop = body.scrollHeight;
  };
  aiAskStream(q, ctx.path,
    meta => { answer.sources = meta.source_documents || []; },
    piece => {
      const first = !answer.text;
      answer.text += piece;
      if (first) askAiRender();
      else if (!scheduled) { scheduled = true; requestAnimationFrame(paint); }
    })
    .catch(err => { answer.error = err.message || String(err); })
    .then(() => {
      clearTimeout(slowTimer);
      if (!answer.text && !answer.error) answer.error = 'The AI could not answer right now. Please try again.';
      askAi.busy = false;
      askAiRender();
      const next = document.getElementById('askAiInput');
      if (next) next.focus();
    });
}

// ---- Flashcards / Quiz / Summary ----
function askAiStudyHtml(ctx, readiness) {
  const st = askAiStudy(ctx.path);
  const ready = readiness === 'ready' || readiness === 'unknown';
  const off = !ready || askAi.busy ? ' disabled' : '';
  let h = '';
  if (askAi.error) h += `<div class="askai-err">${esc(askAi.error)}</div>`;
  if (askAi.tab === 'cards') {
    h += `<div class="askai-row"><button type="button" class="askai-btn prim" onclick="askAiMakeCards()"${off}>${st.cards ? 'New flashcards' : 'Make flashcards'}</button>
      <span class="askai-hint">From ${esc(ctx.title)}</span></div>`;
    if (askAi.busy) h += '<div class="askai-thinking">Writing flashcards…</div>';
    else if (st.cards && st.cards.length) {
      const c = st.cards[st.cardIndex];
      h += `<button type="button" class="askai-card${st.flipped ? ' flipped' : ''}" onclick="askAiFlip()" aria-label="Flip card">
          <span class="askai-card-side">${st.flipped ? 'Answer' : 'Question'} · ${st.cardIndex + 1} / ${st.cards.length}</span>
          <span class="askai-md">${aiRender(st.flipped ? c.back : c.front)}</span>
          <span class="askai-card-tip">${st.flipped ? 'Click to see the question' : 'Click to see the answer'}</span>
        </button>
        <div class="askai-row">
          <button type="button" class="askai-btn" onclick="askAiCard(-1)"${st.cardIndex === 0 ? ' disabled' : ''}>Prev</button>
          <button type="button" class="askai-btn" onclick="askAiCard(1)"${st.cardIndex >= st.cards.length - 1 ? ' disabled' : ''}>Next</button>
          <button type="button" class="askai-btn askai-save" onclick="askAiSaveDeck()"${st.saved ? ' disabled' : ''}>${st.saved ? 'Saved' : 'Save as deck'}</button>
        </div>`;
      if (st.saved) h += `<p class="askai-fine">Saved to Study AI. Review it there when it's due: <a href="#study" onclick="event.preventDefault();studyAiOpen()">open Study AI</a>.</p>`;
    } else if (!st.cards) h += '<p class="askai-fine">Five question-and-answer cards from this PDF. Save them as a deck to review on a schedule in Study AI.</p>';
  } else if (askAi.tab === 'quiz') {
    h += `<div class="askai-row"><button type="button" class="askai-btn prim" onclick="askAiMakeQuiz()"${off}>${st.quiz ? 'New quiz' : 'Make a quiz'}</button>
      <span class="askai-hint">5 questions</span></div>`;
    if (askAi.busy) h += '<div class="askai-thinking">Writing questions…</div>';
    else if (st.quiz && st.quiz.length) {
      let answered = 0, right = 0;
      h += st.quiz.map((q, qi) => {
        const picked = st.picks[qi];
        if (picked !== undefined) { answered++; if (picked === q.answer_index) right++; }
        return `<div class="mcq-item askai-q"><div class="askai-md askai-qtext"><b>Q${qi + 1}.</b> ${aiRender(q.question)}</div><div class="mcq-opts">` +
          q.options.map((o, oi) => {
            let cls = 'mcq-opt';
            if (picked !== undefined) { cls += ' picked'; if (oi === q.answer_index) cls += ' correct'; else if (oi === picked) cls += ' wrong'; }
            return `<div class="${cls}" onclick="askAiPick(${qi},${oi})"><span class="mcq-radio"></span><span class="askai-md">${aiRender(o)}</span></div>`;
          }).join('') + '</div>' +
          (picked !== undefined && q.explanation ? `<div class="askai-explain askai-md">${aiRender(q.explanation)}</div>` : '') + '</div>';
      }).join('');
      if (answered === st.quiz.length) h += `<div class="askai-score">Score ${right} / ${st.quiz.length}</div>`;
    } else if (!st.quiz) h += '<p class="askai-fine">Multiple-choice questions from this PDF, with a short explanation for each answer.</p>';
  } else {
    h += `<div class="askai-row"><button type="button" class="askai-btn prim" onclick="askAiMakeSummary()"${off}>${st.summary ? 'Summarize again' : 'Summarize this PDF'}</button></div>`;
    if (askAi.busy) h += '<div class="askai-thinking">Reading the notes…</div>';
    else if (st.summary) h += `<div class="askai-md askai-summary">${aiRender(st.summary)}</div>`;
    else h += '<p class="askai-fine">A 100–150 word summary of the key ideas, from this PDF only.</p>';
  }
  return h;
}

function askAiRun(fn) {
  const ctx = askAiContext();
  if (!ctx || askAi.busy) return;
  askAi.busy = true;
  askAi.error = '';
  aiLoadLibs();
  askAiRender();
  fn(ctx, askAiStudy(ctx.path))
    .catch(err => { askAi.error = err.message || String(err); })
    .then(() => { askAi.busy = false; askAiRender(); });
}

function askAiMakeCards() {
  askAiRun((ctx, st) => aiPost('/study/generate', { task: 'flashcards', count: 5, library_path: ctx.path, focus_query: 'key ideas for exam' })
    .then(j => { st.cards = j.items || []; st.cardIndex = 0; st.flipped = false; st.saved = ''; }));
}
function askAiMakeQuiz() {
  askAiRun((ctx, st) => aiPost('/study/generate', { task: 'mcq', count: 5, library_path: ctx.path, focus_query: 'key ideas for exam' })
    .then(j => { st.quiz = j.items || []; st.picks = {}; }));
}
function askAiMakeSummary() {
  askAiRun((ctx, st) => aiPost('/study/summary', { library_path: ctx.path, include_course_context: 'false' })
    .then(j => { st.summary = j.summary || ''; }));
}
function askAiSaveDeck() {
  askAiRun((ctx, st) => aiPost('/study/decks', {
    name: (ctx.title + ' · ' + ctx.subjectName).slice(0, 120),
    source_path: ctx.path,
    cards: JSON.stringify((st.cards || []).map(c => ({ front: c.front, back: c.back, source: c.source || 'notes' }))),
  }).then(() => { st.saved = 'yes'; toast('Deck saved to Study AI'); }));
}
function askAiFlip() { const ctx = askAiContext(); if (!ctx) return; const st = askAiStudy(ctx.path); st.flipped = !st.flipped; askAiRender(); }
function askAiCard(d) {
  const ctx = askAiContext(); if (!ctx) return;
  const st = askAiStudy(ctx.path);
  st.cardIndex = Math.min(Math.max(0, st.cardIndex + d), (st.cards || []).length - 1);
  st.flipped = false;
  askAiRender();
}
function askAiPick(qi, oi) {
  const ctx = askAiContext(); if (!ctx) return;
  const st = askAiStudy(ctx.path);
  if (st.picks[qi] !== undefined) return;
  st.picks[qi] = oi;
  askAiRender();
}
