"""
Counting what each student does per day: questions, uploads, pages read by Sarvam Vision, AI tokens,
flashcard reviews, ratings. Used for the admin page, cost estimates, streaks, and the monthly budget.

One row per user per day in the usage_daily table (one column per counter).
"""
import datetime as dt
import logging
import threading
import time
from zoneinfo import ZoneInfo

from fastapi import HTTPException

from backend import db, settings

logger = logging.getLogger(__name__)

COUNTERS = (
    "questions",
    "uploads",
    "pages_read",
    "upload_failures",
    "study_requests",
    "reviews",
    "prompt_tokens",
    "completion_tokens",
    "ratings_up",
    "ratings_down",
)

_lock = threading.Lock()
_month_cost: dict[str, float] = {}  # "YYYY-MM" -> estimated cost so far (filled lazily from the database)


def tz() -> ZoneInfo:
    try:
        return ZoneInfo(settings.APP_TIMEZONE)
    except Exception:
        return ZoneInfo("UTC")


def today(now: float | None = None) -> dt.date:
    return dt.datetime.fromtimestamp(now if now is not None else time.time(), tz()).date()


def day_num(day: dt.date) -> int:
    return day.year * 10000 + day.month * 100 + day.day


def prices_set() -> bool:
    return any(
        (settings.AI_PRICE_PER_PAGE, settings.AI_PRICE_PER_1K_INPUT_TOKENS, settings.AI_PRICE_PER_1K_OUTPUT_TOKENS)
    )


def cost_of(counts: dict) -> float:
    return (
        float(counts.get("pages_read") or 0) * settings.AI_PRICE_PER_PAGE
        + float(counts.get("prompt_tokens") or 0) / 1000 * settings.AI_PRICE_PER_1K_INPUT_TOKENS
        + float(counts.get("completion_tokens") or 0) / 1000 * settings.AI_PRICE_PER_1K_OUTPUT_TOKENS
    )


def record(user_id: str, **increments: int) -> None:
    """Add to today's counters for a user. Never raises: counting must not break the request."""
    increments = {k: int(v) for k, v in increments.items() if k in COUNTERS and v}
    if not user_id or not increments:
        return
    day = today()
    month = f"{day.year:04d}-{day.month:02d}"
    cols = ", ".join(increments)  # names come from COUNTERS only
    try:
        db.execute(
            f"INSERT INTO usage_daily (user_id, day, {cols}) VALUES (:u, :day, "
            + ", ".join(f":{k}" for k in increments)
            + ") ON CONFLICT (user_id, day) DO UPDATE SET "
            + ", ".join(f"{k} = usage_daily.{k} + EXCLUDED.{k}" for k in increments),
            u=user_id,
            day=day,
            **increments,
        )
        with _lock:
            if month in _month_cost:
                _month_cost[month] += cost_of(increments)
    except Exception:
        logger.warning("Usage counting failed for %s", user_id, exc_info=True)


def _public(row: dict) -> dict:
    day = row["day"]
    return {**{k: int(row[k]) for k in COUNTERS}, "user_id": row["user_id"], "day": day.isoformat(),
            "day_num": day_num(day), "month": f"{day.year:04d}-{day.month:02d}"}


def records_since(start: dt.date, user_id: str | None = None) -> list[dict]:
    if user_id:
        found = db.rows("SELECT * FROM usage_daily WHERE day >= :d AND user_id = :u", d=start, u=user_id)
    else:
        found = db.rows("SELECT * FROM usage_daily WHERE day >= :d", d=start)
    return [_public(r) for r in found]


def month_cost(now: float | None = None) -> float:
    day = today(now)
    month = f"{day.year:04d}-{day.month:02d}"
    with _lock:
        if month not in _month_cost:
            first = day.replace(day=1)
            sums = db.one(
                "SELECT " + ", ".join(f"coalesce(sum({k}), 0) AS {k}" for k in COUNTERS)
                + " FROM usage_daily WHERE day >= :first AND day <= :day",
                first=first,
                day=day,
            )
            _month_cost[month] = cost_of(sums or {})
        return _month_cost[month]


def check_budget() -> None:
    """Pause paid AI work (HTTP 503) once this month's estimated cost reaches AI_MONTHLY_BUDGET."""
    if settings.AI_MONTHLY_BUDGET <= 0 or not prices_set():
        return
    try:
        spent = month_cost()
    except Exception:
        logger.warning("Budget check failed; allowing the request", exc_info=True)
        return
    if spent >= settings.AI_MONTHLY_BUDGET:
        raise HTTPException(
            status_code=503,
            detail="Study AI has used this month's AI budget, so reading files, answers and study "
            "tools are paused until next month. Your notes and flashcard reviews still work.",
        )


def reset_cache() -> None:
    with _lock:
        _month_cost.clear()


def delete_user(user_id: str) -> None:
    db.execute("DELETE FROM usage_daily WHERE user_id = :u", u=user_id)
