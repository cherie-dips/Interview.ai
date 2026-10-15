import { useState, useCallback, useEffect } from "react";
import {
  getSessionId,
  removeSession,
  ensureGuestId,
  isSignedIn,
  signOutOnServer,
  SESSION_KEY,
  SIGNED_OUT_EVENT,
} from "./auth";
import { DEFAULT_SERVER_CONFIG, loadServerConfig } from "./config";
import { onHostMessage, takeAuthRequest } from "./embed";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";
import Home from "./pages/Home";
import ChatPage from "./pages/ChatPage";
import PrivacyNote from "./components/PrivacyNote";

/** The password-reset email leads back here with ?reset=1&token=… (or &error=… when the link expired). */
function readResetLink() {
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get("reset") !== "1") return { token: "", expired: false };
    return { token: params.get("token") || "", expired: !params.get("token") };
  } catch {
    return { token: "", expired: false };
  }
}

const RESET_LINK = readResetLink();
const EXPIRED_LINK_NOTICE = "That reset link is invalid or has expired. Please ask for a new one.";

/** Remove the reset link's details from the address bar without reloading. */
function clearResetTokenFromUrl() {
  try {
    const url = new URL(window.location.href);
    for (const key of ["reset", "token", "error"]) url.searchParams.delete(key);
    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
  } catch {
    /* ignore */
  }
}

function App() {
  const [signedIn, setSignedIn] = useState(isSignedIn());
  const [resetToken, setResetToken] = useState(RESET_LINK.token);
  const [authView, setAuthView] = useState(() => {
    if (RESET_LINK.token) return "reset";
    if (RESET_LINK.expired) return "login";
    return isSignedIn() ? null : takeAuthRequest();
  });
  const [loginNotice, setLoginNotice] = useState(RESET_LINK.expired ? EXPIRED_LINK_NOTICE : "");
  const [serverConfig, setServerConfig] = useState(DEFAULT_SERVER_CONFIG);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const openPrivacy = useCallback(() => setPrivacyOpen(true), []);
  const closePrivacy = useCallback(() => setPrivacyOpen(false), []);

  useEffect(() => {
    if (!getSessionId()) ensureGuestId();
    if (RESET_LINK.expired) clearResetTokenFromUrl();
  }, []);

  useEffect(() => {
    let cancelled = false;
    loadServerConfig().then((cfg) => {
      if (!cancelled) setServerConfig(cfg);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    // The server rejected our session (expired or signed out elsewhere).
    const handleSignedOut = () => {
      setSignedIn(false);
      setAuthView("login");
      ensureGuestId();
    };
    window.addEventListener(SIGNED_OUT_EVENT, handleSignedOut);
    return () => window.removeEventListener(SIGNED_OUT_EVENT, handleSignedOut);
  }, []);

  useEffect(() => {
    // Signed in or out somewhere else on this site (another tab, or Interview.ai around Study AI).
    const onStorage = (e) => {
      if (e.key !== null && e.key !== SESSION_KEY) return;
      const now = isSignedIn();
      setSignedIn(now);
      if (now) setAuthView((v) => (v === "reset" ? v : null));
      else ensureGuestId();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(
    () =>
      // Interview.ai's "Sign in" button while Study AI is already open.
      onHostMessage((msg) => {
        if (msg.type === "studyai:auth" && !isSignedIn()) {
          setAuthView(msg.view === "register" ? "register" : "login");
        }
      }),
    [],
  );

  const onLogin = useCallback(() => {
    setSignedIn(true);
    setAuthView(null);
    setLoginNotice("");
  }, []);

  const onLogout = useCallback(() => {
    void signOutOnServer(); // reads the session id before removeSession() clears it
    removeSession();
    setSignedIn(false);
    ensureGuestId();
  }, []);

  const openSignIn = useCallback(() => setAuthView("login"), []);

  const closeAuth = useCallback(() => {
    if (authView === "reset") {
      clearResetTokenFromUrl();
      setResetToken("");
    }
    setAuthView(null);
  }, [authView]);

  useEffect(() => {
    if (!authView) return;
    const onKey = (e) => {
      if (e.key === "Escape") closeAuth();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [authView, closeAuth]);

  const onPasswordReset = useCallback((message) => {
    clearResetTokenFromUrl();
    setResetToken("");
    setLoginNotice(message);
    setAuthView("login");
  }, []);

  return (
    <>
      {signedIn ? (
        <Home
          onLogout={onLogout}
          signedIn={signedIn}
          serverConfig={serverConfig}
          onShowPrivacy={openPrivacy}
        />
      ) : (
        <ChatPage onSignInClick={openSignIn} onShowPrivacy={openPrivacy} />
      )}
      {authView === "login" && (
        <div className="auth-overlay" onClick={closeAuth}>
          <div className="auth-overlay-content" onClick={(e) => e.stopPropagation()}>
            <Login
              onLogin={onLogin}
              onSwitchToRegister={() => setAuthView("register")}
              onClose={closeAuth}
              passwordResetEnabled={!!serverConfig.password_reset_enabled}
              notice={loginNotice}
            />
          </div>
        </div>
      )}
      {authView === "register" && (
        <div className="auth-overlay" onClick={closeAuth}>
          <div className="auth-overlay-content" onClick={(e) => e.stopPropagation()}>
            <Register
              onRegister={onLogin}
              onSwitchToLogin={() => setAuthView("login")}
              onClose={closeAuth}
              onShowPrivacy={openPrivacy}
            />
          </div>
        </div>
      )}
      {authView === "reset" && resetToken && (
        <div className="auth-overlay" onClick={closeAuth}>
          <div className="auth-overlay-content" onClick={(e) => e.stopPropagation()}>
            <ResetPassword token={resetToken} onDone={onPasswordReset} onClose={closeAuth} />
          </div>
        </div>
      )}
      {privacyOpen && <PrivacyNote onClose={closePrivacy} />}
    </>
  );
}

export default App;
