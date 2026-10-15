import json

import pytest

from backend import chat_cache
from backend.pipeline import generation, indexing, models, retrieval
from backend.settings import CHAT_CACHE_TTL_SECONDS, MAX_CHAT_FILES_PER_SESSION

REAL_ANSWER_STREAM = generation.answer_stream  # before the fixture below replaces it


@pytest.fixture(autouse=True)
def fake_answers(monkeypatch):
    """Answer with the context we were given, so tests can see which notes were used."""
    monkeypatch.setattr(generation, "answer", lambda q, ctx, **kw: (f"ANSWER\n{ctx[:400]}", None))
    monkeypatch.setattr(generation, "answer_stream", lambda q, ctx, **kw: iter(["**Force** ", "= mass × acceleration"]))


@pytest.fixture
def library(client, user, upload):
    h = user["headers"]
    for folder in ("Physics", "Bio"):
        client.post("/create_folder", data={"name": folder}, headers=h)
    upload(h, "newton.md", b"Newton's second law: force equals mass times acceleration, F = ma. " * 10, folder="Physics")
    upload(h, "cells.txt", b"Mitochondria is the powerhouse of the cell and makes ATP. " * 10, folder="Bio")
    return h


def test_question_with_no_file_open_searches_all_notes(client, library):
    r = client.post("/query_folder", data={"query": "What is Newton's second law?"}, headers=library)
    j = r.json()
    assert r.status_code == 200 and j["selection_stage"] == "all_notes"
    assert "Physics/newton.md" in j["answer"]


def test_scores_come_from_the_rechecking_model(client, library):
    q = "What is Newton's second law?"
    j = client.post("/query_folder", data={"query": q, "opened_file_path": "Physics/newton.md"}, headers=library).json()
    assert j["selection_stage"] == "opened"
    top = j["source_documents"][0]["content"]
    assert abs(j["score_opened_best"] - models.relevance(q, [top])[0]) < 1e-3
    assert 0.5 < j["score_opened_best"] <= 1.0
    assert j["score_all_notes_best"] == -1.0  # later places aren't searched once one is relevant enough


def test_off_topic_open_file_falls_through(client, library):
    j = client.post(
        "/query_folder",
        data={"query": "How do mitochondria make ATP?", "opened_file_path": "Physics/newton.md"},
        headers=library,
    ).json()
    assert j["selection_stage"] == "all_notes" and "Bio/cells.txt" in j["answer"]


def test_main_source_is_labelled_for_the_ai(client, library):
    client.post("/file_meta", data={"path": "Bio/cells.txt", "is_primary_authority": "true"}, headers=library)
    j = client.post("/query_folder", data={"query": "What makes ATP?"}, headers=library).json()
    assert "Bio/cells.txt (main source)" in j["answer"]
    assert j["source_documents"][0]["metadata"]["is_primary_authority"] == 1


def test_streaming_answer(client, library):
    r = client.post("/query_folder/stream", data={"query": "What is force?"}, headers=library)
    assert r.status_code == 200 and r.headers["content-type"].startswith("application/x-ndjson")
    lines = [json.loads(line) for line in r.text.splitlines()]
    assert lines[0]["type"] == "meta" and lines[0]["source_documents"]
    assert "".join(x["text"] for x in lines if x["type"] == "delta") == "**Force** = mass × acceleration"
    assert lines[-1] == {"type": "done"}


def test_streaming_reports_ai_failure(client, library, monkeypatch):
    def broken(q, ctx, **kw):
        raise generation.GenerationError("upstream down")
        yield  # pragma: no cover

    monkeypatch.setattr(generation, "answer_stream", broken)
    lines = [json.loads(x) for x in client.post("/query_folder/stream", data={"query": "force?"}, headers=library).text.splitlines()]
    assert lines[-1]["type"] == "error" and "try again" in lines[-1]["error"]


def test_no_notes_gives_clear_error(client, user):
    r = client.post("/query_folder/stream", data={"query": "anything"}, headers=user["headers"])
    assert r.status_code == 400 and "No notes found" in r.json()["detail"]


def test_long_chat_upload_fully_searchable(client, user):
    h = user["headers"]
    text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. " * 800
    text += " The secret exam topic is the Krebs citric acid cycle in mitochondria."
    r = client.post("/chat/upload_ephemeral", data={"chat_session_id": "c1"}, files={"file": ("long.txt", text.encode())}, headers=h)
    assert r.status_code == 200
    j = client.post("/query_folder", data={"query": "What is the secret exam topic?", "chat_session_id": "c1"}, headers=h).json()
    assert j["selection_stage"] == "ephemeral" and "Krebs" in j["source_documents"][0]["content"]


def test_chat_cache_expiry_and_cap(client, user):
    h, uid = user["headers"], user["user_id"]
    client.post("/chat/upload_ephemeral", data={"chat_session_id": "c1"}, files={"file": ("a.txt", b"hello there")}, headers=h)
    chat_cache._cache[chat_cache._key(uid, "c1")]["last_used"] -= CHAT_CACHE_TTL_SECONDS + 5
    assert chat_cache.items(uid, "c1") == []
    for i in range(MAX_CHAT_FILES_PER_SESSION):
        client.post("/chat/upload_ephemeral", data={"chat_session_id": "c2"}, files={"file": (f"f{i}.txt", b"some text")}, headers=h)
    r = client.post("/chat/upload_ephemeral", data={"chat_session_id": "c2"}, files={"file": ("x.txt", b"more")}, headers=h)
    assert r.status_code == 400 and "Start a new chat" in r.text


def test_streamed_sarvam_reply_through_llamaindex(fake_sarvam):
    """The real streaming client reads Sarvam's server-sent events (skipping the model's reasoning)."""
    sent = fake_sarvam(lambda body: (200, ["Hello", " world"]))
    assert "".join(REAL_ANSWER_STREAM("q", "ctx")) == "Hello world"
    assert sent[0]["stream"] is True and sent[0]["model"] == "sarvam-105b"
    assert "reasoning_effort" not in sent[0]  # answers keep the model's default reasoning


def test_other_services_get_thinking_switched_off_their_way(fake_sarvam, monkeypatch):
    """With an OpenAI-style service (e.g. DeepSeek on NVIDIA), quick jobs and, if set, answers skip thinking."""
    from backend import settings
    from backend.pipeline import models

    sent = fake_sarvam(lambda body: (200, ["Hello", " world"]))
    monkeypatch.setattr(settings, "LLM_PROVIDER", "openai_like")
    monkeypatch.setattr(settings, "LLM_API_BASE", "https://integrate.api.nvidia.com/v1")
    monkeypatch.setattr(settings, "LLM_MODEL", "deepseek-ai/deepseek-v4.1-flash")
    monkeypatch.setattr(settings, "LLM_API_KEY", "test-key")
    models.forget_llms()
    off = {"thinking": False}

    generation.summary("Newton's laws of motion: inertia, F = ma, action and reaction. " * 5)
    assert sent[-1]["model"] == "deepseek-ai/deepseek-v4.1-flash" and sent[-1]["chat_template_kwargs"] == off
    assert "reasoning_effort" not in sent[-1]

    assert "".join(REAL_ANSWER_STREAM("q", "ctx")) == "Hello world"
    assert "chat_template_kwargs" not in sent[-1]  # ANSWER_THINKING on: the model's default
    monkeypatch.setattr(settings, "ANSWER_THINKING", False)
    assert "".join(REAL_ANSWER_STREAM("q", "ctx")) == "Hello world"
    assert sent[-1]["chat_template_kwargs"] == off

    monkeypatch.setattr(settings, "LLM_THINKING_OFF", {"reasoning": {"enabled": False}})  # OpenRouter's way
    models.forget_llms()
    "".join(REAL_ANSWER_STREAM("q", "ctx"))
    assert sent[-1]["reasoning"] == {"enabled": False} and "chat_template_kwargs" not in sent[-1]


def test_loosely_related_files_are_not_listed_as_sources(client, library, upload, user):
    upload(user["headers"], "kinematics.md", b"Kinematics describes motion with velocity and displacement. " * 10, folder="Physics")
    j = client.post("/query_folder", data={"query": "What is Newton's second law?", "course_path": "Physics"}, headers=library).json()
    assert {d["metadata"]["path"] for d in j["source_documents"]} == {"Physics/newton.md"}


# ---------- What the LlamaIndex + Postgres pipeline adds ----------
def test_keyword_search_finds_exact_terms(client, user, upload):
    """Passages sharing a rare word are found by keywords even when their meaning seems far away."""
    h = user["headers"]
    upload(h, "graphs.md", b"Dijkstra's algorithm finds shortest paths from one source when no edge weight is negative.")
    upload(h, "cooking.md", b"Boil the pasta for ten minutes, then add the tomato sauce and basil.")
    unrelated = models.embed_question("How long should pasta boil?")
    q = retrieval.Question(text="Dijkstra", keywords="Dijkstra", embedding=unrelated)
    found = retrieval.hybrid_search(indexing.notes_store(), q, indexing.where(user_id=user["user_id"]), k=1)
    assert {d["metadata"]["path"] for d in found} == {"cooking.md", "graphs.md"}  # 1 by meaning + 1 by keyword


def test_hindi_question_finds_english_notes(client, library):
    j = client.post("/query_folder", data={"query": "न्यूटन का दूसरा नियम क्या है?"}, headers=library).json()
    assert j["source_documents"][0]["metadata"]["path"] == "Physics/newton.md"


def test_follow_up_question_is_rewritten_before_searching(client, library, monkeypatch):
    asked = {}

    def fake_chat(messages, purpose, *a, **k):
        asked["prompt"] = messages[-1]["content"]
        return "How do mitochondria make ATP?", None

    def fake_answer(q, ctx, **kw):
        asked["history"] = kw.get("history")
        return f"ANSWER\n{ctx[:400]}", None

    monkeypatch.setattr(generation, "chat", fake_chat)
    monkeypatch.setattr(generation, "answer", fake_answer)
    history = [
        {"role": "user", "content": "Tell me about mitochondria"},
        {"role": "assistant", "content": "Mitochondria are organelles in the cell."},
    ]
    j = client.post(
        "/query_folder", data={"query": "How do they make energy?", "history": json.dumps(history)}, headers=library
    ).json()
    assert j["search_query"] == "How do mitochondria make ATP?"
    assert "Bio/cells.txt" in j["answer"]
    assert "Tell me about mitochondria" in asked["prompt"] and "How do they make energy?" in asked["prompt"]
    assert asked["history"] == history  # the answer sees the conversation too


def test_question_without_history_is_not_rewritten(client, library, monkeypatch):
    monkeypatch.setattr(generation, "chat", lambda *a, **k: pytest.fail("no rewrite without history"))
    j = client.post("/query_folder", data={"query": "What makes ATP?", "history": "not json"}, headers=library).json()
    assert j["search_query"] == "What makes ATP?"


def test_history_is_cleaned_for_the_model():
    messy = [
        {"role": "assistant", "content": "Hi! Ask me anything."},  # can't start with an answer
        {"role": "user", "content": "What is F?"},
        {"role": "user", "content": "In physics."},                 # merged with the one before
        {"role": "assistant", "content": "Force. " * 1000},         # shortened
        {"role": "user", "content": "And a?"},                      # the unanswered last question is dropped
        "junk",
    ]
    turns = generation.clean_history(messy)
    assert [t["role"] for t in turns] == ["user", "assistant"]
    assert turns[0]["content"] == "What is F?\n\nIn physics."
    assert len(turns[1]["content"]) <= generation.HISTORY_CHARS


def test_quotes_and_numbers_in_names_are_safe(client, user, upload):
    """Names go into search filters only as hashed keys, so quotes or digits can't break the SQL."""
    h = user["headers"]
    client.post("/create_folder", data={"name": "101"}, headers=h)
    upload(h, "Newton's laws.md", b"Newton's third law: every action has an equal and opposite reaction. " * 5, folder="101")
    j = client.post(
        "/query_folder", data={"query": "What is the third law?", "opened_file_path": "101/Newton's laws.md"}, headers=h
    ).json()
    assert j["selection_stage"] == "opened" and "101/Newton's laws.md" in j["answer"]


def test_students_cannot_reach_each_others_notes(client, signup, upload):
    a, b = signup(), signup()
    upload(a["headers"], "secret.md", b"The answer to the take-home exam is forty-two. " * 5)
    for path in ("secret.md", "x' OR '1'='1"):
        r = client.post("/query_folder", data={"query": "What is the exam answer?", "opened_file_path": path}, headers=b["headers"])
        assert r.status_code == 400 and "No notes found" in r.json()["detail"]
