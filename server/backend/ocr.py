"""
Reading text out of PDFs and photos: Sarvam Vision (Sarvam AI's Document Intelligence) first,
with PyMuPDF (text already inside a PDF, see pages.py) and Tesseract (photos) as free fallbacks.
"""
import io
import json
import logging
import os
import re
import tempfile
import zipfile

logger = logging.getLogger(__name__)


def sarvam_api_key() -> str | None:
    k = os.getenv("SARVAM_API_KEY")
    return k.strip() if k else None


def tesseract_image_text(data: bytes) -> str:
    """Local fallback for photos when Sarvam Vision is unavailable."""
    import pytesseract
    from PIL import Image

    return pytesseract.image_to_string(Image.open(io.BytesIO(data)))


def _prepare_image_for_document_intel(image_bytes: bytes, mime: str) -> tuple[bytes, str]:
    """Document Intelligence accepts PNG/JPEG/PDF; normalize webp/gif to JPEG."""
    m = (mime or "image/jpeg").lower()
    if m in ("image/webp", "image/gif"):
        from io import BytesIO

        from PIL import Image

        im = Image.open(BytesIO(image_bytes)).convert("RGB")
        out = BytesIO()
        im.save(out, format="JPEG", quality=92)
        return out.getvalue(), ".jpg"
    if m == "image/png":
        return image_bytes, ".png"
    return image_bytes, ".jpg"


def _prepare_document_for_document_intel(file_bytes: bytes, mime: str) -> tuple[bytes, str]:
    """Normalize uploads for Sarvam Document Intelligence (image or PDF)."""
    m = (mime or "").lower().strip()
    if m == "application/pdf":
        return file_bytes, ".pdf"
    return _prepare_image_for_document_intel(file_bytes, m or "image/jpeg")


# Sarvam's markdown embeds every figure it finds as a base64 image: often hundreds of KB per page,
# which would flood search with junk passages. Keep a short marker instead.
_INLINE_IMAGE_RES = (
    re.compile(r"!\[[^\]]*\]\(\s*data:[^)]*\)"),
    re.compile(r"<img\b[^>]*\bsrc\s*=\s*[\"']data:[^\"']*[\"'][^>]*>", re.IGNORECASE),
    re.compile(r"data:image/[\w.+-]+;base64,[A-Za-z0-9+/=\s]{64,}"),
)


def strip_inline_images(text: str) -> str:
    for pattern in _INLINE_IMAGE_RES:
        text = pattern.sub("[figure]", text or "")
    return text


def _extract_markdown_from_output_zip(zip_path: str) -> str:
    with zipfile.ZipFile(zip_path, "r") as z:
        names = sorted(z.namelist())
        md_names = [n for n in names if n.lower().endswith(".md")]
        html_names = [n for n in names if n.lower().endswith((".html", ".htm"))]
        pick = (md_names[0] if md_names else None) or (html_names[0] if html_names else None) or (
            names[0] if names else None
        )
        if not pick:
            return ""
        return strip_inline_images(z.read(pick).decode("utf-8", errors="replace")).strip()


def _strings_in(value) -> list[str]:
    if isinstance(value, str):
        return [value]
    if isinstance(value, dict):
        out = []
        for k in ("text", "content", "markdown"):
            if isinstance(value.get(k), str):
                out.append(value[k])
        for v in value.values():
            if isinstance(v, (dict, list)):
                out.extend(_strings_in(v))
        return out
    if isinstance(value, list):
        return [s for v in value for s in _strings_in(v)]
    return []


def _page_texts_from_output_zip(zip_path: str) -> list[str]:
    """Per-page text from metadata/page_NNN.json files in a Document Intelligence output zip ([] if absent)."""
    pages: list[tuple[int, str]] = []
    try:
        with zipfile.ZipFile(zip_path, "r") as z:
            for name in z.namelist():
                m = re.search(r"page_(\d+)\.json$", name)
                if not m:
                    continue
                try:
                    data = json.loads(z.read(name).decode("utf-8", errors="replace"))
                except json.JSONDecodeError:
                    continue
                pages.append((int(m.group(1)), strip_inline_images(" ".join(_strings_in(data)))))
    except zipfile.BadZipFile:
        return []
    return [text for _, text in sorted(pages)]


def _document_intelligence(file_bytes: bytes, mime: str) -> tuple[str | None, str | None]:
    text, err, _pages = _document_intelligence_with_pages(file_bytes, mime)
    return text, err


def _document_intelligence_with_pages(file_bytes: bytes, mime: str) -> tuple[str | None, str | None, list[str]]:
    """
    OCR / layout text via Sarvam Document Intelligence (Sarvam Vision) for a PDF or an image.
    See: https://docs.sarvam.ai/api-reference-docs/api-guides-tutorials/document-intelligence/overview
    """
    key = sarvam_api_key()
    if not key:
        return None, "SARVAM_API_KEY not configured", []
    try:
        from sarvamai import SarvamAI
    except ImportError:
        return None, "sarvamai package not installed (pip install sarvamai)", []

    raw_bytes, suffix = _prepare_document_for_document_intel(file_bytes, mime)
    tmp_file: str | None = None
    tmp_zip: str | None = None
    timeout = float(os.getenv("SARVAM_DOC_INTEL_TIMEOUT", "180"))
    try:
        fd, tmp_file = tempfile.mkstemp(suffix=suffix)
        os.write(fd, raw_bytes)
        os.close(fd)
        client = SarvamAI(api_subscription_key=key, timeout=timeout)
        lang = os.getenv("SARVAM_DOC_INTEL_LANGUAGE", "en-IN").strip()
        job = client.document_intelligence.create_job(language=lang, output_format="md")
        job.upload_file(tmp_file)
        job.start()
        status = job.wait_until_complete(timeout=timeout)
        state = str(getattr(status, "job_state", "") or "")
        if state not in ("Completed", "PartiallyCompleted"):
            return None, f"Document intelligence job state: {state or 'unknown'}", []
        zfd, tmp_zip = tempfile.mkstemp(suffix=".zip")
        os.close(zfd)
        job.download_output(tmp_zip)
        text = _extract_markdown_from_output_zip(tmp_zip)
        if not text:
            return None, "empty document intelligence output", []
        return text, None, _page_texts_from_output_zip(tmp_zip)
    except Exception as e:
        logger.warning("Sarvam document intelligence failed: %s", e)
        return None, str(e), []
    finally:
        for tmp in (tmp_file, tmp_zip):
            if tmp and os.path.isfile(tmp):
                try:
                    os.unlink(tmp)
                except OSError:
                    pass


def transcribe_handwritten_image(image_bytes: bytes, mime: str = "image/jpeg") -> tuple[str | None, str | None]:
    """Sarvam Vision (Document Intelligence) → markdown/plain text from note images."""
    return _document_intelligence(image_bytes, mime or "image/jpeg")


def transcribe_document_bytes(file_bytes: bytes, mime: str = "application/pdf") -> tuple[str | None, str | None]:
    """Sarvam Vision (Document Intelligence) OCR for uploaded PDFs/images."""
    return _document_intelligence(file_bytes, mime)


def transcribe_pdf_with_pages(file_bytes: bytes) -> tuple[str | None, str | None, list[str]]:
    """Like transcribe_document_bytes for a PDF, plus each page's own text (when Sarvam provides it)."""
    return _document_intelligence_with_pages(file_bytes, "application/pdf")

