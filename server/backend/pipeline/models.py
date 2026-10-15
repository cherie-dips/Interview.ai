"""
The three AI models the pipeline uses, in one place (all through LlamaIndex):

- Search model (EMBED_MODEL): turns each passage and each question into a "meaning fingerprint",
  a list of numbers. Runs on our server, free. Multilingual: Hindi questions find English notes.
- Re-checking model (RERANK_MODEL): reads the question with each candidate passage and scores how
  well the passage answers it, from 0 to 1. Runs on our server, free.
- Language model: writes answers, flashcards, quizzes and summaries. Sarvam AI by default; any
  service with an OpenAI-style chat API can be used instead (LLM_PROVIDER=openai_like), e.g.
  DeepSeek on NVIDIA, DeepInfra or OpenRouter.

To try another model, change the setting (see settings.py) and run the answer-quality test before
and after (scripts/answer_quality.py).
"""
import math
import os
import threading

from backend import settings

# Sarvam's models (https://docs.sarvam.ai). sarvam-30b was retired in 2026.
SARVAM_DEFAULT_MODEL = "sarvam-105b"

# Tests plug in an httpx client with a fake transport here; None = the SDK's own client.
HTTP_CLIENT = None

_lock = threading.Lock()
_embedder = None
_reranker = None
_llms: dict[tuple, object] = {}


# ---------- Search model ----------
def embedder():
    """LlamaIndex embedding model, loaded once per process (loading takes a few seconds)."""
    global _embedder
    if _embedder is None:
        with _lock:
            if _embedder is None:
                from llama_index.embeddings.huggingface import HuggingFaceEmbedding

                # E5 models are trained with these prefixes; other models get none.
                e5 = "e5" in settings.EMBED_MODEL.lower()
                _embedder = HuggingFaceEmbedding(
                    model_name=settings.EMBED_MODEL,
                    query_instruction="query: " if e5 else None,
                    text_instruction="passage: " if e5 else None,
                    normalize=True,
                    embed_batch_size=32,
                )
    return _embedder


def embed_passages(texts: list[str]) -> list[list[float]]:
    """Fingerprints for passages of notes (unit length, so a dot product is cosine similarity)."""
    if not texts:
        return []
    return embedder().get_text_embedding_batch(list(texts))


def embed_question(text: str) -> list[float]:
    return embedder().get_query_embedding(text)


# ---------- Re-checking model ----------
def reranker():
    """LlamaIndex's cross-encoder re-ranker, or None when RERANK_MODEL is empty."""
    global _reranker
    if not settings.RERANK_MODEL:
        return None
    if _reranker is None:
        with _lock:
            if _reranker is None:
                from llama_index.core.postprocessor import SentenceTransformerRerank

                _reranker = SentenceTransformerRerank(model=settings.RERANK_MODEL, top_n=1000)
    return _reranker


def relevance(question: str, texts: list[str]) -> list[float] | None:
    """
    How well each text answers the question, 0..1 (None when re-checking is turned off).
    The model gives a raw score; the logistic function maps it to 0..1 (0.5 = undecided).
    """
    model = reranker()
    if model is None or not texts:
        return None if model is None else []
    from llama_index.core.schema import NodeWithScore, QueryBundle, TextNode

    nodes = [NodeWithScore(node=TextNode(text=t, id_=str(i)), score=0.0) for i, t in enumerate(texts)]
    ranked = model.postprocess_nodes(nodes, query_bundle=QueryBundle(question))
    by_id = {n.node.node_id: float(n.score or 0.0) for n in ranked}
    return [_logistic(by_id.get(str(i), -20.0)) for i in range(len(texts))]


def _logistic(x: float) -> float:
    return 1.0 / (1.0 + math.exp(-max(min(x, 40.0), -40.0)))


def warm_up() -> None:
    """Load the local models now (in the background at start-up) so the first question is fast."""
    embed_question("warm up")
    relevance("warm up", ["warm up"])


# ---------- Language model ----------
def sarvam_api_base() -> str:
    base = (os.getenv("SARVAM_API_BASE") or "").strip().rstrip("/") or "https://api.sarvam.ai"
    return base if base.endswith("/v1") else base + "/v1"


def sarvam_model(purpose: str) -> str:
    """Model for answers ("answer") or for study tools and helpers ("study")."""
    name = "SARVAM_MODEL_RAG" if purpose == "answer" else "SARVAM_MODEL_STUDY"
    return (os.getenv(name) or "").strip() or SARVAM_DEFAULT_MODEL


def llm(purpose: str, max_tokens: int, temperature: float, reasoning: str | None = None, model: str | None = None):
    """
    A LlamaIndex chat model. `reasoning`: None = the model's default, "off" = no thinking (fast,
    cheap: study tools), or low | medium | high (Sarvam's reasoning effort).
    """
    key = (settings.LLM_PROVIDER, purpose, max_tokens, temperature, reasoning, model, id(HTTP_CLIENT))
    with _lock:
        if key in _llms:
            return _llms[key]
    extra = {}
    if reasoning == "off":
        extra["reasoning_effort"] = None  # Sarvam: an explicit null turns reasoning off
    elif reasoning:
        extra["reasoning_effort"] = reasoning
    if settings.LLM_PROVIDER == "openai_like":
        from llama_index.llms.openai_like import OpenAILike

        # Services differ in how thinking is switched off; the request fields come from the settings.
        thinking_off = reasoning == "off" and settings.LLM_THINKING_OFF
        instance = OpenAILike(
            model=model or settings.LLM_MODEL,
            api_base=settings.LLM_API_BASE,
            api_key=settings.LLM_API_KEY,
            is_chat_model=True,
            context_window=128000,
            max_tokens=max_tokens,
            temperature=temperature,
            additional_kwargs={"extra_body": settings.LLM_THINKING_OFF} if thinking_off else {},
            timeout=300.0,
            max_retries=2,
            http_client=HTTP_CLIENT,
        )
    else:
        from llama_index.llms.sarvam import Sarvam

        from backend.ocr import sarvam_api_key

        instance = Sarvam(
            model=model or sarvam_model(purpose),
            api_key=sarvam_api_key() or "",
            api_base=sarvam_api_base(),
            max_tokens=max_tokens,
            temperature=temperature,
            additional_kwargs=extra,
            context_window=128000,
            timeout=300.0,
            max_retries=2,
            http_client=HTTP_CLIENT,
        )
    with _lock:
        _llms[key] = instance
    return instance


def llm_configured() -> bool:
    if settings.LLM_PROVIDER == "openai_like":
        return bool(settings.LLM_API_BASE and settings.LLM_MODEL)
    from backend.ocr import sarvam_api_key

    return bool(sarvam_api_key())


def forget_llms() -> None:
    """Drop cached model clients (tests change settings between cases)."""
    with _lock:
        _llms.clear()
