"""Uploaded PDFs and photos are kept (in Neon Object Storage) so they open on any device."""
from backend import settings
from test_files import pdf_with_text


def _original(client, h, path):
    return client.get("/file_original", params={"path": path}, headers=h)


def test_uploaded_pdf_opens_from_any_device(client, user, upload, file_storage):
    h, uid = user["headers"], user["user_id"]
    client.post("/create_folder", data={"name": "Physics"}, headers=h)
    pdf = pdf_with_text("Newton's second law: F = ma.")
    upload(h, "newton.pdf", pdf, folder="Physics")
    [key] = file_storage.objects
    assert key.startswith(f"{uid}/") and key.endswith(".pdf")  # not named after the file: moves don't touch it

    r = _original(client, h, "Physics/newton.pdf")
    assert r.status_code == 200, r.text
    assert r.json()["name"] == "newton.pdf" and r.json()["type"] == "application/pdf"
    stored = file_storage.get(r.json()["url"])
    assert stored["body"] == pdf
    assert stored["params"]["ResponseContentDisposition"] == 'inline; filename="newton.pdf"'


def test_originals_follow_moves_and_go_with_deletes(client, user, upload, file_storage):
    h = user["headers"]
    for name in ("Physics", "Archive"):
        client.post("/create_folder", data={"name": name}, headers=h)
    upload(h, "a.pdf", pdf_with_text("Kinematics."), folder="Physics")
    upload(h, "b.pdf", pdf_with_text("Dynamics."), folder="Physics")
    client.post("/rename_path", data={"path": "Physics/a.pdf", "new_name": "kinematics.pdf"}, headers=h)
    client.post("/move_path", data={"from_path": "Physics", "to_folder": "Archive"}, headers=h)
    assert _original(client, h, "Archive/Physics/kinematics.pdf").status_code == 200
    assert len(file_storage.objects) == 2

    # Editing the text keeps the original; uploading the same name again replaces it.
    client.post("/file_text", data={"path": "Archive/Physics/kinematics.pdf", "text": "Fixed text."}, headers=h)
    assert _original(client, h, "Archive/Physics/kinematics.pdf").status_code == 200
    upload(h, "b.pdf", pdf_with_text("Dynamics, second version."), folder="Archive/Physics")
    assert len(file_storage.objects) == 2

    client.post("/delete_path", data={"path": "Archive/Physics/kinematics.pdf", "kind": "file"}, headers=h)
    assert len(file_storage.objects) == 1
    client.post("/delete_path", data={"path": "Archive", "kind": "folder"}, headers=h)
    assert file_storage.objects == {}


def test_only_pdfs_and_photos_are_kept(client, user, upload, file_storage):
    h = user["headers"]
    upload(h, "notes.md", b"# Notes\nForce equals mass times acceleration. " * 5)
    assert file_storage.objects == {}
    assert _original(client, h, "notes.md").status_code == 404


def test_storage_limit_keeps_the_text(client, user, upload, file_storage, monkeypatch):
    monkeypatch.setattr(settings, "MAX_STORED_FILES_MB_PER_USER", 0.0001)
    job = upload(user["headers"], "big.pdf", pdf_with_text("Thermodynamics: energy is conserved."))
    assert "storage is full" in job["message"] and "text is saved" in job["message"]
    assert file_storage.objects == {}
    assert "Thermodynamics" in client.get("/file_text", params={"path": "big.pdf"}, headers=user["headers"]).json()["text"]


def test_without_file_storage_only_text_is_kept(client, user, upload):
    upload(user["headers"], "a.pdf", pdf_with_text("Optics."))
    assert _original(client, user["headers"], "a.pdf").status_code == 404


def test_students_cannot_open_each_others_originals(client, signup, upload, file_storage):
    a, b = signup(), signup()
    upload(a["headers"], "private.pdf", pdf_with_text("My own notes."))
    assert _original(client, b["headers"], "private.pdf").status_code == 404
    assert _original(client, {"X-Guest-Id": client.get("/guest_id").json()["guest_id"]}, "private.pdf").status_code == 401
