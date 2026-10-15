"""
Sign-in through Neon Auth (Managed Better Auth, https://neon.com/docs/auth/overview).

Neon keeps the accounts and passwords and sends the password-reset and email-check emails. The
browser never talks to Neon itself: this server does, and hands the website the sign-in (Neon's
session cookie value), which the website sends back as the X-Session-Id header. That way sign-in
doesn't depend on browsers accepting another site's cookies (Safari blocks them), and Interview.ai's
"Ask AI" panel keeps working with the same header.

Neon only accepts changes from trusted websites, so every request carries the Origin of FRONTEND_URL:
add that website under Neon Console -> Auth -> Domains (localhost is allowed by default).

When Neon is set to require confirmed emails, a new account gets no sign-in until the student enters
the code Neon emails them; confirming the code signs them in (verify_email).
"""
import hashlib
import http.cookiejar
import logging
import re
import threading
import time
from dataclasses import dataclass
from urllib.parse import urlsplit

import httpx

from backend import db, settings

logger = logging.getLogger(__name__)

COOKIE = "__Secure-neon-auth.session_token"
# What a session id (Neon's signed cookie value) can contain; anything else could smuggle extra cookies.
_SESSION_RE = re.compile(r"^[A-Za-z0-9._~%+/=-]{16,512}$")

# Tests plug in new_client(fake transport) here; None = a client for the real service.
HTTP_CLIENT = None
_client = None
_client_lock = threading.Lock()

# Checking a sign-in with Neon takes a request to Neon; remember the answer for a short while.
_cache: dict[str, tuple[float, "User | None"]] = {}
_cache_lock = threading.Lock()
_CACHE_MAX = 10000
_UNKNOWN_SECONDS = 5


@dataclass(frozen=True)
class User:
    id: str
    email: str
    name: str
    email_verified: bool


@dataclass(frozen=True)
class SignIn:
    session: str  # what the website keeps and sends back as X-Session-Id ("" until the email is confirmed)
    user: User


class AuthError(Exception):
    """A sign-in request Neon refused or couldn't answer; `message` is shown to the user."""

    def __init__(self, message: str, status: int = 400, code: str = ""):
        super().__init__(message)
        self.message = message
        self.status = status
        self.code = code


UNAVAILABLE = "Can't reach the sign-in service right now. Please try again in a moment."


def configured() -> bool:
    return bool(settings.NEON_AUTH_BASE_URL)


class _NoCookies(http.cookiejar.DefaultCookiePolicy):
    def set_ok(self, cookie, request):
        return False


def new_client(transport: httpx.BaseTransport | None = None) -> httpx.Client:
    """
    A client that never keeps cookies: it is shared by every student's requests, so a kept session
    cookie would be sent along with someone else's request. Each reply's cookies are still readable.
    """
    return httpx.Client(timeout=20, transport=transport, cookies=http.cookiejar.CookieJar(policy=_NoCookies()))


def _http() -> httpx.Client:
    global _client
    if HTTP_CLIENT is not None:
        return HTTP_CLIENT
    with _client_lock:
        if _client is None:
            _client = new_client()
        return _client


def _origin() -> str:
    parts = urlsplit(settings.FRONTEND_URL)
    return f"{parts.scheme}://{parts.netloc}"


def _request(path: str, payload: dict | None = None, session: str | None = None, method: str = "POST") -> httpx.Response:
    if not configured():
        raise AuthError("Sign-in isn't set up on this server (NEON_AUTH_BASE_URL).", 503, "NOT_CONFIGURED")
    headers = {"Origin": _origin()}
    if session:
        if not _SESSION_RE.match(session):
            raise AuthError("Your session has expired. Please sign in again.", 401, "BAD_SESSION")
        headers["Cookie"] = f"{COOKIE}={session}"
    url = settings.NEON_AUTH_BASE_URL.rstrip("/") + path
    try:
        if method == "GET":
            return _http().get(url, headers=headers)
        return _http().post(url, json=payload if payload is not None else {}, headers=headers)
    except httpx.HTTPError as e:
        logger.warning("Neon Auth %s failed: %s", path, e)
        raise AuthError(UNAVAILABLE, 503, "UNAVAILABLE") from e


def _body(r: httpx.Response) -> dict:
    try:
        data = r.json()
    except ValueError:
        return {}
    return data if isinstance(data, dict) else {}


def _check(r: httpx.Response, messages: dict[str, tuple[str, int]]) -> dict:
    """The JSON body of a successful reply; otherwise AuthError with a readable message."""
    body = _body(r)
    if r.status_code < 400:
        return body
    code = str(body.get("code") or "")
    if code in messages:
        message, status = messages[code]
        raise AuthError(message, status, code)
    if r.status_code == 429:
        raise AuthError("Too many attempts. Please wait a minute and try again.", 429, code)
    if code in ("INVALID_ORIGIN", "MISSING_OR_NULL_ORIGIN", "INVALID_REDIRECT_URL", "INVALID_CALLBACKURL"):
        logger.error("Neon Auth refused %s: add it under Neon Console -> Auth -> Domains", _origin())
        raise AuthError("Sign-in isn't set up correctly on this server.", 503, code)
    if r.status_code >= 500:
        raise AuthError(UNAVAILABLE, 503, code)
    logger.warning("Neon Auth refused a request: %s %s", r.status_code, body)
    raise AuthError(str(body.get("message") or "The sign-in service refused the request."), 400, code)


def _user(data: dict) -> User:
    return User(
        id=str(data.get("id") or ""),
        email=str(data.get("email") or "").lower(),
        name=str(data.get("name") or ""),
        email_verified=bool(data.get("emailVerified")),
    )


def _signed_in(r: httpx.Response, body: dict, need_session: bool = True) -> SignIn:
    session = r.cookies.get(COOKIE) or ""
    user = body.get("user")
    if not isinstance(user, dict) or not (session or not need_session):
        logger.error("Neon Auth reply had no session cookie or user")
        raise AuthError(UNAVAILABLE, 503, "NO_SESSION")
    return SignIn(session=session, user=_user(user))


# ---------- Accounts and sign-ins ----------
def sign_up(email: str, password: str, name: str) -> SignIn:
    """The new account, signed in; or with session "" when Neon wants the email confirmed first (it has
    emailed the code)."""
    r = _request("/sign-up/email", {"email": email, "password": password, "name": name})
    body = _check(r, {
        "USER_ALREADY_EXISTS": ("Email already registered.", 400),
        "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL": ("Email already registered.", 400),
        "INVALID_EMAIL": ("Please enter a valid email address.", 400),
        "PASSWORD_TOO_SHORT": (f"Password must be at least {settings.MIN_PASSWORD_LEN} characters.", 400),
        "PASSWORD_TOO_LONG": ("Password is too long.", 400),
    })
    return _signed_in(r, body, need_session=False)


def sign_in(email: str, password: str) -> SignIn:
    """Raises AuthError code EMAIL_NOT_VERIFIED (only after a correct password) while the email isn't confirmed."""
    r = _request("/sign-in/email", {"email": email, "password": password})
    body = _check(r, {
        "INVALID_EMAIL_OR_PASSWORD": ("Invalid email or password.", 401),
        "EMAIL_NOT_VERIFIED": ("Please confirm your email first.", 403),
    })
    return _signed_in(r, body)


def sign_out(session: str) -> None:
    """End the sign-in at Neon too, so it stops working on every server."""
    forget(session)
    if session and _SESSION_RE.match(session):
        try:
            _request("/sign-out", session=session)
        except AuthError:
            logger.warning("Couldn't end a session at Neon Auth", exc_info=True)


def change_password(session: str, current: str, new: str) -> str:
    """Change the password and sign out every other device. Returns this device's new sign-in."""
    r = _request(
        "/change-password",
        {"currentPassword": current, "newPassword": new, "revokeOtherSessions": True},
        session=session,
    )
    _check(r, {
        "INVALID_PASSWORD": ("Your current password is incorrect.", 400),
        "PASSWORD_TOO_SHORT": (f"Password must be at least {settings.MIN_PASSWORD_LEN} characters.", 400),
        "PASSWORD_TOO_LONG": ("Password is too long.", 400),
    })
    forget(session)
    return r.cookies.get(COOKIE) or session


def request_password_reset(email: str, redirect_to: str) -> None:
    """Neon emails a reset link (if the account exists) that leads back to `redirect_to` with ?token=."""
    _check(_request("/request-password-reset", {"email": email, "redirectTo": redirect_to}), {})


def reset_password(token: str, new_password: str) -> None:
    r = _request("/reset-password", {"token": token, "newPassword": new_password})
    _check(r, {
        "INVALID_TOKEN": ("This reset link is invalid or has expired. Please ask for a new one.", 400),
        "PASSWORD_TOO_SHORT": (f"Password must be at least {settings.MIN_PASSWORD_LEN} characters.", 400),
        "PASSWORD_TOO_LONG": ("Password is too long.", 400),
    })


def send_verification_code(email: str) -> None:
    """Email a code that confirms the address (if an account has it)."""
    _check(_request("/email-otp/send-verification-otp", {"email": email, "type": "email-verification"}), {})


def verify_email(email: str, code: str) -> SignIn | None:
    """Confirm the email with the emailed code. Neon then signs the student in: that sign-in, if any."""
    r = _request("/email-otp/verify-email", {"email": email, "otp": code})
    body = _check(r, {
        "INVALID_OTP": ("That code is wrong. Please check the email and try again.", 400),
        "OTP_EXPIRED": ("That code has expired. Please ask for a new one.", 400),
        "TOO_MANY_ATTEMPTS": ("Too many wrong codes. Please ask for a new one.", 429),
    })
    forget_user(_user_id_for_email(email))
    if r.cookies.get(COOKIE) and isinstance(body.get("user"), dict):
        return _signed_in(r, body)
    return None


def revoke_sessions(session: str) -> None:
    """Sign out every device of the session's user."""
    _check(_request("/revoke-sessions", session=session), {})


def delete_user(user_id: str) -> None:
    """Delete the Neon Auth account (its sessions and password go with it). Neon Auth keeps its
    accounts in the neon_auth schema of the project's own database, which DATABASE_URL points at."""
    if db.scalar("SELECT to_regclass('neon_auth.\"user\"') IS NOT NULL AS ok"):
        db.execute('DELETE FROM neon_auth."user" WHERE id = CAST(:id AS uuid)', id=user_id)
    else:  # e.g. a local database while sign-in uses Neon
        logger.warning("Neon Auth account %s not deleted: delete it in the Neon Console (Auth -> Users)", user_id)
    forget_user(user_id)


def _user_id_for_email(email: str) -> str:
    with _cache_lock:
        for _, user in _cache.values():
            if user and user.email == email.lower():
                return user.id
    return ""


# ---------- Checking a sign-in ----------
def _key(session: str) -> str:
    return hashlib.sha256(session.encode("utf-8")).hexdigest()


def current_user(session: str) -> User | None:
    """The user signed in with this session, or None. Raises AuthError if Neon can't be reached."""
    if not session or not _SESSION_RE.match(session):
        return None
    key = _key(session)
    now = time.time()
    with _cache_lock:
        hit = _cache.get(key)
        if hit and hit[0] > now:
            return hit[1]
    r = _request("/get-session", session=session, method="GET")
    body = _check(r, {})
    user = _user(body["user"]) if isinstance(body.get("user"), dict) else None
    ttl = settings.AUTH_CACHE_SECONDS if user else _UNKNOWN_SECONDS
    with _cache_lock:
        if len(_cache) >= _CACHE_MAX:
            _cache.clear()
        _cache[key] = (now + ttl, user)
    return user


def forget(session: str | None) -> None:
    if session:
        with _cache_lock:
            _cache.pop(_key(session), None)


def forget_user(user_id: str) -> None:
    """Drop every remembered sign-in of this user (after a password change, email check or deletion)."""
    if not user_id:
        return
    with _cache_lock:
        for key in [k for k, (_, u) in _cache.items() if u and u.id == user_id]:
            del _cache[key]


def reset_cache() -> None:
    with _cache_lock:
        _cache.clear()
