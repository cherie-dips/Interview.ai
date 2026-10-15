import httpx

from backend import db, neon_auth, settings, store
from conftest import tree_paths
from test_files import pdf_with_text


def test_register_validation(client):
    r = client.post("/register", data={"email": "a@b.co", "password": "short", "accepted_privacy": "true"})
    assert r.status_code == 400 and "8" in r.json()["error"]
    r = client.post("/register", data={"email": "not-an-email", "password": "goodpass123", "accepted_privacy": "true"})
    assert r.status_code == 400
    r = client.post("/register", data={"email": "a@b.co", "password": "x" * 200, "accepted_privacy": "true"})
    assert r.status_code == 400 and "too long" in r.json()["error"]
    r = client.post("/register", data={"email": "a@b.co", "password": "goodpass123"})
    assert r.status_code == 400 and "privacy" in r.json()["error"]


def test_sign_up_makes_a_neon_account_with_privacy_acceptance(client, signup, neon):
    u = signup("new@example.com")
    assert neon.user_by_email("new@example.com")["id"] == u["user_id"]
    meta = store.user_get_by_id(u["user_id"])["meta"]
    assert meta["privacy_version"] == settings.PRIVACY_VERSION and meta["privacy_accepted_at"] > 0
    me = client.get("/me", headers=u["headers"]).json()
    assert me["email"] == "new@example.com" and me["email_verified"] is False and me["is_admin"] is False


def test_duplicate_email_rejected(client, signup):
    signup("same@example.com")
    r = client.post("/register", data={"email": "SAME@example.com", "password": "goodpass123", "accepted_privacy": "true"})
    assert r.status_code == 400 and "already registered" in r.json()["error"]


def test_unfinished_sign_up_is_finished_by_signing_up_again(client, neon):
    # A Neon account without a Study AI account (e.g. the database failed during sign-up).
    neon.users["u1"] = {"id": "u1", "email": "half@example.com", "name": "", "emailVerified": False, "password": "goodpass123"}
    form = {"email": "half@example.com", "password": "goodpass123", "accepted_privacy": "true"}
    r = client.post("/login", data={"email": "half@example.com", "password": "goodpass123"})
    assert r.status_code == 401 and "sign up again" in r.json()["error"]
    assert client.post("/register", data={**form, "password": "wrongpass1"}).status_code == 400
    r = client.post("/register", data=form)
    assert r.status_code == 200 and r.json()["user_id"] == "u1"
    assert client.get("/me", headers={"X-Session-Id": r.json()["session_id"]}).status_code == 200


def test_sign_up_waits_for_the_emailed_code(client, neon):
    """With Neon set to require confirmed emails, the account starts once the emailed code is entered."""
    neon.require_confirmed_email = True
    form = {"email": "new@example.com", "password": "goodpass123", "name": "New", "accepted_privacy": "true"}
    r = client.post("/register", data=form)
    assert r.status_code == 200 and r.json()["confirm_email"] is True and "session_id" not in r.json()
    uid = neon.user_by_email("new@example.com")["id"]
    assert store.user_get_by_id(uid)["meta"]["privacy_version"] == settings.PRIVACY_VERSION

    # Signing in first asks for the code again (and sends a new one: Neon doesn't on sign-in).
    neon.codes.clear()
    r = client.post("/login", data={"email": "new@example.com", "password": "goodpass123"})
    assert r.status_code == 403 and r.json()["confirm_email"] is True and "new@example.com" in neon.codes
    assert client.post("/login", data={"email": "new@example.com", "password": "wrongpass1"}).status_code == 401

    r = client.post("/register/confirm", data={"email": "new@example.com", "code": "000000x"})
    assert r.status_code == 400 and "wrong" in r.json()["error"]
    r = client.post("/register/confirm", data={"email": "NEW@example.com", "code": neon.codes["new@example.com"]})
    assert r.status_code == 200, r.text
    me = client.get("/me", headers={"X-Session-Id": r.json()["session_id"]}).json()
    assert me["user_id"] == uid and me["email_verified"] is True and me["name"] == "New"
    assert client.post("/login", data={"email": "new@example.com", "password": "goodpass123"}).status_code == 200


def test_signing_up_again_before_confirming(client, neon):
    neon.require_confirmed_email = True
    form = {"email": "again@example.com", "password": "goodpass123", "accepted_privacy": "true"}
    assert client.post("/register", data=form).json()["confirm_email"] is True
    neon.codes.clear()
    r = client.post("/register", data=form)  # same password: a new code, same account
    assert r.status_code == 200 and r.json()["confirm_email"] is True and "again@example.com" in neon.codes
    r = client.post("/register", data={**form, "password": "otherpass1"})
    assert r.status_code == 400 and "already registered" in r.json()["error"]
    assert len(neon.users) == 1


def test_confirming_needs_a_finished_sign_up(client, neon):
    # A Neon account without a Study AI account: the code alone doesn't make one (no privacy acceptance).
    neon.require_confirmed_email = True
    neon.users["u1"] = {"id": "u1", "email": "half@example.com", "name": "", "emailVerified": False, "password": "goodpass123"}
    neon.codes["half@example.com"] = "123456"
    r = client.post("/register/confirm", data={"email": "half@example.com", "code": "123456"})
    assert r.status_code == 401 and "sign up again" in r.json()["error"]
    assert not neon.sessions


def test_new_code_answer_is_the_same_for_everyone(client, neon):
    neon.require_confirmed_email = True
    client.post("/register", data={"email": "known@example.com", "password": "goodpass123", "accepted_privacy": "true"})
    known = client.post("/register/send_code", data={"email": "known@example.com"})
    unknown = client.post("/register/send_code", data={"email": "nobody@example.com"})
    assert known.status_code == unknown.status_code == 200
    assert known.json()["message"].replace("known", "nobody") == unknown.json()["message"]


def test_login_attempts_limited(client, signup):
    signup("victim@example.com")
    codes = [client.post("/login", data={"email": "victim@example.com", "password": "wrongpass1"}).status_code for _ in range(11)]
    assert codes[:10] == [401] * 10 and codes[10] == 429


def test_logout_ends_session_everywhere(client, user):
    h = user["headers"]
    assert client.get("/me", headers=h).status_code == 200
    assert client.post("/logout", headers=h).status_code == 200
    assert client.get("/me", headers=h).status_code == 401
    assert client.get("/list_tree", headers=h).status_code == 401  # guest-allowed routes too


def test_sign_ins_are_never_mixed_up(client, signup, neon):
    """The server shares one connection to Neon Auth: it must never pass one student's sign-in along with another's."""
    a, b = signup("a@example.com"), signup("b@example.com")
    for _ in range(2):
        assert client.get("/me", headers=a["headers"]).json()["user_id"] == a["user_id"]
        assert client.get("/me", headers=b["headers"]).json()["user_id"] == b["user_id"]
    client.post("/login", data={"email": "a@example.com", "password": "goodpass123"})
    sign_ins = [r for r in neon.requests if r.url.path.endswith(("/sign-in/email", "/sign-up/email"))]
    assert sign_ins and all("cookie" not in r.headers for r in sign_ins)
    assert all(r.headers.get("origin") == "https://cherie-dips.github.io" for r in neon.requests)


def test_odd_session_ids_are_refused_without_asking_neon(client, user, neon):
    before = len(neon.requests)
    for bad in ("x", "abc; __Secure-neon-auth.session_data=forged-value", "a" * 600, "a session id with spaces"):
        assert client.get("/me", headers={"X-Session-Id": bad}).status_code == 401
    assert len(neon.requests) == before


def test_sign_in_service_down_is_a_clear_error(client, user, monkeypatch):
    def down(request):
        raise httpx.ConnectError("no route")

    neon_auth.reset_cache()
    monkeypatch.setattr(neon_auth, "HTTP_CLIENT", neon_auth.new_client(httpx.MockTransport(down)))
    r = client.post("/login", data={"email": user["email"], "password": "goodpass123"})
    assert r.status_code == 503 and "sign-in service" in r.json()["error"]
    assert client.get("/list_tree", headers=user["headers"]).status_code == 503


def rows_mentioning(user_id: str) -> dict[str, int]:
    """Rows anywhere in the database that belong to this user id (should be none after deletion)."""
    counts = {}
    for table in ("folders", "documents", "decks", "cards", "quiz_results",
                  "exams", "usage_daily", "feedback", "onenote_tokens", "onenote_oauth_states"):
        counts[table] = db.scalar(f"SELECT count(*) FROM {table} WHERE user_id = :u", u=user_id)
    counts["users"] = db.scalar("SELECT count(*) FROM users WHERE id = :u", u=user_id)
    if db.table_exists("data_notes"):
        counts["data_notes"] = db.scalar("SELECT count(*) FROM data_notes WHERE metadata_->>'user_id' = :u", u=user_id)
    return {t: n for t, n in counts.items() if n}


def test_change_password_signs_out_other_devices(client, signup):
    u = signup("change@example.com")
    other = client.post("/login", data={"email": "change@example.com", "password": "goodpass123"}).json()
    other_h = {"X-Session-Id": other["session_id"]}
    assert client.get("/me", headers=other_h).status_code == 200
    r = client.post("/account/change_password", data={"current_password": "wrong-pass", "new_password": "newpass1234"}, headers=u["headers"])
    assert r.status_code == 400 and "incorrect" in r.json()["error"]
    r = client.post("/account/change_password", data={"current_password": "goodpass123", "new_password": "newpass1234"}, headers=u["headers"])
    assert r.status_code == 200, r.text
    assert client.get("/me", headers={"X-Session-Id": r.json()["session_id"]}).status_code == 200  # this device
    assert client.get("/me", headers=other_h).status_code == 401
    assert client.post("/login", data={"email": "change@example.com", "password": "newpass1234"}).status_code == 200


def test_delete_account_removes_everything(client, user, upload, neon, file_storage):
    h, uid = user["headers"], user["user_id"]
    upload(h, "notes.txt", b"Some notes about cells and mitochondria. " * 10)
    upload(h, "cells.pdf", pdf_with_text("Mitochondria make energy for the cell."))
    assert len(file_storage.objects) == 1
    r = client.post("/account/delete", data={"password": "wrong-pass"}, headers=h)
    assert r.status_code == 400
    r = client.post("/account/delete", data={"password": "goodpass123"}, headers=h)
    assert r.status_code == 200, r.text
    assert client.get("/me", headers=h).status_code == 401
    assert store.user_get_by_id(uid) is None and neon.user_by_email(user["email"]) is None
    assert rows_mentioning(uid) == {}
    assert file_storage.objects == {}
    r = client.post("/login", data={"email": user["email"], "password": "goodpass123"})
    assert r.status_code == 401


def test_forgot_and_reset_password(client, signup, neon):
    signup("forgot@example.com")
    assert client.get("/config").json()["password_reset_enabled"] is True
    unknown = client.post("/password/forgot", data={"email": "nobody@example.com"})
    known = client.post("/password/forgot", data={"email": "forgot@example.com"})
    assert unknown.status_code == known.status_code == 200
    assert unknown.json() == known.json()  # can't be used to discover accounts
    assert len(neon.reset_links) == 1
    link = neon.reset_links[0]
    assert link["redirectTo"] == settings.FRONTEND_URL + "?reset=1"  # Neon's email leads back here with &token=

    assert client.post("/password/reset", data={"token": link["token"], "new_password": "short"}).status_code == 400
    r = client.post("/password/reset", data={"token": link["token"], "new_password": "brandnewpass1"})
    assert r.status_code == 200, r.text
    r = client.post("/password/reset", data={"token": link["token"], "new_password": "anotherpass1"})
    assert r.status_code == 400 and "expired" in r.json()["error"]  # single use
    assert client.post("/login", data={"email": "forgot@example.com", "password": "brandnewpass1"}).status_code == 200


def test_admins_must_confirm_their_email(client, signup, neon, monkeypatch):
    monkeypatch.setattr(settings, "ADMIN_EMAILS", {"boss@example.com"})
    h = signup("boss@example.com")["headers"]
    # Anyone could sign up with the admin's address, so it doesn't count until confirmed.
    assert client.get("/me", headers=h).json()["is_admin"] is False
    assert client.get("/admin/stats", headers=h).status_code == 403
    assert client.post("/account/verify_email/send", headers=h).status_code == 200
    r = client.post("/account/verify_email", data={"code": "not-it"}, headers=h)
    assert r.status_code == 400 and "wrong" in r.json()["error"]
    assert client.post("/account/verify_email", data={"code": neon.codes["boss@example.com"]}, headers=h).status_code == 200
    me = client.get("/me", headers=h).json()
    assert me["email_verified"] is True and me["is_admin"] is True
    assert client.get("/admin/stats", headers=h).status_code == 200


def test_guests_cannot_store_or_spend(client):
    guest = {"X-Guest-Id": client.get("/guest_id").json()["guest_id"]}
    r = client.post("/upload_note", data={"path": ""}, files={"file": ("a.txt", b"hello")}, headers=guest)
    assert r.status_code == 401
    r = client.post("/query_folder", data={"query": "hi"}, headers=guest)
    assert r.status_code == 401
    assert client.get("/list_tree", headers=guest).json()["tree"] == []
    assert db.scalar("SELECT count(*) FROM folders WHERE user_id LIKE 'guest_%'") == 0
    assert client.get("/list_tree", headers={"X-Guest-Id": "../../weird"}).status_code == 400


def test_tree_survives_signout(client, signup):
    u = signup("persist@example.com")
    client.post("/create_folder", data={"name": "Math"}, headers=u["headers"])
    client.post("/logout", headers=u["headers"])
    again = client.post("/login", data={"email": "persist@example.com", "password": "goodpass123"}).json()
    h = {"X-Session-Id": again["session_id"]}
    assert client.get("/list_tree", headers=h).json()["tree"][0]["name"] == "Math"
    assert tree_paths(client, h) == set()
