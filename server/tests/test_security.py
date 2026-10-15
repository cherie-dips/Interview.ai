def test_health_and_config(client):
    assert client.get("/health").json() == {"status": "ok"}
    cfg = client.get("/config").json()
    assert set(cfg) == {
        "password_reset_enabled", "onenote_configured", "max_upload_mb", "max_chat_files",
        "reminders_available", "languages",
    }


def test_cors_only_for_allowed_sites(client):
    r = client.get("/health", headers={"Origin": "https://evil.example"})
    assert "access-control-allow-origin" not in r.headers
    r = client.get("/health", headers={"Origin": "https://cherie-dips.github.io"})
    assert r.headers.get("access-control-allow-origin") == "https://cherie-dips.github.io"


def test_crash_returns_json_with_cors(client, user, monkeypatch):
    from backend import paths

    monkeypatch.setattr(paths, "vfs_get_tree", lambda uid: (_ for _ in ()).throw(RuntimeError("boom")))
    r = client.get("/list_tree", headers={**user["headers"], "Origin": "https://cherie-dips.github.io"})
    assert r.status_code == 500 and r.json()["error"]
    assert r.headers.get("access-control-allow-origin")


def test_onenote_callback_escapes_html(client):
    r = client.get("/integrations/onenote/callback", params={"error": "x", "error_description": "<script>alert(1)</script>"})
    assert "<script>" not in r.text and "&lt;script&gt;" in r.text


def test_users_cannot_see_each_other(client, signup, upload):
    a, b = signup(), signup()
    upload(a["headers"], "secret.txt", b"My private notes about cryptography. " * 5)
    assert client.get("/list_tree", headers=b["headers"]).json()["tree"] == []
    assert client.get("/file_text", params={"path": "secret.txt"}, headers=b["headers"]).status_code == 404
