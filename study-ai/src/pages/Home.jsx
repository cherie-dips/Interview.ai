import { useState, useRef, useEffect, useCallback } from "react";
import Explorer from "../components/Explorer";
import QueryInterface from "../components/QueryInterface";
import StudyPanel from "../components/StudyPanel";
import FileTextView from "../components/FileTextView";
import AccountSettings from "../components/AccountSettings";
import FeedbackModal from "../components/FeedbackModal";
import AdminStats from "../components/AdminStats";
import GettingStartedTips from "../components/GettingStartedTips";
import AskAboutSelection from "../components/AskAboutSelection";
import {
  setUserName,
  authFetch,
  apiRequest,
  errorText,
  isNewAccount,
  clearNewAccountMark,
} from "../auth";
import { registerLocalFile, getBlobUrlForPath, forgetAllLocalFiles } from "../localFileStore";
import { hydrateLocalPreviewFromMirror } from "../localDiskFolder";
import { clearHistory } from "../chatHistory";
import { API_BASE } from "../config";
import { onHostMessage } from "../embed";
import "../index.css";

const LS_LEFT_W = "notescanner-left-sidebar-w";
const LS_RIGHT_W = "notescanner-right-sidebar-w";

const LEFT_W_MIN = 150;
const LEFT_W_MAX = 480;
const RIGHT_W_MIN = 200;
const RIGHT_W_MAX = 520;

const MOBILE_QUERY = "(max-width: 768px)";
const MOBILE_TABS = [
  ["files", "Files"],
  ["view", "View"],
  ["chat", "Chat"],
  ["study", "Study"],
];

const IMAGE_PREVIEW_RE = /\.(png|jpe?g|gif|webp|bmp|svg)$/i;
const TEXT_PREVIEW_RE = /\.(txt|md|csv|json|log)$/i;

/** How the preview pane can show a file: "pdf" | "image" | "text" | "other". */
function previewKindFor(name) {
  const n = name || "";
  if (/\.pdf$/i.test(n)) return "pdf";
  if (IMAGE_PREVIEW_RE.test(n)) return "image";
  if (TEXT_PREVIEW_RE.test(n)) return "text";
  return "other";
}

function readLeftSidebarWidth() {
  try {
    const n = parseInt(localStorage.getItem(LS_LEFT_W) || "", 10);
    if (Number.isFinite(n)) return Math.min(LEFT_W_MAX, Math.max(LEFT_W_MIN, n));
  } catch {
    /* ignore */
  }
  return 250;
}

function readRightSidebarWidth() {
  try {
    const n = parseInt(localStorage.getItem(LS_RIGHT_W) || "", 10);
    if (Number.isFinite(n)) return Math.min(RIGHT_W_MAX, Math.max(RIGHT_W_MIN, n));
  } catch {
    /* ignore */
  }
  return 300;
}

/** True while the window matches a media query (e.g. phone width). */
function useMediaQuery(query) {
  const [matches, setMatches] = useState(() =>
    typeof window !== "undefined" && window.matchMedia ? window.matchMedia(query).matches : false,
  );
  useEffect(() => {
    if (!window.matchMedia) return;
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);
  return matches;
}

export default function Home({ onLogout, signedIn, serverConfig = {}, onShowPrivacy }) {
  const [preview, setPreview] = useState(null);
  const [previewHydrating, setPreviewHydrating] = useState(false);
  const [previewText, setPreviewText] = useState(null);
  const [viewMode, setViewMode] = useState(null); // null = automatic, "original" | "text"
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [highlight, setHighlight] = useState("");
  const [notice, setNotice] = useState(null); // { type, text }
  const [treeRefreshKey, setTreeRefreshKey] = useState(0);
  const [mobileTab, setMobileTab] = useState("files");
  const [leftSidebarPx, setLeftSidebarPx] = useState(readLeftSidebarWidth);
  const [rightSidebarPx, setRightSidebarPx] = useState(readRightSidebarWidth);
  const isMobile = useMediaQuery(MOBILE_QUERY);
  const onenoteSyncing = useRef(false);
  const leftSidebarRef = useRef(null);
  const rightSidebarRef = useRef(null);
  const previewAttachRef = useRef(null);
  const previewContentRef = useRef(null);

  useEffect(() => {
    if (!signedIn) return;
    let cancelled = false;
    authFetch(`${API_BASE}/me`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled || !data) return;
        if (data.name) setUserName(data.name);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [signedIn]);

  // A brand-new account gets starter notes from the server a moment after sign-up: look again.
  useEffect(() => {
    if (!signedIn || !isNewAccount()) return;
    const timers = [3000, 8000].map((ms, i, all) =>
      setTimeout(() => {
        setTreeRefreshKey((k) => k + 1);
        if (i === all.length - 1) clearNewAccountMark();
      }, ms),
    );
    return () => timers.forEach(clearTimeout);
  }, [signedIn]);

  // Short messages (e.g. OneNote sync result) disappear on their own.
  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(null), 8000);
    return () => clearTimeout(t);
  }, [notice]);

  const handleFileSelect = useCallback((fileUrl, name, path) => {
    const url = fileUrl || getBlobUrlForPath(path) || null;
    setPreview({ url, name, path });
    setViewMode(null);
    setMobileTab("view");
  }, []);

  /** Open a file for the study tools (e.g. "Practice" a weak topic) without leaving the Study tab on phones. */
  const openFileForStudy = useCallback((path) => {
    const name = path.split("/").pop() || path;
    setPreview({ url: getBlobUrlForPath(path) || null, name, path });
    setViewMode(null);
  }, []);

  const askAboutSelection = useCallback(
    (text) => {
      setHighlight(text);
      if (isMobile) setMobileTab("chat");
    },
    [isMobile],
  );

  const handleOpenSource = useCallback(
    (path) => {
      const name = path.split("/").pop() || path;
      handleFileSelect(null, name, path);
    },
    [handleFileSelect],
  );

  useEffect(() => {
    if (!preview?.path || preview?.url) {
      setPreviewHydrating(false);
      return;
    }
    const pathToLoad = preview.path;
    let cancelled = false;
    setPreviewHydrating(true);
    (async () => {
      try {
        let url = await hydrateLocalPreviewFromMirror(pathToLoad);
        // Not on this device: PDFs and photos uploaded to the server are kept there too.
        if (!url && !cancelled && ["pdf", "image"].includes(previewKindFor(pathToLoad))) {
          url = await apiRequest(`/file_original?path=${encodeURIComponent(pathToLoad)}`)
            .then((data) => data.url || null)
            .catch(() => null);
        }
        if (cancelled) return;
        if (url) {
          setPreview((p) => (p?.path === pathToLoad ? { ...p, url } : p));
        }
      } finally {
        if (!cancelled) setPreviewHydrating(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [preview?.path, preview?.url]);

  const previewKind = previewKindFor(preview?.name);
  // Show the original when this device has it; otherwise the extracted text.
  const previewMode = viewMode || (preview?.url || previewHydrating ? "original" : "text");

  useEffect(() => {
    setPreviewText(null);
    if (!preview?.url || previewKind !== "text") return;
    let cancelled = false;
    fetch(preview.url)
      .then((res) => res.text())
      .then((text) => {
        if (!cancelled) setPreviewText(text);
      })
      .catch(() => {
        if (!cancelled) setPreviewText("");
      });
    return () => {
      cancelled = true;
    };
  }, [preview?.url, previewKind]);

  const handlePreviewAttach = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !preview?.path) return;
    registerLocalFile(preview.path, file);
    setPreview((p) =>
      p ? { ...p, url: getBlobUrlForPath(p.path), name: file.name || p.name } : null,
    );
    setViewMode("original");
  };

  // Connecting OneNote happens in Interview.ai's profile menu (it has to open Microsoft's sign-in in a
  // new tab); syncing runs here, so the new pages show up in the file list.
  const syncOneNote = useCallback(async () => {
    if (onenoteSyncing.current) return;
    onenoteSyncing.current = true;
    setNotice({ type: "info", text: "Syncing OneNote pages…" });
    try {
      const data = await apiRequest("/integrations/onenote/sync", {
        method: "POST",
        form: { max_pages: "25" },
      });
      const added = data.pages_ingested ?? 0;
      const skipped = data.pages_skipped ?? 0;
      const errs = (data.errors || []).length;
      setNotice({
        type: errs ? "error" : "success",
        text:
          `OneNote sync complete: ${added} page${added === 1 ? "" : "s"} added` +
          (skipped ? `, ${skipped} skipped` : "") +
          (errs ? `, ${errs} failed` : "") +
          ".",
      });
      setTreeRefreshKey((k) => k + 1);
    } catch (err) {
      setNotice({ type: "error", text: `OneNote sync failed. ${errorText(err)}` });
    } finally {
      onenoteSyncing.current = false;
    }
  }, []);

  // The profile menu lives in Interview.ai's header, which asks for these windows.
  useEffect(
    () =>
      onHostMessage((msg) => {
        if (msg.type !== "studyai:open") return;
        if (msg.what === "settings") setSettingsOpen(true);
        else if (msg.what === "feedback") setFeedbackOpen(true);
        else if (msg.what === "admin") setAdminOpen(true);
        else if (msg.what === "privacy") onShowPrivacy?.();
        else if (msg.what === "onenote-sync") void syncOneNote();
      }),
    [onShowPrivacy, syncOneNote],
  );

  const handleNotesDeleted = () => {
    forgetAllLocalFiles();
    setPreview(null);
    setTreeRefreshKey((k) => k + 1);
  };

  const handleAccountDeleted = () => {
    clearHistory();
    forgetAllLocalFiles();
    setSettingsOpen(false);
    onLogout?.();
  };

  /** Width updates go straight to the DOM during drag; React state commits on pointer up (smooth, no child re-renders per frame). */
  const handleLeftResizerPointerDown = (e) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    e.preventDefault();
    const handle = e.currentTarget;
    handle.setPointerCapture(e.pointerId);
    handle.classList.add("pane-resizer--active");

    const startX = e.clientX;
    const pane = leftSidebarRef.current;
    const startW = pane?.getBoundingClientRect().width ?? leftSidebarPx;

    const applyWidth = (w) => {
      const clamped = Math.min(LEFT_W_MAX, Math.max(LEFT_W_MIN, w));
      if (pane) pane.style.width = `${clamped}px`;
      return clamped;
    };

    const onMove = (ev) => {
      if (ev.pointerId !== e.pointerId) return;
      const dx = ev.clientX - startX;
      applyWidth(startW + dx);
    };

    const finish = (ev) => {
      if (ev.pointerId !== e.pointerId) return;
      try {
        handle.releasePointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
      handle.classList.remove("pane-resizer--active");
      handle.removeEventListener("pointermove", onMove);
      handle.removeEventListener("pointerup", finish);
      handle.removeEventListener("pointercancel", finish);
      document.body.style.removeProperty("cursor");
      document.body.style.removeProperty("user-select");

      const w = Math.round(
        pane?.getBoundingClientRect().width ??
          Math.min(LEFT_W_MAX, Math.max(LEFT_W_MIN, startW)),
      );
      const clamped = Math.min(LEFT_W_MAX, Math.max(LEFT_W_MIN, w));
      setLeftSidebarPx(clamped);
      if (pane) pane.style.width = `${clamped}px`;
      try {
        localStorage.setItem(LS_LEFT_W, String(clamped));
      } catch {
        /* ignore */
      }
    };

    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    handle.addEventListener("pointermove", onMove);
    handle.addEventListener("pointerup", finish);
    handle.addEventListener("pointercancel", finish);
  };

  const handleRightResizerPointerDown = (e) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    e.preventDefault();
    const handle = e.currentTarget;
    handle.setPointerCapture(e.pointerId);
    handle.classList.add("pane-resizer--active");

    const startX = e.clientX;
    const pane = rightSidebarRef.current;
    const startW = pane?.getBoundingClientRect().width ?? rightSidebarPx;

    const applyWidth = (w) => {
      const clamped = Math.min(RIGHT_W_MAX, Math.max(RIGHT_W_MIN, w));
      if (pane) pane.style.width = `${clamped}px`;
      return clamped;
    };

    const onMove = (ev) => {
      if (ev.pointerId !== e.pointerId) return;
      const dx = startX - ev.clientX;
      applyWidth(startW + dx);
    };

    const finish = (ev) => {
      if (ev.pointerId !== e.pointerId) return;
      try {
        handle.releasePointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
      handle.classList.remove("pane-resizer--active");
      handle.removeEventListener("pointermove", onMove);
      handle.removeEventListener("pointerup", finish);
      handle.removeEventListener("pointercancel", finish);
      document.body.style.removeProperty("cursor");
      document.body.style.removeProperty("user-select");

      const w = Math.round(
        pane?.getBoundingClientRect().width ??
          Math.min(RIGHT_W_MAX, Math.max(RIGHT_W_MIN, startW)),
      );
      const clamped = Math.min(RIGHT_W_MAX, Math.max(RIGHT_W_MIN, w));
      setRightSidebarPx(clamped);
      if (pane) pane.style.width = `${clamped}px`;
      try {
        localStorage.setItem(LS_RIGHT_W, String(clamped));
      } catch {
        /* ignore */
      }
    };

    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    handle.addEventListener("pointermove", onMove);
    handle.addEventListener("pointerup", finish);
    handle.addEventListener("pointercancel", finish);
  };

  const activeFilePath = preview?.path || "";
  const activeCourseFolder = activeFilePath.includes("/")
    ? activeFilePath.split("/")[0]
    : activeFilePath;

  const renderOriginal = () => {
    if (preview?.url) {
      if (previewKind === "pdf") {
        return <embed src={preview.url} type="application/pdf" title={preview.name || "PDF"} />;
      }
      if (previewKind === "image") return <img src={preview.url} alt="preview" />;
      if (previewKind === "text") {
        return previewText == null ? (
          <div className="preview-placeholder">
            <p>Loading…</p>
          </div>
        ) : (
          <pre className="preview-text">{previewText || "(This file is empty.)"}</pre>
        );
      }
      return (
        <div className="preview-placeholder">
          <div className="preview-placeholder-icon">📄</div>
          <p>
            Preview isn't available for this file type. Switch to Text to see what was read from it.
          </p>
        </div>
      );
    }
    if (previewHydrating) {
      return (
        <div className="preview-placeholder">
          <div className="preview-placeholder-icon">📄</div>
          <p>Opening from your folder on disk…</p>
        </div>
      );
    }
    return (
      <div className="preview-placeholder">
        <div className="preview-placeholder-icon">📄</div>
        <p>
          The original file isn't saved on this device. Choose it to view it here, or switch to Text
          to see what was read from it.
        </p>
        <input
          ref={previewAttachRef}
          type="file"
          accept="image/*,.pdf,application/pdf,.txt,.md,.csv,.json,.log"
          className="preview-attach-input"
          aria-hidden
          tabIndex={-1}
          onChange={handlePreviewAttach}
        />
        <button
          type="button"
          className="preview-attach-btn"
          onClick={() => previewAttachRef.current?.click()}
        >
          Choose file…
        </button>
      </div>
    );
  };

  const mainRowClass = `app-main-row${isMobile ? ` app-main-row--mobile mobile-tab-${mobileTab}` : ""}`;

  return (
    <div className={`app-container${isMobile ? " app-container--mobile" : ""}`}>
      {notice && (
        <div className={`app-notice app-notice--${notice.type}`} role="status">
          <span>{notice.text}</span>
          <button type="button" className="app-notice-close" onClick={() => setNotice(null)} aria-label="Dismiss">
            ×
          </button>
        </div>
      )}

      <GettingStartedTips />

      <div className={mainRowClass}>
        <div
          ref={leftSidebarRef}
          className="left-sidebar"
          style={{ width: leftSidebarPx }}
        >
          <div className="left-sidebar-content">
            <Explorer
              onFileSelect={handleFileSelect}
              activePath={activeFilePath}
              refreshKey={treeRefreshKey}
              maxUploadMb={serverConfig.max_upload_mb || null}
              onDeletePath={(path, isFolder) => {
                if (
                  preview?.path &&
                  (preview.path === path ||
                    (isFolder && preview.path.startsWith(`${path}/`)))
                ) {
                  setPreview(null);
                }
              }}
              onMovePath={(from, to, isFolder) => {
                if (!preview?.path || !to) return;
                if (!isFolder && preview.path === from) {
                  setPreview((p) =>
                    p ? { ...p, path: to, name: to.split("/").pop() || p.name } : null,
                  );
                  return;
                }
                if (isFolder && preview.path.startsWith(`${from}/`)) {
                  setPreview((p) =>
                    p
                      ? {
                          ...p,
                          path: `${to}/${p.path.slice(from.length + 1)}`,
                        }
                      : null,
                  );
                }
              }}
            />
          </div>
        </div>

        <div
          className="pane-resizer pane-resizer--vertical"
          onPointerDown={handleLeftResizerPointerDown}
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize file explorer and preview"
          title="Drag to resize"
        />

        <div className="preview-pane">
          {preview?.path && (
            <div className="preview-header">
              <span className="preview-title" title={preview.path}>
                {preview.name}
              </span>
              <div className="preview-toggle" role="group" aria-label="What to show">
                <button
                  type="button"
                  className={`preview-toggle-btn preview-toggle-original${previewMode === "original" ? " active" : ""}`}
                  aria-pressed={previewMode === "original"}
                  onClick={() => setViewMode("original")}
                >
                  Original
                </button>
                <button
                  type="button"
                  className={`preview-toggle-btn preview-toggle-text${previewMode === "text" ? " active" : ""}`}
                  aria-pressed={previewMode === "text"}
                  onClick={() => setViewMode("text")}
                >
                  Text
                </button>
              </div>
            </div>
          )}
          <div className="preview-content" ref={previewContentRef}>
            {!preview?.path ? (
              <div className="preview-placeholder">
                <div className="preview-placeholder-icon">📄</div>
                <p>Select a file from the explorer to preview it here</p>
              </div>
            ) : previewMode === "text" ? (
              <FileTextView key={preview.path} path={preview.path} />
            ) : (
              renderOriginal()
            )}
            <AskAboutSelection containerRef={previewContentRef} onAsk={askAboutSelection} />
          </div>
        </div>

        <div
          className="pane-resizer pane-resizer--vertical"
          onPointerDown={handleRightResizerPointerDown}
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize preview and chat panels"
          title="Drag to resize"
        />

        <div
          ref={rightSidebarRef}
          className="right-sidebar"
          style={{ width: rightSidebarPx }}
        >
          <div className="right-sidebar-content">
            <QueryInterface
              activeFilePath={activeFilePath}
              activeCourseFolder={activeCourseFolder}
              onOpenSource={handleOpenSource}
              highlight={highlight}
              onClearHighlight={() => setHighlight("")}
            />
            <StudyPanel
              activeFilePath={activeFilePath}
              activeCourseFolder={activeCourseFolder}
              onOpenFile={openFileForStudy}
            />
          </div>
        </div>
      </div>

      {isMobile && (
        <nav className="mobile-tabbar" role="tablist" aria-label="Sections">
          {MOBILE_TABS.map(([key, label]) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={mobileTab === key}
              className={`mobile-tab mobile-tab--${key}${mobileTab === key ? " active" : ""}`}
              onClick={() => setMobileTab(key)}
            >
              {label}
            </button>
          ))}
        </nav>
      )}

      {feedbackOpen && <FeedbackModal onClose={() => setFeedbackOpen(false)} />}
      {adminOpen && <AdminStats onClose={() => setAdminOpen(false)} />}

      {settingsOpen && (
        <AccountSettings
          onClose={() => setSettingsOpen(false)}
          onNotesDeleted={handleNotesDeleted}
          onAccountDeleted={handleAccountDeleted}
        />
      )}
    </div>
  );
}
