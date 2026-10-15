import { useState } from "react";
import { API_BASE } from "../config";
import { setSessionId, apiErrorMessage, errorText } from "../auth";

async function post(path, fields) {
  const form = new FormData();
  Object.entries(fields).forEach(([k, v]) => form.append(k, v));
  const res = await fetch(`${API_BASE}${path}`, { method: "POST", body: form });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(apiErrorMessage(data, res));
  return data;
}

/**
 * The sign-in service can ask new accounts to confirm their email first: the student enters the code
 * it emailed, which also signs them in. Shown inside the sign-up and sign-in boxes.
 * `signUp` ({name}) comes from the sign-up form: confirming then also starts the Study AI account.
 */
export default function ConfirmEmail({ email, signUp = null, onSignedIn, onConfirmed, onBack }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  const confirm = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);
    try {
      const fields = { email, code: code.trim() };
      if (signUp) Object.assign(fields, { name: signUp.name || "", accepted_privacy: "true" });
      const data = await post("/register/confirm", fields);
      if (data.session_id) {
        setSessionId(data.session_id, data.name ?? undefined, data.user_id ?? undefined);
        onSignedIn?.(data);
      } else {
        onConfirmed?.(data.message || "Email confirmed. Please sign in.");
      }
    } catch (err) {
      setError(errorText(err));
    } finally {
      setLoading(false);
    }
  };

  const sendAgain = async () => {
    setError("");
    setInfo("");
    try {
      const data = await post("/register/send_code", { email });
      setInfo(data.message || "We've emailed you a new code.");
    } catch (err) {
      setError(errorText(err));
    }
  };

  return (
    <>
      <p className="auth-subtitle">Confirm your email</p>
      <p className="auth-info auth-confirm-text">
        We've emailed a code to <b>{email}</b>. Enter it here to finish. It can take a minute to
        arrive; check your spam folder too.
      </p>
      <form onSubmit={confirm} className="auth-form">
        <input
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          placeholder="Code from the email"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="auth-input"
          required
          maxLength={12}
          autoFocus
        />
        {error && <p className="auth-error">{error}</p>}
        {info && <p className="auth-info">{info}</p>}
        <button type="submit" className="auth-btn" disabled={loading || !code.trim()}>
          {loading ? "Checking…" : "Confirm"}
        </button>
      </form>
      <p className="auth-switch">
        <button type="button" onClick={sendAgain} className="auth-link">
          Send a new code
        </button>
        {" · "}
        <button type="button" onClick={onBack} className="auth-link">
          Back
        </button>
      </p>
    </>
  );
}
