/**
 * Study AI lives inside Interview.ai's "Study AI" tab (site/js/study-ai.js puts this page in a frame).
 * Both are on one site, so they share the sign-in: Interview.ai's header and "Ask AI" panel read the
 * same session from localStorage. Interview.ai's header holds the profile menu and asks this page,
 * by message, to open its windows.
 */
const params = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");

/** The product name the student sees. */
export const APP_NAME = "Study AI";

/**
 * `?auth=login` / `?auth=register` opens that box on load (Ask AI's "Sign in" buttons).
 * Read once, then removed from the address so a reload doesn't open it again.
 */
export function takeAuthRequest() {
  const wanted = params.get("auth");
  if (!wanted) return null;
  try {
    const url = new URL(window.location.href);
    url.searchParams.delete("auth");
    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
  } catch {
    /* ignore */
  }
  return wanted === "register" ? "register" : "login";
}

/** Messages from the Interview.ai page around us, e.g. {type: "studyai:auth", view: "login"}. Same origin only. */
export function onHostMessage(handler) {
  const listener = (e) => {
    if (e.origin !== window.location.origin || !e.data || typeof e.data !== "object") return;
    handler(e.data);
  };
  window.addEventListener("message", listener);
  return () => window.removeEventListener("message", listener);
}

/**
 * Run `handler` each time Interview.ai switches back to the Study AI tab, so data changed meanwhile
 * (e.g. a deck saved from Ask AI) shows up. Returns a cleanup function, for useEffect.
 */
export function onShown(handler) {
  return onHostMessage((msg) => {
    if (msg.type === "studyai:shown") handler();
  });
}
