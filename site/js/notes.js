// ====== NOTES ======
// Vanilla port of the profile site's notes pages (diptidhawade/src/pages/
// NotesList.jsx, NotesCategory.jsx, NotesSection.jsx and the useNotes /
// useSubjectFiles hooks). Same markup, class names and stylesheet, so the
// rendering is identical; only React, react-router and the JSX are dropped
// because this project has no build step.
//
// Routing there is /notes/:categoryId/:subjectId/:folderSlug. Here the same
// three levels are kept in memory and mirrored into the URL hash.

const NOTES_REST = SUPABASE_URL + '/storage/v1';
const NOTES_HEADERS = { apikey: SUPABASE_ANON_KEY, Authorization: 'Bearer ' + SUPABASE_ANON_KEY };

// nav state: null = category list, {categoryId} = subject list, {categoryId,subjectId,folderSlug} = viewer
let notesNav = { categoryId: null, subjectId: null, folderSlug: null };
let notesFiles = null;         // { "Class Notes": [{title, storagePath}], ... }
let notesFilesError = null;
let notesLoading = false;
let notesExpanded = new Set();
let notesActivePath = null;
let notesSidebarOpen = true;
const notesFileCache = {};

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// Public URL for a file in the bucket - same shape as supabase.storage.getPublicUrl().
function notesPublicUrl(storagePath) {
  return NOTES_REST + '/object/public/' + NOTES_BUCKET + '/' +
         storagePath.split('/').map(encodeURIComponent).join('/');
}

// Port of useSubjectFiles: list each folder for a subject, keep only PDFs.
// Path structure: Notes / {categoryId} / {subjectId} / {folderSlug} /
function notesFetchSubjectFiles(categoryId, subjectId) {
  const cacheKey = categoryId + '/' + subjectId;
  if (notesFileCache[cacheKey]) {
    notesFiles = notesFileCache[cacheKey]; notesFilesError = null; notesLoading = false;
    return Promise.resolve();
  }
  const prefix = categoryId + '/' + subjectId;
  const next = {};
  FOLDER_TYPES.forEach(n => { next[n] = []; });
  notesLoading = true; notesFilesError = null;

  return Promise.all(FOLDER_TYPES.map(folderName => {
    const slug = FOLDER_SLUGS[folderName];
    return fetch(NOTES_REST + '/object/list/' + NOTES_BUCKET, {
      method: 'POST',
      headers: Object.assign({ 'Content-Type': 'application/json' }, NOTES_HEADERS),
      body: JSON.stringify({ prefix: prefix + '/' + slug, limit: 500 })
    })
      .then(r => r.ok ? r.json() : [])
      .then(data => ({ folderName, data: Array.isArray(data) ? data : [] }))
      .catch(() => ({ folderName, data: [] }));
  })).then(results => {
    results.forEach(({ folderName, data }) => {
      const slug = FOLDER_SLUGS[folderName];
      data.forEach(item => {
        if (!item.name || item.name === '.emptyFolderPlaceholder') return;
        if (!/\.pdf$/i.test(item.name)) return;
        const title = item.name.replace(/\.pdf$/i, '').replace(/\s*\(\d+\)\s*$/, '').trim() || item.name;
        next[folderName].push({ title: title, storagePath: prefix + '/' + slug + '/' + item.name });
      });
    });
    notesFileCache[cacheKey] = next;
    notesFiles = next;
  }).catch(err => {
    notesFilesError = err; notesFiles = null;
  }).finally(() => { notesLoading = false; });
}

// ---- navigation ----
function notesGoList(push) {
  // With only one category there is nothing to pick, so the Notes tab opens
  // straight onto that category's course list.
  if (notesCategories.length === 1) return notesGoCategory(notesCategories[0].id, push);
  notesNav = { categoryId: null, subjectId: null, folderSlug: null };
  notesFiles = null; notesActivePath = null;
  notesSyncHash(push !== false); renderNotes();
}
function notesGoCategory(categoryId, push) {
  notesNav = { categoryId: categoryId, subjectId: null, folderSlug: null };
  notesFiles = null; notesActivePath = null;
  notesSyncHash(push !== false); renderNotes();
}
function notesGoSubject(categoryId, subjectId, folderSlug, push) {
  notesNav = { categoryId, subjectId, folderSlug: folderSlug || 'class-notes' };
  notesExpanded = new Set([notesNav.folderSlug]);
  notesActivePath = null; notesFiles = null;
  notesSyncHash(push !== false); renderNotes();
  notesFetchSubjectFiles(categoryId, subjectId).then(() => {
    notesEnsureFolderHasFiles(); notesPickFirstInFolder(); renderNotes();
  });
}
// push adds a history entry (so Back steps through the notes); replace is used
// when the URL is only being kept in step with state the user did not navigate to.
function notesSyncHash(push) {
  const { categoryId, subjectId, folderSlug } = notesNav;
  let h = '#notes';
  if (categoryId) h += '/' + categoryId;
  if (subjectId) h += '/' + subjectId + '/' + folderSlug;
  if (h === (location.hash || '')) return;
  try { push ? history.pushState(null, '', h) : history.replaceState(null, '', h); } catch (e) {}
}

// Folder types that hold at least one PDF for the loaded subject. Empty ones
// are left out of the sidebar tree.
function notesNonEmptyFolders() {
  return FOLDER_TYPES.filter(n => notesFiles && notesFiles[n] && notesFiles[n].length);
}

// The default folder (Class Notes) or the one in a deep link may be empty, and
// its heading is hidden then, so move to the first folder that has notes.
function notesEnsureFolderHasFiles() {
  const folders = notesNonEmptyFolders();
  if (!folders.length || folders.indexOf(SLUG_TO_FOLDER[notesNav.folderSlug]) >= 0) return;
  notesExpanded.delete(notesNav.folderSlug);
  notesNav.folderSlug = FOLDER_SLUGS[folders[0]];
  notesExpanded.add(notesNav.folderSlug);
  notesSyncHash(false);
}

function notesPickFirstInFolder() {
  const name = SLUG_TO_FOLDER[notesNav.folderSlug];
  const items = (notesFiles && notesFiles[name]) || [];
  if (!items.length) { notesActivePath = null; return; }
  if (!notesActivePath || !items.some(i => i.storagePath === notesActivePath)) {
    notesActivePath = items[0].storagePath;
  }
}
function notesToggleFolder(slug) {
  if (notesExpanded.has(slug)) notesExpanded.delete(slug); else notesExpanded.add(slug);
  renderNotes();
}
function notesOpenFolder(slug) {
  notesExpanded.add(slug); notesNav.folderSlug = slug;
  notesPickFirstInFolder(); notesSyncHash(false); renderNotes();
}
function notesSelectPdf(slug, storagePath) {
  notesExpanded.add(slug); notesNav.folderSlug = slug; notesActivePath = storagePath;
  notesSyncHash(false); renderNotes();
}
function notesToggleSidebar() { notesSidebarOpen = !notesSidebarOpen; renderNotes(); }

// ---- icons (react-icons HiBars3 / HiChevronRight / HiChevronDown) ----
const ICON_BARS = '<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"/></svg>';
const ICON_RIGHT = '<svg class="notes-tree-chevron-icon" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8.25 4.5l7.5 7.5-7.5 7.5"/></svg>';
const ICON_DOWN = '<svg class="notes-tree-chevron-icon" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19.5 8.25l-7.5 7.5-7.5-7.5"/></svg>';

// ---- render: NotesList.jsx ----
function notesRenderList() {
  let h = '<div class="notes-page page-content"><h1 class="notes-title">Notes</h1>';
  h += '<ul class="notes-category-list notes-category-grid">';
  notesCategories.forEach((cat, index) => {
    const labels = cat.subjectLabels || cat.subjects.map(s => s.name);
    h += `<li class="notes-category-item">
      <a class="notes-category-card notes-category-box" onclick="notesGoCategory('${esc(cat.id)}')">
        <span class="notes-category-number">${String(index + 1).padStart(2, '0')}</span>
        <div class="notes-category-image-wrap">
          <img src="assets/notes/${esc(cat.image.replace(/^\/?assets\/notes\//, ''))}" alt="" class="notes-category-image">
        </div>
        <span class="notes-category-title">${esc(cat.title)}</span>
        <div class="notes-category-tags">
          ${labels.slice(0, 3).map(l => `<span class="notes-category-tag">${esc(l)}</span>`).join('')}
          ${labels.length > 3 ? '<span class="notes-category-tag notes-category-tag-more">+ more</span>' : ''}
        </div>
      </a></li>`;
  });
  return h + '</ul></div>';
}

// ---- render: NotesCategory.jsx ----
function notesRenderCategory() {
  const cat = notesCategories.find(c => c.id === notesNav.categoryId);
  if (!cat) {
    return '<div class="notes-page page-content"><p>Category not found.</p>' +
           '<button type="button" onclick="notesGoList()" class="notes-back-btn">&larr; Back to Notes</button></div>';
  }
  let h = '<div class="notes-page notes-category-page page-content">';
  if (notesCategories.length > 1) {
    h += '<button type="button" onclick="notesGoList()" class="notes-back-btn">&larr; Back to Notes</button>';
  }
  h += `<h1 class="notes-title">${esc(cat.title)}</h1>`;
  if (cat.subheading) h += `<p class="notes-subheading">${esc(cat.subheading)}</p>`;
  h += '<ul class="notes-subject-list">';
  cat.subjects.forEach(s => {
    h += `<li><a class="notes-subject-card" onclick="notesGoSubject('${esc(cat.id)}','${esc(s.id)}','class-notes')">${esc(s.name)}</a></li>`;
  });
  return h + '</ul></div>';
}

// ---- render: NotesSection.jsx ----
function notesRenderSection() {
  const cat = notesCategories.find(c => c.id === notesNav.categoryId);
  const subj = cat && cat.subjects.find(s => s.id === notesNav.subjectId);
  const folderName = SLUG_TO_FOLDER[notesNav.folderSlug];
  if (!folderName || FOLDER_TYPES.indexOf(folderName) < 0 || !cat || !subj) {
    return '<div class="notes-page page-content"><p>Subject not found.</p>' +
           '<button type="button" onclick="notesGoList()" class="notes-back-btn">&larr; Back to Notes</button></div>';
  }

  const items = (notesFiles && notesFiles[folderName]) || [];
  const active = items.find(i => i.storagePath === notesActivePath) || items[0] || null;

  let h = '<div class="notes-page notes-section-page page-content">';
  h += '<div class="notes-section-layout-wrap"><div class="notes-section-left-col">';
  h += `<div class="notes-section-tools">
    <button type="button" class="notes-toggle-list-btn${notesSidebarOpen ? ' notes-toggle-list-btn-active' : ''}"
      onclick="notesToggleSidebar()" aria-label="${notesSidebarOpen ? 'Hide notes list' : 'Show notes list'}">${ICON_BARS}</button>
  </div>`;

  if (notesSidebarOpen) {
    h += '<aside class="notes-section-sidebar notes-section-sidebar-tree">';
    h += '<ul class="notes-tree-root" role="tree" aria-label="Notes folders">';
    notesNonEmptyFolders().forEach(fname => {
      const slug = FOLDER_SLUGS[fname];
      const expanded = notesExpanded.has(slug);
      const files = (notesFiles && notesFiles[fname]) || [];
      const isActiveFolder = notesNav.folderSlug === slug;
      h += `<li class="notes-tree-folder" role="treeitem" aria-expanded="${expanded}">
        <div class="notes-tree-folder-row">
          <button type="button" class="notes-tree-chevron"
            aria-label="${expanded ? 'Collapse' : 'Expand'} ${esc(fname)}"
            onclick="event.stopPropagation();notesToggleFolder('${slug}')">${expanded ? ICON_DOWN : ICON_RIGHT}</button>
          <button type="button" class="notes-tree-folder-label${isActiveFolder ? ' notes-tree-folder-label-active' : ''}"
            onclick="notesOpenFolder('${slug}')">${esc(fname)}</button>
        </div>`;
      if (expanded && files.length > 0) {
        h += '<ul class="notes-tree-files" role="group">';
        files.forEach(item => {
          const isActivePdf = isActiveFolder && active && active.storagePath === item.storagePath;
          h += `<li class="notes-tree-file"><button type="button"
            class="notes-tree-file-btn${isActivePdf ? ' notes-tree-file-btn-active' : ''}"
            onclick="notesSelectPdf('${slug}',${JSON.stringify(item.storagePath).replace(/"/g, '&quot;')})">${esc(item.title)}</button></li>`;
        });
        h += '</ul>';
      }
      h += '</li>';
    });
    h += '</ul></aside>';
  }
  h += '</div><div class="notes-section-viewer">';
  if (active) {
    h += '<div class="notes-pdf-host" id="notesPdfHost"></div>';
  } else {
    h += `<p class="notes-empty">${notesLoading ? 'Loading notes…' : (notesFilesError ? 'Could not load notes.' : 'No notes yet.')}</p>`;
  }
  h += '</div>';
  // Ask AI panel (js/study-ai.js fills it in after each render).
  if (active) h += '<aside class="askai" id="askAi" aria-label="Ask AI"></aside>';
  return h + '</div></div>';
}

// ---- PDF viewer ----
// The profile site uses @react-pdf-viewer with defaultLayoutPlugin, theme="dark",
// defaultScale=PageWidth and the sidebar filtered to thumbnails only. That is a
// React wrapper around pdf.js; this rebuilds the same layout - toolbar with page
// navigation, zoom, fullscreen and download, plus a thumbnail sidebar - directly
// on pdf.js so it works without a build step.

const PDF_ZOOMS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 3, 4];
let pdfState = { doc: null, url: null, title: '', scale: 1, mode: 'page-width',
                 page: 1, numPages: 0, token: 0, thumbsOpen: false, jump: null };

const PI = {
  up:   '<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 15.75l7.5-7.5 7.5 7.5"/></svg>',
  down: '<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19.5 8.25l-7.5 7.5-7.5-7.5"/></svg>',
  zoomOut: '<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="M8 11h6M20 20l-3.5-3.5"/></svg>',
  zoomIn:  '<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="M8 11h6M11 8v6M20 20l-3.5-3.5"/></svg>',
  expand:  '<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>',
  thumbs:  '<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="7" height="7" rx="1"/><rect x="4" y="13" width="7" height="7" rx="1"/><path d="M14 6h6M14 12h6M14 18h6"/></svg>',
};

function pdfToolbarHtml() {
  const pct = Math.round(pdfState.scale * 100);
  return `<div class="rpv-toolbar">
    <div class="rpv-tb-group">
      <button class="rpv-btn${pdfState.thumbsOpen ? ' rpv-btn-on' : ''}" onclick="pdfToggleThumbs()" title="Thumbnails" aria-label="Thumbnails">${PI.thumbs}</button>
      <span class="rpv-sep"></span>
      <button class="rpv-btn" onclick="pdfGoPage(pdfState.page-1)" title="Previous page" aria-label="Previous page">${PI.up}</button>
      <input class="rpv-page-input" id="rpvPage" value="${pdfState.page}" aria-label="Page number"
             onchange="pdfGoPage(parseInt(this.value,10))" onkeydown="if(event.key==='Enter'){pdfGoPage(parseInt(this.value,10))}">
      <span class="rpv-page-total">/ ${pdfState.numPages}</span>
      <button class="rpv-btn" onclick="pdfGoPage(pdfState.page+1)" title="Next page" aria-label="Next page">${PI.down}</button>
    </div>
    <div class="rpv-tb-group rpv-tb-center">
      <button class="rpv-btn" onclick="pdfZoom(-1)" title="Zoom out" aria-label="Zoom out">${PI.zoomOut}</button>
      <span class="rpv-zoom">${pct}%</span>
      <button class="rpv-btn" onclick="pdfZoom(1)" title="Zoom in" aria-label="Zoom in">${PI.zoomIn}</button>
    </div>
    <div class="rpv-tb-group rpv-tb-right">
      ${typeof askAiButtonHtml === 'function' ? askAiButtonHtml() : ''}
      <button class="rpv-btn" onclick="pdfFullscreen()" title="Full screen" aria-label="Full screen">${PI.expand}</button>
    </div>
  </div>`;
}

function pdfShellHtml() {
  return `<div class="rpv-shell" id="rpvShell">
    ${pdfToolbarHtml()}
    <div class="rpv-body">
      <div class="rpv-thumbs${pdfState.thumbsOpen ? '' : ' rpv-hidden'}" id="rpvThumbs"></div>
      <div class="rpv-pages" id="rpvPages" onscroll="pdfOnScroll()"></div>
    </div>
  </div>`;
}

function pdfSyncToolbar() {
  const shell = document.getElementById('rpvShell');
  if (!shell) return;
  const old = shell.querySelector('.rpv-toolbar');
  if (!old) return;
  const tmp = document.createElement('div');
  tmp.innerHTML = pdfToolbarHtml();
  shell.replaceChild(tmp.firstElementChild, old);
}

function pdfOpen(url, title) {
  const token = ++pdfState.token;
  pdfState.url = url; pdfState.title = title; pdfState.page = 1; pdfState.numPages = 0;
  const host = document.getElementById('notesPdfHost');
  if (!host || typeof pdfjsLib === 'undefined') return;
  host.innerHTML = '<p class="notes-empty">Loading…</p>';
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  pdfjsLib.getDocument(url).promise.then(doc => {
    if (token !== pdfState.token) return;
    pdfState.doc = doc; pdfState.numPages = doc.numPages;
    host.innerHTML = pdfShellHtml();
    return pdfRenderPages(token).then(() => {
      if (token === pdfState.token && pdfState.jump) {
        const { page, y } = pdfState.jump;
        pdfState.jump = null;
        pdfGoTo(page, y);
      }
      return pdfState.thumbsOpen ? pdfRenderThumbs(token) : null;
    });
  }).catch(() => {
    if (token === pdfState.token && host) host.innerHTML = '<p class="notes-empty">Could not load this PDF.</p>';
  });
}

// defaultScale = SpecialZoomLevel.PageWidth
function pdfFitWidth(page) {
  const pages = document.getElementById('rpvPages');
  const avail = (pages ? pages.clientWidth : 800) - 32;
  const base = page.getViewport({ scale: 1 });
  return Math.max(0.1, avail / base.width);
}

function pdfRenderPages(token) {
  const doc = pdfState.doc, host = document.getElementById('rpvPages');
  if (!doc || !host) return Promise.resolve();
  host.innerHTML = '';
  return doc.getPage(1).then(first => {
    if (pdfState.mode === 'page-width') pdfState.scale = pdfFitWidth(first);
    pdfSyncToolbar();
    let chain = Promise.resolve();
    for (let n = 1; n <= doc.numPages; n++) {
      chain = chain.then(() => doc.getPage(n)).then(page => {
        if (token !== pdfState.token) return;
        const viewport = page.getViewport({ scale: pdfState.scale });
        const wrap = document.createElement('div');
        wrap.className = 'rpv-page'; wrap.dataset.page = String(n);
        const canvas = document.createElement('canvas');
        canvas.width = Math.floor(viewport.width); canvas.height = Math.floor(viewport.height);
        wrap.appendChild(canvas); host.appendChild(wrap);
        return page.render({ canvasContext: canvas.getContext('2d'), viewport: viewport }).promise;
      });
    }
    return chain;
  });
}

function pdfRenderThumbs(token) {
  const doc = pdfState.doc, host = document.getElementById('rpvThumbs');
  if (!doc || !host) return Promise.resolve();
  host.innerHTML = '';
  let chain = Promise.resolve();
  for (let n = 1; n <= doc.numPages; n++) {
    chain = chain.then(() => doc.getPage(n)).then(page => {
      if (token !== pdfState.token) return;
      const base = page.getViewport({ scale: 1 });
      const viewport = page.getViewport({ scale: 120 / base.width });
      const item = document.createElement('div');
      item.className = 'rpv-thumb' + (n === pdfState.page ? ' rpv-thumb-on' : '');
      item.dataset.page = String(n);
      item.onclick = () => pdfGoPage(n);
      const canvas = document.createElement('canvas');
      canvas.width = Math.floor(viewport.width); canvas.height = Math.floor(viewport.height);
      const label = document.createElement('span');
      label.className = 'rpv-thumb-n'; label.textContent = String(n);
      item.appendChild(canvas); item.appendChild(label); host.appendChild(item);
      return page.render({ canvasContext: canvas.getContext('2d'), viewport: viewport }).promise;
    });
  }
  return chain;
}

function pdfGoPage(n) {
  if (!pdfState.numPages) return;
  n = Math.min(Math.max(1, n || 1), pdfState.numPages);
  pdfState.page = n;
  const el = document.querySelector('.rpv-page[data-page="' + n + '"]');
  if (el) el.scrollIntoView({ block: 'start' });
  pdfSyncToolbar(); pdfMarkThumb();
}

// Scroll to a spot inside a page: y is 0 (top) to 1 (bottom). Used by Ask AI's sources, which say
// where in the PDF an answer came from; the spot is briefly highlighted.
function pdfGoTo(page, y) {
  if (!pdfState.numPages) return;
  const n = Math.min(Math.max(1, page || 1), pdfState.numPages);
  const el = document.querySelector('.rpv-page[data-page="' + n + '"]');
  const pages = document.getElementById('rpvPages');
  if (!el || !pages) return pdfGoPage(n);
  const canvas = el.querySelector('canvas');
  const h = canvas ? canvas.offsetHeight : el.offsetHeight;
  const at = Math.min(Math.max(y || 0, 0), 1);
  pages.scrollTop = Math.max(0, el.offsetTop - pages.offsetTop + at * h - 24);
  pdfState.page = n;
  pdfSyncToolbar(); pdfMarkThumb();
  const mark = document.createElement('div');
  mark.className = 'rpv-spot';
  mark.style.top = (at * h) + 'px';
  el.style.position = 'relative';
  el.appendChild(mark);
  setTimeout(() => mark.remove(), 1800);
}

function pdfZoom(dir) {
  const cur = pdfState.scale;
  let next = null;
  if (dir > 0) next = PDF_ZOOMS.find(z => z > cur + 0.001);
  else { const lower = PDF_ZOOMS.filter(z => z < cur - 0.001); next = lower[lower.length - 1]; }
  if (!next) return;
  pdfState.scale = next; pdfState.mode = 'custom';
  pdfRenderPages(pdfState.token).then(() => pdfGoPage(pdfState.page));
}

function pdfToggleThumbs() {
  pdfState.thumbsOpen = !pdfState.thumbsOpen;
  const el = document.getElementById('rpvThumbs');
  if (el) el.classList.toggle('rpv-hidden', !pdfState.thumbsOpen);
  pdfSyncToolbar();
  if (pdfState.thumbsOpen) pdfRenderThumbs(pdfState.token);
}

function pdfFullscreen() {
  const el = document.getElementById('rpvShell');
  if (!el) return;
  if (document.fullscreenElement) document.exitFullscreen();
  else if (el.requestFullscreen) el.requestFullscreen();
}

function pdfMarkThumb() {
  document.querySelectorAll('.rpv-thumb').forEach(t =>
    t.classList.toggle('rpv-thumb-on', t.dataset.page === String(pdfState.page)));
}

let pdfScrollTick = false;
function pdfOnScroll() {
  if (pdfScrollTick) return;
  pdfScrollTick = true;
  requestAnimationFrame(() => {
    pdfScrollTick = false;
    const host = document.getElementById('rpvPages');
    if (!host) return;
    const mid = host.getBoundingClientRect().top + 80;
    let cur = pdfState.page;
    host.querySelectorAll('.rpv-page').forEach(el => {
      if (el.getBoundingClientRect().top <= mid) cur = parseInt(el.dataset.page, 10);
    });
    if (cur !== pdfState.page) {
      pdfState.page = cur;
      const input = document.getElementById('rpvPage');
      if (input) input.value = String(cur);
      pdfMarkThumb();
    }
  });
}

function renderNotes() {
  const el = document.getElementById('v-notes');
  if (!el) return;
  if (notesNav.subjectId) {
    el.innerHTML = notesRenderSection();
    const folderName = SLUG_TO_FOLDER[notesNav.folderSlug];
    const items = (notesFiles && notesFiles[folderName]) || [];
    const active = items.find(i => i.storagePath === notesActivePath) || items[0] || null;
    if (active) pdfOpen(notesPublicUrl(active.storagePath), active.title);
    if (typeof askAiMount === 'function') askAiMount();
  }
  else if (notesNav.categoryId) el.innerHTML = notesRenderCategory();
  else el.innerHTML = notesRenderList();
}

// Deep link: #notes/:categoryId/:subjectId/:folderSlug
function notesRestoreFromHash() {
  const m = /^#notes(?:\/([^/]+))?(?:\/([^/]+)\/([^/]+))?$/.exec(location.hash || '');
  if (!m) return false;
  if (m[2]) notesGoSubject(decodeURIComponent(m[1]), decodeURIComponent(m[2]), m[3], false);
  else if (m[1]) notesGoCategory(decodeURIComponent(m[1]), false);
  else notesGoList(false);
  return true;
}
