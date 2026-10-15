"""
Test setup: a throwaway Postgres with pgvector (started by pgserver, no Docker needed), the real local
search models, and no real AI calls. Neon Auth and the file bucket are stand-ins (tests/fakes.py).

Run with:  python -m pytest -q tests
To use your own Postgres instead, set TEST_DATABASE_URL (its Study AI tables are emptied!).
"""
import os
import sys
import tempfile
import time
import uuid

os.environ["SARVAM_API_KEY"] = ""  # never call Sarvam from tests (local OCR fallbacks are used)
os.environ["STARTER_NOTES"] = "false"  # tests that need them add them explicitly
os.environ.pop("ADMIN_EMAILS", None)
os.environ.pop("ALERT_WEBHOOK_URL", None)
# Tests use Sarvam (faked), whatever language model .env picks.
os.environ.update(LLM_PROVIDER="sarvam", LLM_API_BASE="", LLM_API_KEY="", LLM_MODEL="", ANSWER_THINKING="true")
os.environ.pop("LLM_THINKING_OFF", None)
# Sign-in goes to the fake Neon Auth; originals are only stored by tests that ask for file_storage.
os.environ["NEON_AUTH_BASE_URL"] = "https://auth.test/neondb/auth"
# The live site, whatever .env says (the sign-in Origin and email links come from it).
os.environ["FRONTEND_URL"] = "https://cherie-dips.github.io/SDE-Prep/"
for _name in ("AWS_ENDPOINT_URL_S3", "S3_BUCKET", "AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY"):
    os.environ[_name] = ""
os.environ.setdefault("MAX_UPLOAD_MB", "1")
os.environ.setdefault("TOKENIZERS_PARALLELISM", "false")
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


def _test_database_url() -> str:
    if os.environ.get("TEST_DATABASE_URL"):
        return os.environ["TEST_DATABASE_URL"]
    import logging

    import pgserver

    logging.getLogger("pgserver").disabled = True  # it logs while shutting down, after pytest closed its output
    server = pgserver.get_server(tempfile.mkdtemp(prefix="notescanner-test-db-"), cleanup_mode="delete")
    return server.get_uri()


os.environ["DATABASE_URL"] = _test_database_url()

import httpx  # noqa: E402
import pytest  # noqa: E402
from fastapi.testclient import TestClient  # noqa: E402

from backend import api, auth, db, neon_auth, originals, rate_limit, settings, usage  # noqa: E402
from fakes import AUTH_URL, FakeBucket, FakeNeonAuth  # noqa: E402

assert settings.NEON_AUTH_BASE_URL == AUTH_URL
db.init()


@pytest.fixture(autouse=True)
def fresh_state():
    """Empty database and request counters for every test."""
    db.empty_all_tables()
    rate_limit.reset()
    usage.reset_cache()
    neon_auth.reset_cache()
    auth._synced.clear()
    yield


@pytest.fixture(autouse=True)
def neon(monkeypatch):
    """A fake Neon Auth for every test (accounts, sessions, reset links, emailed codes)."""
    fake = FakeNeonAuth()
    monkeypatch.setattr(neon_auth, "HTTP_CLIENT", neon_auth.new_client(httpx.MockTransport(fake.handle)))

    def delete_user(user_id):
        fake.delete_user(user_id)
        neon_auth.forget_user(user_id)

    monkeypatch.setattr(neon_auth, "delete_user", delete_user)
    return fake


@pytest.fixture
def file_storage(monkeypatch):
    """Keep uploaded originals in a fake bucket (returned, so tests can look inside)."""
    bucket = FakeBucket()
    monkeypatch.setattr(settings, "FILES_S3_ENDPOINT", "https://files.test")
    monkeypatch.setattr(settings, "FILES_S3_BUCKET", "usernotes")
    monkeypatch.setenv("AWS_ACCESS_KEY_ID", "test")
    monkeypatch.setenv("AWS_SECRET_ACCESS_KEY", "test")
    monkeypatch.setattr(originals, "CLIENT", bucket)
    return bucket


@pytest.fixture
def client():
    return TestClient(api.app, raise_server_exceptions=False)


@pytest.fixture
def signup(client):
    def _signup(email: str | None = None, password: str = "goodpass123") -> dict:
        email = email or f"user-{uuid.uuid4().hex[:8]}@example.com"
        r = client.post("/register", data={"email": email, "password": password, "name": "Test", "accepted_privacy": "true"})
        assert r.status_code == 200, r.text
        body = r.json()
        return {"headers": {"X-Session-Id": body["session_id"]}, "user_id": body["user_id"], "email": email}

    return _signup


@pytest.fixture
def user(signup):
    return signup()


@pytest.fixture
def confirm_email(client, neon):
    """Mark a signed-up user's email as confirmed (as if they had entered the emailed code)."""

    def _confirm(u: dict) -> None:
        neon.user_by_email(u["email"])["emailVerified"] = True
        neon_auth.reset_cache()
        auth._synced.clear()
        assert client.get("/me", headers=u["headers"]).json()["email_verified"] is True

    return _confirm


def wait_for_job(client, headers, job_id, timeout=60) -> dict:
    deadline = time.time() + timeout
    while time.time() < deadline:
        job = client.get(f"/jobs/{job_id}", headers=headers).json()
        if job.get("status") in ("done", "failed"):
            return job
        time.sleep(0.1)
    raise AssertionError(f"upload job {job_id} did not finish")


@pytest.fixture
def upload(client):
    """Upload a file through /upload_note and wait for the background job to finish."""

    def _upload(headers, name: str, data: bytes, folder: str = "", expect: str = "done") -> dict:
        r = client.post("/upload_note", data={"path": folder}, files={"file": (name, data)}, headers=headers)
        assert r.status_code == 202, r.text
        job = wait_for_job(client, headers, r.json()["job_id"])
        assert job["status"] == expect, job
        return job

    return _upload


def tree_paths(client, headers) -> set[str]:
    from backend.vfs_tree import flatten_file_paths

    return set(flatten_file_paths(client.get("/list_tree", headers=headers).json()["tree"]))


@pytest.fixture
def fake_sarvam(monkeypatch):
    """
    Answer Sarvam chat requests with reply(request_body) -> (status, content): content is the reply
    text, a list of pieces for a streamed reply, or an error body when status >= 400.
    Returns the list of request bodies sent, so tests can check what was asked.
    """
    import json

    import httpx

    from backend.pipeline import models

    sent: list[dict] = []

    def install(reply):
        def handler(request: httpx.Request) -> httpx.Response:
            body = json.loads(request.content)
            sent.append(body)
            status, content = reply(body)
            if status >= 400:
                return httpx.Response(status, json=content)
            if body.get("stream"):
                pieces = content if isinstance(content, list) else [content]
                events = [{"reasoning_content": "thinking..."}] + [{"content": p} for p in pieces]
                stream = "".join(
                    "data: " + json.dumps({"id": "x", "object": "chat.completion.chunk", "created": 0,
                                           "model": body["model"], "choices": [{"index": 0, "delta": d}]}) + "\n\n"
                    for d in events
                ) + "data: [DONE]\n\n"
                return httpx.Response(200, headers={"content-type": "text/event-stream"}, content=stream.encode())
            return httpx.Response(200, json={
                "id": "x", "object": "chat.completion", "created": 0, "model": body["model"],
                "choices": [{"index": 0, "message": {"role": "assistant", "content": content}, "finish_reason": "stop"}],
                "usage": {"prompt_tokens": 10, "completion_tokens": 5, "total_tokens": 15},
            })

        monkeypatch.setenv("SARVAM_API_KEY", "test-key")
        monkeypatch.setattr(models, "HTTP_CLIENT", httpx.Client(transport=httpx.MockTransport(handler)))
        models.forget_llms()
        return sent

    yield install
    models.forget_llms()
