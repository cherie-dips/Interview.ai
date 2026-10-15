"""
Students' original files (PDFs and photos) in an S3-compatible bucket (Neon Object Storage), so an
uploaded file opens on any device, not only the one it was uploaded from.

The text read from each file stays in Postgres (the documents table), which also records where the
file's original is (documents.original_key). The bucket is private: the website gets a link that
works for a few minutes. Keys are "<user id>/<random id><extension>", so moving or renaming a file
only changes its row, never the stored file.

Off when the bucket settings (AWS_ENDPOINT_URL_S3, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, S3_BUCKET)
aren't set: then only the text is kept. The course library's PDFs are not stored here (they stay in
Supabase).
"""
import logging
import os
import threading
import uuid

from backend import db, settings

logger = logging.getLogger(__name__)

TYPES = {
    ".pdf": "application/pdf",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".gif": "image/gif",
    ".bmp": "image/bmp",
    ".tiff": "image/tiff",
}
LINK_SECONDS = 600
MB = 1024 * 1024

# Tests plug in a fake S3 client here; None = boto3.
CLIENT = None
_client = None
_lock = threading.Lock()


def configured() -> bool:
    return bool(
        settings.FILES_S3_ENDPOINT
        and settings.FILES_S3_BUCKET
        and os.getenv("AWS_ACCESS_KEY_ID")
        and os.getenv("AWS_SECRET_ACCESS_KEY")
    )


def _s3():
    global _client
    if CLIENT is not None:
        return CLIENT
    with _lock:
        if _client is None:
            import boto3
            from botocore.config import Config

            _client = boto3.client(
                "s3",
                endpoint_url=settings.FILES_S3_ENDPOINT,
                region_name=settings.FILES_S3_REGION,
                config=Config(signature_version="s3v4", s3={"addressing_style": "path"}, retries={"max_attempts": 3}),
            )
        return _client


def _stored_mb(user_id: str | None = None) -> float:
    if user_id is None:
        total = db.scalar("SELECT coalesce(sum(original_size), 0) FROM documents")
    else:
        total = db.scalar("SELECT coalesce(sum(original_size), 0) FROM documents WHERE user_id = :u", u=user_id)
    return int(total or 0) / MB


def keep(user_id: str, path: str, name: str, data: bytes) -> str:
    """
    Store the original of an uploaded file whose text is already saved at `path`.
    Returns "" when it was kept (or isn't a PDF/photo), else a short note for the student.
    """
    content_type = TYPES.get(os.path.splitext(name)[1].lower())
    if not content_type or not data or not configured():
        return ""
    size_mb = len(data) / MB
    if _stored_mb(user_id) + size_mb > settings.MAX_STORED_FILES_MB_PER_USER:
        return "The original file wasn't kept: your file storage is full (the text is saved)."
    if _stored_mb() + size_mb > settings.MAX_STORED_FILES_MB_TOTAL:
        logger.warning("File storage is full (MAX_STORED_FILES_MB_TOTAL)")
        return "The original file wasn't kept: file storage is full right now (the text is saved)."
    key = f"{user_id}/{uuid.uuid4().hex}{os.path.splitext(name)[1].lower()}"
    try:
        _s3().put_object(Bucket=settings.FILES_S3_BUCKET, Key=key, Body=data, ContentType=content_type)
    except Exception:
        logger.exception("Couldn't store the original of %s", path)
        return "The original file couldn't be kept (the text is saved)."
    with db.transaction() as conn:
        old = db.scalar(
            "SELECT original_key FROM documents WHERE user_id = :u AND path = :p FOR UPDATE", conn, u=user_id, p=path
        )
        changed = db.execute(
            "UPDATE documents SET original_key = :k, original_type = :t, original_size = :n "
            "WHERE user_id = :u AND path = :p",
            conn,
            u=user_id,
            p=path,
            k=key,
            t=content_type,
            n=len(data),
        )
    remove([old] if changed else [key])  # the replaced original, or the new one if its file is gone
    return ""


def link(user_id: str, path: str) -> dict | None:
    """A short-lived link to the original of a file: {"url", "name", "type"}, or None if there isn't one."""
    if not configured():
        return None
    row = db.one(
        "SELECT original_key, original_type, original_filename FROM documents "
        "WHERE user_id = :u AND path = :p AND original_key <> ''",
        u=user_id,
        p=path,
    )
    if not row:
        return None
    name = row["original_filename"] or os.path.basename(path)
    safe = "".join(c if c.isascii() and c not in '"\\' and c.isprintable() else "_" for c in name)
    url = _s3().generate_presigned_url(
        "get_object",
        Params={
            "Bucket": settings.FILES_S3_BUCKET,
            "Key": row["original_key"],
            "ResponseContentType": row["original_type"],
            "ResponseContentDisposition": f'inline; filename="{safe}"',
        },
        ExpiresIn=LINK_SECONDS,
    )
    return {"url": url, "name": name, "type": row["original_type"]}


def remove(keys: list[str]) -> None:
    """Delete stored originals (best effort: a leftover file only costs storage)."""
    keys = [k for k in keys if k]
    if not keys or not configured():
        return
    for i in range(0, len(keys), 1000):
        batch = keys[i : i + 1000]
        try:
            _s3().delete_objects(
                Bucket=settings.FILES_S3_BUCKET, Delete={"Objects": [{"Key": k} for k in batch], "Quiet": True}
            )
        except Exception:
            logger.exception("Couldn't delete %d stored originals", len(batch))


def remove_user(user_id: str) -> None:
    """Delete every stored original of a user (account deletion)."""
    if not configured() or not user_id:
        return
    keys: list[str] = []
    token = None
    while True:
        kwargs = {"Bucket": settings.FILES_S3_BUCKET, "Prefix": f"{user_id}/"}
        if token:
            kwargs["ContinuationToken"] = token
        page = _s3().list_objects_v2(**kwargs)
        keys += [o["Key"] for o in page.get("Contents", [])]
        if not page.get("IsTruncated"):
            break
        token = page.get("NextContinuationToken")
    remove(keys)
