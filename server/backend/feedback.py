"""Answer ratings and general feedback from students (the feedback table)."""
import time
import uuid

from backend import db

KINDS = ("answer", "general")
RATINGS = ("up", "down", "")
_FIELD_LIMITS = {"comment": 2000, "question": 1000, "answer": 2000, "sources": 1000}


def add(user_id: str, kind: str, rating: str, selection_stage: str = "", **fields: str) -> None:
    texts = {k: str(fields.get(k) or "")[:limit] for k, limit in _FIELD_LIMITS.items()}
    db.execute(
        "INSERT INTO feedback (id, user_id, kind, rating, selection_stage, comment, question, answer, sources, "
        "created_at) VALUES (:id, :u, :kind, :rating, :stage, :comment, :question, :answer, :sources, :now)",
        id=f"fb_{uuid.uuid4().hex}",
        u=user_id,
        kind=kind,
        rating=rating,
        stage=(selection_stage or "")[:40],
        now=int(time.time()),
        **texts,
    )


def recent(limit: int = 50, since: int = 0) -> list[dict]:
    found = db.rows(
        "SELECT user_id, kind, rating, selection_stage, comment, question, answer, sources, created_at "
        "FROM feedback WHERE created_at >= :since ORDER BY created_at DESC LIMIT :limit",
        since=int(since),
        limit=int(limit),
    )
    return [{**r, "created_at": int(r["created_at"])} for r in found]


def delete_user(user_id: str) -> None:
    db.execute("DELETE FROM feedback WHERE user_id = :u", u=user_id)
