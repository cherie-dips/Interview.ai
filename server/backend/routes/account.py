"""Sign-up, sign-in, sign-out, password changes/resets, email checks and account deletion.

Accounts and passwords live in Neon Auth (backend/neon_auth.py); these routes call it for the website
and keep Study AI's own details (privacy acceptance, preferences) in the users table.
"""
import logging
import re
import time
import uuid

from fastapi import APIRouter, Form, HTTPException, Request
from fastapi.responses import JSONResponse

from backend import (
    chat_cache,
    feedback,
    neon_auth,
    originals,
    preferences,
    rate_limit,
    settings,
    starter_notes,
    study_store,
    uploads,
    usage,
)
from backend.auth import SESSION_HEADER, forget_user, signed_in_user
from backend.pipeline.indexing import delete_all_note_passages
from backend.store import (
    delete_user_vfs,
    onenote_token_delete,
    user_create,
    user_delete,
    user_document_delete_many,
    user_get_by_id,
)
from backend.deps import SignedInUser
from backend.rate_limit import client_ip
from backend.settings import (
    FRONTEND_URL,
    LIMIT_FORGOT_PER_EMAIL,
    LIMIT_FORGOT_PER_IP,
    LIMIT_GUEST_ID_PER_IP,
    LIMIT_LOGIN_PER_EMAIL,
    LIMIT_LOGIN_PER_IP,
    LIMIT_PASSWORD_CHECK_PER_USER,
    LIMIT_REGISTER_PER_IP,
    LIMIT_RESET_PER_IP,
    MAX_PASSWORD_LEN,
    MIN_PASSWORD_LEN,
)

logger = logging.getLogger(__name__)
router = APIRouter()

_EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
LIMIT_EMAIL_CODES_PER_USER = (5, 3600)


def _error(message: str, status_code: int = 400) -> JSONResponse:
    return JSONResponse({"error": message}, status_code=status_code)


def _auth_error(e: neon_auth.AuthError) -> JSONResponse:
    return _error(e.message, e.status)


def _password_problem(password: str) -> str | None:
    if len(password) < MIN_PASSWORD_LEN:
        return f"Password must be at least {MIN_PASSWORD_LEN} characters."
    if len(password) > MAX_PASSWORD_LEN:
        return f"Password is too long (maximum {MAX_PASSWORD_LEN} characters)."
    return None


def _database_error(action: str) -> JSONResponse:
    logger.exception("%s failed", action)
    return _error(f"{action} failed because of a server error. Please try again.", 500)


def _signed_in(signin: neon_auth.SignIn, name: str = "") -> JSONResponse:
    return JSONResponse({
        "session_id": signin.session,
        "user_id": signin.user.id,
        "name": name or signin.user.name or signin.user.email.split("@")[0],
    })


def _accepted(value: str) -> bool:
    return (value or "").strip().lower() in ("1", "true", "yes", "on")


def _start_account(user: neon_auth.User, name: str) -> None:
    """Add the Study AI account for a Neon Auth account (the student accepted the privacy note just now)."""
    added = user_create(
        user.id,
        user.email,
        name,
        user.email_verified,
        privacy_accepted_at=int(time.time()),
        privacy_version=settings.PRIVACY_VERSION,
    )
    if added and settings.STARTER_NOTES:
        starter_notes.add_starter_notes_in_background(user.id)


def _send_code(email: str) -> None:
    """Email a new confirmation code, unless this address got several already (then the last one still works)."""
    try:
        rate_limit.check("signup-code", email, *LIMIT_EMAIL_CODES_PER_USER)
    except HTTPException:
        return
    neon_auth.send_verification_code(email)


def _confirm_email(email: str, status_code: int = 200) -> JSONResponse:
    """Neon wants the email confirmed before signing in: the website asks for the emailed code."""
    return JSONResponse({
        "confirm_email": True,
        "email": email,
        "error" if status_code >= 400 else "message": f"Please confirm your email: enter the code we sent to {email}.",
    }, status_code=status_code)


@router.post("/register")
def register(
    request: Request,
    email: str = Form(...),
    password: str = Form(...),
    name: str = Form(""),
    accepted_privacy: str = Form(""),
):
    rate_limit.check("register", client_ip(request), *LIMIT_REGISTER_PER_IP)
    if not _accepted(accepted_privacy):
        return _error("Please read and accept the privacy note.")
    email = (email or "").strip().lower()
    name = (name or "").strip()[:80]
    if len(email) > 254 or not _EMAIL_RE.match(email):
        return _error("Please enter a valid email address.")
    problem = _password_problem(password)
    if problem:
        return _error(problem)
    display_name = name or email.split("@")[0]
    try:
        signin = neon_auth.sign_up(email, password, display_name)
    except neon_auth.AuthError as e:
        if e.code not in ("USER_ALREADY_EXISTS", "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL"):
            return _auth_error(e)
        # The Neon account may exist without a Study AI account (an earlier sign-up that didn't
        # finish, or one still waiting for its email code): with the right password, carry on.
        try:
            signin = neon_auth.sign_in(email, password)
        except neon_auth.AuthError as e2:
            if e2.code != "EMAIL_NOT_VERIFIED":
                return _error("Email already registered.")
            try:
                _send_code(email)
            except neon_auth.AuthError as e3:
                return _auth_error(e3)
            return _confirm_email(email)  # the account is made once the code is confirmed
        if user_get_by_id(signin.user.id):
            neon_auth.sign_out(signin.session)
            return _error("Email already registered.")
    try:
        _start_account(signin.user, display_name)
    except Exception:
        if signin.session:
            neon_auth.sign_out(signin.session)
        return _database_error("Sign-up")
    if not signin.session:
        return _confirm_email(email)  # Neon has emailed the code
    return _signed_in(signin, display_name)


@router.post("/register/confirm")
def confirm_sign_up(
    request: Request,
    email: str = Form(...),
    code: str = Form(...),
    name: str = Form(""),
    accepted_privacy: str = Form(""),
):
    """The emailed code confirms the email and signs the student in (sign-up, or sign-in before confirming)."""
    ip = client_ip(request)
    email = (email or "").strip().lower()
    rate_limit.check("login-ip", ip, *LIMIT_LOGIN_PER_IP)
    rate_limit.check("login", f"{ip}|{email}", *LIMIT_LOGIN_PER_EMAIL)
    try:
        signin = neon_auth.verify_email(email, (code or "").strip())
    except neon_auth.AuthError as e:
        return _auth_error(e)
    if not signin:  # confirmed, but Neon didn't sign in
        return JSONResponse({"confirmed": True, "message": "Email confirmed. Please sign in."})
    try:
        user = user_get_by_id(signin.user.id)
        if not user and _accepted(accepted_privacy):
            _start_account(signin.user, (name or "").strip()[:80] or email.split("@")[0])
            user = user_get_by_id(signin.user.id)
    except Exception:
        neon_auth.sign_out(signin.session)
        return _database_error("Sign-up")
    if not user:
        neon_auth.sign_out(signin.session)
        return _error("No account was finished for this email. Please sign up again with the same email.", 401)
    return _signed_in(signin, user.get("name") or "")


@router.post("/register/send_code")
def send_sign_up_code(request: Request, email: str = Form(...)):
    """A new code for confirming the email (the last one expired or didn't arrive)."""
    email = (email or "").strip().lower()
    rate_limit.check("forgot-ip", client_ip(request), *LIMIT_FORGOT_PER_IP)
    if _EMAIL_RE.match(email):
        rate_limit.check("signup-code", email, *LIMIT_EMAIL_CODES_PER_USER)
        try:
            neon_auth.send_verification_code(email)
        except neon_auth.AuthError as e:
            if e.status >= 500 or e.status == 429:
                return _auth_error(e)
    return JSONResponse({"message": f"If {email} is waiting to be confirmed, we've emailed it a new code."})


@router.post("/login")
def login(request: Request, email: str = Form(...), password: str = Form(...)):
    ip = client_ip(request)
    email = (email or "").strip().lower()
    rate_limit.check("login-ip", ip, *LIMIT_LOGIN_PER_IP)
    rate_limit.check("login", f"{ip}|{email}", *LIMIT_LOGIN_PER_EMAIL)
    try:
        signin = neon_auth.sign_in(email, password)
    except neon_auth.AuthError as e:
        if e.code != "EMAIL_NOT_VERIFIED":
            return _auth_error(e)
        # Right password, email not confirmed yet: send a code (Neon doesn't on sign-in).
        try:
            _send_code(email)
        except neon_auth.AuthError as e2:
            return _auth_error(e2)
        return _confirm_email(email, 403)
    try:
        user = user_get_by_id(signin.user.id)
    except Exception:
        return _database_error("Sign-in")
    if not user:
        neon_auth.sign_out(signin.session)
        return _error("No account was finished for this email. Please sign up again with the same email.", 401)
    return _signed_in(signin, user.get("name") or "")


@router.post("/logout")
def logout(request: Request):
    """End the session at Neon Auth too, so the session id stops working everywhere."""
    neon_auth.sign_out((request.headers.get(SESSION_HEADER) or "").strip())
    return JSONResponse({"message": "Signed out."})


@router.get("/me")
def get_me(request: Request):
    """Current user info for the session. Requires a valid X-Session-Id."""
    found = signed_in_user((request.headers.get(SESSION_HEADER) or "").strip())
    if not found:
        return _error("Not signed in.", 401)
    user = user_get_by_id(found.id)
    if not user:
        return _error("User not found.", 404)
    name = user.get("name") or (user.get("email") or "").split("@")[0]
    return JSONResponse({
        "name": name or "User",
        "user_id": found.id,
        "email": user.get("email") or "",
        "email_verified": found.email_verified,
        "is_admin": found.email_verified and (user.get("email") or "").lower() in settings.ADMIN_EMAILS,
        "preferences": preferences.get(found.id),
    })


@router.get("/account/preferences")
def get_preferences(user_id: SignedInUser = None):
    return preferences.public(user_id)


@router.post("/account/preferences")
def set_preferences(reminders: str = Form(None), answer_language: str = Form(None), user_id: SignedInUser = None):
    try:
        preferences.update(
            user_id,
            reminders=None if reminders is None else reminders.strip().lower() in ("1", "true", "yes", "on"),
            answer_language=answer_language,
        )
    except ValueError as e:
        return _error(str(e))
    return preferences.public(user_id)


@router.get("/guest_id")
def get_guest_id(request: Request):
    """Return a new guest id for anonymous use. Frontend stores it and sends X-Guest-Id header."""
    rate_limit.check("guest-id", client_ip(request), *LIMIT_GUEST_ID_PER_IP)
    return JSONResponse({"guest_id": str(uuid.uuid4())})


@router.post("/account/change_password")
def change_password(
    request: Request,
    current_password: str = Form(...),
    new_password: str = Form(...),
    user_id: SignedInUser = None,
):
    rate_limit.check("password-check", user_id, *LIMIT_PASSWORD_CHECK_PER_USER)
    problem = _password_problem(new_password)
    if problem:
        return _error(problem)
    try:
        session = neon_auth.change_password(request.headers.get(SESSION_HEADER) or "", current_password, new_password)
    except neon_auth.AuthError as e:
        return _auth_error(e)
    forget_user(user_id)
    # Every other device is signed out; this one continues with a new session id.
    return JSONResponse({"message": "Password changed. Other devices have been signed out.", "session_id": session})


@router.post("/account/delete")
def delete_account(password: str = Form(...), user_id: SignedInUser = None):
    """Permanently delete the account and everything stored for it."""
    rate_limit.check("password-check", user_id, *LIMIT_PASSWORD_CHECK_PER_USER)
    user = user_get_by_id(user_id)
    try:
        check = neon_auth.sign_in(user["email"], password)
    except neon_auth.AuthError as e:
        if e.code == "INVALID_EMAIL_OR_PASSWORD":
            return _error("Password is incorrect.", 400)
        return _auth_error(e)
    try:
        originals.remove_user(user_id)
    except Exception:
        logger.exception("Couldn't delete the stored originals of %s", user_id)
    delete_all_note_passages(user_id)
    delete_user_vfs(user_id)
    study_store.delete_all(user_id)
    user_document_delete_many(user_id, path_filter=None)
    onenote_token_delete(user_id)
    chat_cache.clear_user(user_id)
    uploads.forget_user_jobs(user_id)
    usage.delete_user(user_id)
    feedback.delete_user(user_id)
    preferences.forget(user_id)
    user_delete(user_id)
    # Sign out every device, then delete the Neon Auth account itself.
    try:
        neon_auth.revoke_sessions(check.session)
    except neon_auth.AuthError:
        logger.warning("Couldn't sign out the devices of a deleted account", exc_info=True)
    neon_auth.delete_user(user_id)
    forget_user(user_id)
    return JSONResponse({"message": "Your account and all your notes have been deleted."})


@router.post("/account/verify_email/send")
def send_email_code(user_id: SignedInUser = None):
    """Email a code that proves the student owns their email address."""
    rate_limit.check("email-code", user_id, *LIMIT_EMAIL_CODES_PER_USER)
    try:
        neon_auth.send_verification_code(user_get_by_id(user_id)["email"])
    except neon_auth.AuthError as e:
        return _auth_error(e)
    return JSONResponse({"message": "We've emailed you a code. It expires in a few minutes."})


@router.post("/account/verify_email")
def confirm_email_code(code: str = Form(...), user_id: SignedInUser = None):
    rate_limit.check("password-check", user_id, *LIMIT_PASSWORD_CHECK_PER_USER)
    try:
        extra = neon_auth.verify_email(user_get_by_id(user_id)["email"], (code or "").strip())
    except neon_auth.AuthError as e:
        return _auth_error(e)
    if extra:
        neon_auth.sign_out(extra.session)  # Neon signs in again on confirming; this device already is
    forget_user(user_id)
    return JSONResponse({"message": "Email confirmed."})


FORGOT_MESSAGE = "If an account exists for that email, we've sent a link to reset the password. It expires in 1 hour."


def _reset_redirect() -> str:
    base = FRONTEND_URL
    return base + ("&" if "?" in base else "?") + "reset=1"


@router.post("/password/forgot")
def forgot_password(request: Request, email: str = Form(...)):
    email = (email or "").strip().lower()
    rate_limit.check("forgot-ip", client_ip(request), *LIMIT_FORGOT_PER_IP)
    rate_limit.check("forgot", email, *LIMIT_FORGOT_PER_EMAIL)
    if _EMAIL_RE.match(email):
        try:
            neon_auth.request_password_reset(email, _reset_redirect())
        except neon_auth.AuthError as e:
            if e.status >= 500:
                return _auth_error(e)
    # Same answer either way, so the form can't be used to find out who has an account.
    return JSONResponse({"message": FORGOT_MESSAGE})


@router.post("/password/reset")
def reset_password(request: Request, token: str = Form(...), new_password: str = Form(...)):
    rate_limit.check("reset", client_ip(request), *LIMIT_RESET_PER_IP)
    problem = _password_problem(new_password)
    if problem:
        return _error(problem)
    try:
        neon_auth.reset_password((token or "").strip(), new_password)
    except neon_auth.AuthError as e:
        return _auth_error(e)
    return JSONResponse({"message": "Password updated. Please sign in with your new password."})
