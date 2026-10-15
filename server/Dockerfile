FROM python:3.11-slim

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    HF_HOME=/opt/hf-cache \
    PORT=7860

RUN apt-get update \
    && apt-get install -y --no-install-recommends tesseract-ocr \
    && rm -rf /var/lib/apt/lists/*

# Hugging Face Spaces run containers as uid 1000.
RUN useradd --create-home --uid 1000 user

WORKDIR /app

# CPU-only torch first: the default wheel bundles ~2 GB of GPU libraries the server can't use.
RUN pip install --index-url https://download.pytorch.org/whl/cpu torch==2.8.0

COPY requirements.txt .
RUN pip install -r requirements.txt

# Download the search model and the re-checking model during the build (see backend/pipeline/models.py),
# so the server never downloads at run time and the first question after a restart is fast.
RUN mkdir -p "$HF_HOME" \
    && python -c "from sentence_transformers import CrossEncoder, SentenceTransformer; \
SentenceTransformer('intfloat/multilingual-e5-small'); CrossEncoder('cross-encoder/mmarco-mMiniLMv2-L12-H384-v1')" \
    && chown -R user:user "$HF_HOME"
ENV HF_HUB_OFFLINE=1 \
    TOKENIZERS_PARALLELISM=false

COPY --chown=user:user backend ./backend

USER user

EXPOSE 7860

HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
    CMD python -c "import os, urllib.request; urllib.request.urlopen('http://127.0.0.1:%s/health' % os.environ.get('PORT', '7860'), timeout=4)" || exit 1

# One worker: upload jobs, the chat-upload cache, request limits and per-user locks live in process memory.
CMD ["sh", "-c", "exec uvicorn backend.api:app --host 0.0.0.0 --port ${PORT:-7860} --workers 1"]
