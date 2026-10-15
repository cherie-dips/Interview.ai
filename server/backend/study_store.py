"""
Saved flashcard decks with spaced repetition, quiz results and exam plans (tables in db.SCHEMA).

A card's schedule is stored on the card (due_at, interval_days, ease, reps, lapses), so "what's due"
is a simple query. Scheduling is a simplified SM-2 (the algorithm behind Anki's original scheduler).
"""
import csv
import datetime as dt
import io
import json
import time
import uuid

from backend import db

GRADES = ("again", "hard", "good", "easy")
MAX_CARDS_PER_DECK = 200
MAX_FIELD_CHARS = 4000
RELEARN_SECONDS = 600   # "again" shows the card again in 10 minutes
DAY = 86400


def create_deck(user_id: str, name: str, source_path: str, cards: list[dict]) -> dict:
    now = int(time.time())
    clean = []
    for c in cards[:MAX_CARDS_PER_DECK]:
        front = str(c.get("front") or "").strip()[:MAX_FIELD_CHARS]
        back = str(c.get("back") or "").strip()[:MAX_FIELD_CHARS]
        if front and back:
            clean.append({"front": front, "back": back, "source": str(c.get("source") or "notes")[:40]})
    if not clean:
        raise ValueError("A deck needs at least one card with a front and a back.")
    name = (name or "").strip()[:120] or "Flashcards"
    deck_id = uuid.uuid4().hex[:16]
    with db.transaction() as conn:
        db.execute(
            "INSERT INTO decks (id, user_id, name, source_path, created_at) VALUES (:id, :u, :name, :src, :now)",
            conn, id=deck_id, u=user_id, name=name, src=(source_path or "")[:1000], now=now,
        )
        for i, c in enumerate(clean):
            db.execute(
                "INSERT INTO cards (id, deck_id, user_id, position, front, back, source, due_at) "
                "VALUES (:id, :deck, :u, :pos, :front, :back, :source, :now)",
                conn, id=f"card_{uuid.uuid4().hex[:20]}", deck=deck_id, u=user_id, pos=i, now=now, **c,
            )
    return {"deck_id": deck_id, "name": name, "card_count": len(clean)}


def list_decks(user_id: str) -> list[dict]:
    found = db.rows(
        "SELECT d.id, d.name, d.source_path, d.created_at, count(c.id) AS card_count, "
        "count(c.id) FILTER (WHERE c.due_at <= :now) AS due_count "
        "FROM decks d LEFT JOIN cards c ON c.deck_id = d.id "
        "WHERE d.user_id = :u GROUP BY d.id ORDER BY d.created_at DESC",
        u=user_id, now=int(time.time()),
    )
    return [{
        "deck_id": r["id"],
        "name": r["name"] or "Flashcards",
        "source_path": r["source_path"] or "",
        "card_count": int(r["card_count"]),
        "due_count": int(r["due_count"]),
        "created_at": int(r["created_at"]),
    } for r in found]


def _deck(user_id: str, deck_id: str) -> dict | None:
    return db.one("SELECT * FROM decks WHERE id = :id AND user_id = :u", id=deck_id, u=user_id)


def deck_cards(user_id: str, deck_id: str, due_only: bool, limit: int) -> list[dict] | None:
    """Cards of a deck (None if the deck doesn't exist). due_only: cards due now, soonest first."""
    if not _deck(user_id, deck_id):
        return None
    found = db.rows(
        "SELECT * FROM cards WHERE deck_id = :d AND user_id = :u"
        + (" AND due_at <= :now" if due_only else "")
        + " ORDER BY due_at, position LIMIT :limit",
        d=deck_id, u=user_id, now=int(time.time()), limit=max(1, min(limit, MAX_CARDS_PER_DECK)),
    )
    return [{
        "card_id": r["id"],
        "front": r["front"],
        "back": r["back"],
        "source": r["source"],
        "due_at": int(r["due_at"]),
        "interval_days": float(r["interval_days"]),
        "reps": int(r["reps"]),
    } for r in found]


def schedule(meta: dict, grade: str, now: int) -> dict:
    """Next review for a card after the student grades it (simplified SM-2)."""
    ease = float(meta.get("ease") or 2.5)
    interval = float(meta.get("interval_days") or 0)
    reps = int(meta.get("reps") or 0)
    lapses = int(meta.get("lapses") or 0)
    if grade == "again":
        return {**meta, "ease": max(1.3, ease - 0.2), "interval_days": 0.0, "reps": 0,
                "lapses": lapses + 1, "due_at": now + RELEARN_SECONDS}
    if grade == "hard":
        ease = max(1.3, ease - 0.15)
        interval = 1.0 if reps == 0 else max(1.0, interval * 1.2)
    elif grade == "good":
        interval = 1.0 if reps == 0 else (3.0 if reps == 1 else interval * ease)
    else:  # easy
        ease += 0.15
        interval = 3.0 if reps == 0 else max(4.0, interval * ease * 1.3)
    interval = round(min(interval, 365.0), 2)
    return {**meta, "ease": round(ease, 3), "interval_days": interval, "reps": reps + 1,
            "lapses": lapses, "due_at": now + int(interval * DAY)}


def review_card(user_id: str, card_id: str, grade: str) -> dict | None:
    if grade not in GRADES:
        raise ValueError("Grade must be one of: again, hard, good, easy.")
    with db.transaction() as conn:
        row = db.one("SELECT * FROM cards WHERE id = :id AND user_id = :u FOR UPDATE", conn, id=card_id, u=user_id)
        if not row:
            return None
        new = schedule(row, grade, int(time.time()))
        db.execute(
            "UPDATE cards SET due_at = :due_at, interval_days = :interval_days, ease = :ease, reps = :reps, "
            "lapses = :lapses WHERE id = :id",
            conn, id=card_id, **{k: new[k] for k in ("due_at", "interval_days", "ease", "reps", "lapses")},
        )
    return {"card_id": card_id, "due_at": new["due_at"], "interval_days": new["interval_days"]}


def delete_deck(user_id: str, deck_id: str) -> bool:
    return db.execute("DELETE FROM decks WHERE id = :id AND user_id = :u", id=deck_id, u=user_id) > 0


def export_csv(user_id: str, deck_id: str) -> tuple[str, str] | None:
    """(deck name, CSV text with front,back rows) for importing into Anki, or None."""
    deck = _deck(user_id, deck_id)
    if not deck:
        return None
    buf = io.StringIO()
    writer = csv.writer(buf)
    for r in db.rows("SELECT front, back FROM cards WHERE deck_id = :d ORDER BY position", d=deck_id):
        writer.writerow([r["front"], r["back"]])
    return deck["name"] or "flashcards", buf.getvalue()


def delete_all(user_id: str) -> None:
    """Every deck, card, quiz result and exam plan of a user."""
    with db.transaction() as conn:
        for table in ("cards", "decks", "quiz_results", "exams"):
            db.execute(f"DELETE FROM {table} WHERE user_id = :u", conn, u=user_id)


def due_count(user_id: str, until: int | None = None) -> int:
    """Number of cards due by `until` (epoch seconds; default now) across all decks."""
    until = int(until if until is not None else time.time())
    return int(db.scalar("SELECT count(*) FROM cards WHERE user_id = :u AND due_at <= :t", u=user_id, t=until) or 0)


# ---------- Quiz results per file (for "weak topics") ----------
def mcq_record(user_id: str, path: str, correct: int, total: int) -> dict:
    row = db.one(
        "INSERT INTO quiz_results (user_id, path, correct, total, updated_at) VALUES (:u, :p, :c, :t, :now) "
        "ON CONFLICT (user_id, path) DO UPDATE SET correct = quiz_results.correct + EXCLUDED.correct, "
        "total = quiz_results.total + EXCLUDED.total, updated_at = EXCLUDED.updated_at RETURNING *",
        u=user_id, p=path[:1000], c=int(correct), t=int(total), now=int(time.time()),
    )
    return {"path": row["path"], "correct": int(row["correct"]), "total": int(row["total"]), "updated_at": int(row["updated_at"])}


def weak_topics(user_id: str, min_answered: int = 3, below: float = 0.7, limit: int = 5) -> list[dict]:
    """Files whose quiz accuracy is lowest (only files with at least `min_answered` answers)."""
    out = []
    for r in db.rows("SELECT path, correct, total FROM quiz_results WHERE user_id = :u", u=user_id):
        total, correct = int(r["total"]), int(r["correct"])
        if total >= min_answered and correct / total < below:
            out.append({"path": r["path"], "correct": correct, "total": total, "accuracy": round(correct / total, 3)})
    out.sort(key=lambda t: (t["accuracy"], -t["total"]))
    return out[:limit]


# ---------- Exam plans ----------
def build_exam_plan(files: list[str], exam_day: dt.date, today: dt.date) -> list[dict]:
    """
    A day-by-day plan from today to the exam: spread the course files over the revision days
    (a second pass if there's time), a timed mock test the day before, light review on exam day.
    """
    days_left = (exam_day - today).days
    if days_left < 0:
        raise ValueError("The exam date is in the past.")
    if days_left > 180:
        raise ValueError("Pick an exam date within the next 6 months.")
    names = [f.rsplit("/", 1)[-1] for f in files]
    if days_left == 0:
        return [{"date": today.isoformat(), "tasks": ["Exam today: review your due flashcards and skim your main-source notes. Good luck!"]}]

    study_days = [today + dt.timedelta(days=d) for d in range(days_left)]
    mock_day = study_days[-1] if days_left >= 2 else None
    revision_days = study_days[:-1] if mock_day else study_days
    n = len(revision_days)
    groups: list[list[str]] = [[] for _ in range(n)]
    if names:
        if len(names) >= n:
            for i, name in enumerate(names):
                groups[i * n // len(names)].append(name)
        else:
            for i in range(n):
                groups[i].append(names[i % len(names)])

    plan = []
    for i, day in enumerate(revision_days):
        tasks = []
        if groups[i]:
            again = names and len(names) < n and i >= len(names)
            tasks.append(("Revise again: " if again else "Revise: ") + ", ".join(groups[i]) + " (ask about anything unclear)")
        tasks.append("Make flashcards for what you revised, and review the cards due today")
        if i and i % 3 == 0:
            tasks.append("Practice quiz (Mock MCQ) on the files from the last few days")
        plan.append({"date": day.isoformat(), "tasks": tasks})
    if mock_day:
        plan.append({
            "date": mock_day.isoformat(),
            "tasks": ["Timed mock test for the whole course (Exam tab)", "Go over the questions you got wrong and re-read those files"],
        })
    plan.append({"date": exam_day.isoformat(), "tasks": ["Exam day: review only your due flashcards. Good luck!"]})
    return plan


def _exam_public(row: dict, today: dt.date) -> dict:
    exam_day = row["exam_date"]
    return {
        "exam_id": row["id"],
        "course": row["course"] or "",
        "exam_date": exam_day.isoformat(),
        "days_left": (exam_day - today).days,
        "plan": row["plan"] if isinstance(row["plan"], list) else json.loads(row["plan"] or "[]"),
    }


def save_exam(user_id: str, course: str, files: list[str], exam_day: dt.date, today: dt.date) -> dict:
    plan = build_exam_plan(files, exam_day, today)
    row = db.one(
        "INSERT INTO exams (id, user_id, course, exam_date, plan, created_at) "
        "VALUES (:id, :u, :course, :day, CAST(:plan AS jsonb), :now) RETURNING *",
        id=uuid.uuid4().hex[:16], u=user_id, course=course[:500], day=exam_day,
        plan=json.dumps(plan, ensure_ascii=False), now=int(time.time()),
    )
    return _exam_public(row, today)


def list_exams(user_id: str, today: dt.date) -> list[dict]:
    found = db.rows("SELECT * FROM exams WHERE user_id = :u ORDER BY exam_date, created_at", u=user_id)
    return [_exam_public(r, today) for r in found]


def delete_exam(user_id: str, exam_id: str) -> bool:
    return db.execute("DELETE FROM exams WHERE id = :id AND user_id = :u", id=exam_id, u=user_id) > 0
