"""
Who is calling: a signed-in student (X-Session-Id, checked with Neon Auth) or a guest (X-Guest-Id).

The session id is the sign-in Neon Auth gave this server at sign-up or sign-in (backend/neon_auth.py).
A signed-in student also needs a row in the users table, made at sign-up with their privacy acceptance.
"""
import logging
import uuid

from fastapi import HTTPException, Request

from backend import neon_auth
from backend.store import user_sync

logger = logging.getLogger(__name__)

SESSION_HEADER = "X-Session-Id"
GUEST_HEADER = "X-Guest-Id"

_synced: dict[str, neon_auth.User] = {}  # last details copied to the users table, per user id


def signed_in_user(session_id: str) -> neon_auth.User | None:
    """
    The Neon Auth user for a live session that has a Study AI account, or None.
    Raises HTTP 503 if the sign-in service or the database can't be reached.
    """
    try:
        user = neon_auth.current_user(session_id)
    except neon_auth.AuthError as e:
        raise HTTPException(status_code=e.status if e.status >= 500 else 503, detail=e.message)
    if not user:
        return None
    if _synced.get(user.id) == user:
        return user
    try:
        known = user_sync(user.id, user.email, user.name, user.email_verified)
    except Exception:
        logger.exception("User lookup failed")
        raise HTTPException(status_code=503, detail="Can't reach the database right now. Please try again in a moment.")
    if not known:
        return None  # signed in to Neon, but never finished signing up here (or the account was deleted)
    _synced[user.id] = user
    return user


def forget_user(user_id: str) -> None:
    _synced.pop(user_id, None)
    neon_auth.forget_user(user_id)


def get_user_id_from_session(session_id: str | None) -> str | None:
    user = signed_in_user((session_id or "").strip())
    return user.id if user else None


def _valid_guest_id(guest_id: str) -> bool:
    try:
        uuid.UUID(guest_id)
        return True
    except (ValueError, AttributeError, TypeError):
        return False


def _signed_in_user_or_none(request: Request) -> str | None:
    """
    User id for the X-Session-Id header, None if no header was sent.
    A header that no longer matches a live session raises HTTP 401 so the app can sign out.
    """
    session_id = (request.headers.get(SESSION_HEADER) or "").strip()
    if not session_id:
        return None
    user_id = get_user_id_from_session(session_id)
    if not user_id:
        raise HTTPException(status_code=401, detail="Your session has expired. Please sign in again.")
    return user_id


def get_effective_user(request: Request) -> tuple[str, bool]:
    """
    Returns (effective_user_id, is_guest).
    - If X-Session-Id is sent -> (user_id, False), or HTTP 401 if that session is no longer valid.
    - Else if X-Guest-Id is a valid id -> ("guest_<id>", True).
    - Else raises ValueError (caller should return 400; client must call GET /guest_id first).
    """
    user_id = _signed_in_user_or_none(request)
    if user_id:
        return user_id, False
    guest_id = (request.headers.get(GUEST_HEADER) or "").strip()
    if guest_id and _valid_guest_id(guest_id):
        return f"guest_{guest_id}", True
    raise ValueError("Missing X-Guest-Id. Call GET /guest_id first or sign in.")


def require_signed_in_user(request: Request) -> str:
    """User id for routes that store data or call paid AI services; HTTP 401 for guests."""
    user_id = _signed_in_user_or_none(request)
    if not user_id:
        raise HTTPException(status_code=401, detail="Please sign in to continue.")
    return user_id
