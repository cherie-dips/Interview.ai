/**
 * The Study AI server (the same one Interview.ai's Ask AI uses; keep this in step with
 * STUDY_AI_API in site/js/study-ai.js).
 * - localStorage.studyai_api, if set (e.g. 'http://localhost:8000'), wins; it is shared with Ask AI.
 * - On your computer (npm run dev, or the site served from localhost): http://localhost:8000.
 * - Otherwise the live server on Hugging Face.
 */
function getApiBase() {
  try {
    const override = localStorage.getItem("studyai_api");
    if (override) return override.replace(/\/+$/, "");
  } catch {
    /* ignore */
  }
  if (import.meta.env.DEV || ["localhost", "127.0.0.1"].includes(window.location.hostname)) {
    return "http://localhost:8000";
  }
  return "https://diptidhawade-notescanner.hf.space";
}

export const API_BASE = getApiBase();

/** Server feature flags (GET /config). Every flag is off if the request fails. */
export const DEFAULT_SERVER_CONFIG = {
  password_reset_enabled: false,
  onenote_configured: false,
  max_upload_mb: null,
  max_chat_files: null,
  reminders_available: false,
  languages: [],
};

export async function loadServerConfig() {
  try {
    const res = await fetch(`${API_BASE}/config`);
    if (!res.ok) return DEFAULT_SERVER_CONFIG;
    const data = await res.json();
    return { ...DEFAULT_SERVER_CONFIG, ...(data && typeof data === "object" ? data : {}) };
  } catch {
    return DEFAULT_SERVER_CONFIG;
  }
}
