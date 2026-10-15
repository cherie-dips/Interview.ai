"""
Writing with the language model (the "generation" step of the pipeline), through LlamaIndex:

- answers to questions, from the passages retrieval.py found (whole or streamed word by word);
- rewriting a follow-up question ("explain that more simply") so it can be searched on its own;
- flashcards, multiple-choice quizzes and summaries for the study tools.

Answers use the notes first and label anything added from general knowledge "📖 Beyond notes".
The model is chosen in pipeline/models.py (Sarvam by default).
"""
import json
import logging
import random
import re
import threading
from typing import Any, Iterator

from llama_index.core.llms import ChatMessage

from backend import settings
from backend.pipeline import models
from backend.settings import HISTORY_TURNS, LLM_PROVIDER

logger = logging.getLogger(__name__)

ANSWER_MAX_TOKENS = 4096
HISTORY_CHARS = 1500  # of each earlier message (answers can be long; the gist is enough)

_GROUNDING_STOPWORDS = {
    "about", "after", "again", "also", "among", "another", "because", "before", "being", "between",
    "both", "could", "does", "each", "from", "have", "into", "more", "most", "other", "over", "same",
    "some", "such", "than", "that", "their", "there", "these", "they", "this", "those", "through",
    "under", "using", "very", "what", "when", "where", "which", "while", "with", "would",
}


class GenerationError(Exception):
    """The language model failed; the message is safe to log, not meant for students."""


# ---------- Token counting (for the cost figures on the admin page) ----------
_usage = threading.local()


def _add_usage(prompt_tokens: int, completion_tokens: int) -> None:
    _usage.prompt = getattr(_usage, "prompt", 0) + int(prompt_tokens or 0)
    _usage.completion = getattr(_usage, "completion", 0) + int(completion_tokens or 0)


def estimate_tokens(text: str) -> int:
    """Rough token count (about 4 characters per token) when the API doesn't report usage."""
    return max(1, len(text or "") // 4)


def take_usage() -> dict:
    """AI tokens used by calls made in this thread since the last call (then resets to zero)."""
    out = {"prompt_tokens": getattr(_usage, "prompt", 0), "completion_tokens": getattr(_usage, "completion", 0)}
    _usage.prompt = _usage.completion = 0
    return out


def language_instruction(language: str | None) -> str:
    if not language or language == "English":
        return ""
    return (
        f"Write all of your output in {language}. Keep formulas, code, units and standard technical "
        "terms as they are (English or LaTeX)."
    )


# ---------- Calling the model ----------
_NOT_CONFIGURED = "The language model isn't configured (SARVAM_API_KEY, or LLM_API_BASE and LLM_MODEL)."


def _messages(raw: list[dict[str, str]]) -> list[ChatMessage]:
    return [ChatMessage(role=m["role"], content=m["content"]) for m in raw]


def _retired(error: Exception, model: str | None) -> bool:
    """A model setting that Sarvam has since retired (keep working on the default model)."""
    return (
        LLM_PROVIDER == "sarvam"
        and "deprecated" in str(error).lower()
        and (model or "") != models.SARVAM_DEFAULT_MODEL
    )


def _reported_usage(raw) -> tuple[int, int]:
    """(prompt, completion) tokens the API reported for a reply, 0 when it didn't."""
    used = raw.get("usage") if isinstance(raw, dict) else getattr(raw, "usage", None)
    if isinstance(used, dict):
        return int(used.get("prompt_tokens") or 0), int(used.get("completion_tokens") or 0)
    return int(getattr(used, "prompt_tokens", 0) or 0), int(getattr(used, "completion_tokens", 0) or 0)


def chat(
    messages: list[dict[str, str]],
    purpose: str,
    max_tokens: int,
    temperature: float,
    reasoning: str | None = None,
) -> tuple[str | None, str | None]:
    """One reply from the language model: (text, None) or (None, error message)."""
    if not models.llm_configured():
        return None, _NOT_CONFIGURED
    model = None
    for _attempt in range(2):
        llm = models.llm(purpose, max_tokens, temperature, reasoning, model)
        try:
            reply = llm.chat(_messages(messages))
        except Exception as e:
            if _retired(e, llm.model):
                logger.warning("Model %s is retired (%s); using %s", llm.model, e, models.SARVAM_DEFAULT_MODEL)
                model = models.SARVAM_DEFAULT_MODEL
                continue
            return None, str(e)
        content = (reply.message.content or "").strip()
        prompt_tokens, completion_tokens = _reported_usage(reply.raw)
        _add_usage(
            prompt_tokens or estimate_tokens(json.dumps(messages)),
            completion_tokens or estimate_tokens(content),
        )
        return (content, None) if content else (None, "empty model content")
    return None, "model retired"


# ---------- Answers ----------
SYSTEM_PROMPT = (
    "You are a brilliant subject-matter tutor helping a student prepare for exams.\n\n"
    "GROUNDING RULES:\n"
    "- The student's notes are your PRIMARY source of truth.\n"
    "- Identify the subject/topic from the notes (e.g. Machine Learning, Linear Algebra, Operating Systems).\n"
    "- ALWAYS answer the student's question — never refuse or say 'not in notes'.\n"
    "- When the notes contain the answer, cite specific details from them.\n"
    "- Excerpts marked (main source) come from files the student marked as most reliable; prefer them.\n"
    "- When the notes are incomplete, supplement with correct, textbook-level knowledge for THAT subject.\n"
    "  Mark such additions with '📖 Beyond notes:' so the student knows.\n"
    "- NEVER drift to unrelated subjects. If asked about something outside the course scope, "
    "  briefly redirect: 'That's outside [subject]. Here's what your notes cover instead…'\n\n"
    "TEACHING STYLE:\n"
    "- Explain like a great tutor: clear, concise, with examples.\n"
    "- For problem-solving: show step-by-step working.\n"
    "- For tricky exam practice: generate 5-8 challenging questions with concise answer keys.\n"
    "- Use Markdown: bullet points, short paragraphs, tables when useful.\n"
    "- Write math in LaTeX: $...$ inline and $$...$$ for display equations.\n"
    "- Do not claim inability to access files or notes.\n"
    "- Earlier messages of the conversation are given for context; the notes excerpts belong to the latest question."
)


def clean_history(history: list[dict] | None) -> list[dict[str, str]]:
    """
    The last HISTORY_TURNS messages as alternating user/assistant turns, starting with the student
    and ending with an answer (the new question follows). Long messages are shortened.
    """
    turns: list[dict[str, str]] = []
    for m in (history or [])[-HISTORY_TURNS * 2:]:
        if not isinstance(m, dict):
            continue
        role = "assistant" if m.get("role") in ("assistant", "ai", "bot") else "user"
        content = str(m.get("content") or m.get("text") or "").strip()[:HISTORY_CHARS]
        if not content:
            continue
        if turns and turns[-1]["role"] == role:
            turns[-1]["content"] += "\n\n" + content
        else:
            turns.append({"role": role, "content": content})
    while turns and turns[0]["role"] != "user":
        turns.pop(0)
    while turns and turns[-1]["role"] != "assistant":
        turns.pop()
    return turns[-HISTORY_TURNS:]


def answer_messages(
    question: str, context: str, language: str = "English", history: list[dict] | None = None
) -> list[dict[str, str]]:
    lang = language_instruction(language)
    system = SYSTEM_PROMPT + ("\n- " + lang if lang else "")
    final = {
        "role": "user",
        "content": (
            f"**Student's question:** {(question or '').strip()}\n\n"
            f"**Notes excerpts:**\n{(context or '').strip()[:60000]}\n\n"
            "Answer the question fully. Use notes evidence first, then subject knowledge if needed."
        ),
    }
    return [{"role": "system", "content": system}, *clean_history(history), final]


def _answer_reasoning() -> str | None:
    return None if settings.ANSWER_THINKING else "off"


def answer(
    question: str, context: str, language: str = "English", history: list[dict] | None = None
) -> tuple[str | None, str | None]:
    """The whole answer at once: (text, None) or (None, error)."""
    if not (question or "").strip():
        return None, "Empty query"
    return chat(
        answer_messages(question, context, language, history), "answer", ANSWER_MAX_TOKENS, 0.3, _answer_reasoning()
    )


def answer_stream(
    question: str, context: str, language: str = "English", history: list[dict] | None = None
) -> Iterator[str]:
    """The answer piece by piece as the model writes it. Raises GenerationError if the request fails."""
    if not models.llm_configured():
        raise GenerationError(_NOT_CONFIGURED)
    llm = models.llm("answer", ANSWER_MAX_TOKENS, 0.3, _answer_reasoning())
    try:
        for chunk in llm.stream_chat(_messages(answer_messages(question, context, language, history))):
            if chunk.delta:
                yield chunk.delta
    except GenerationError:
        raise
    except Exception as e:
        raise GenerationError(str(e)) from e


# ---------- Follow-up questions ----------
CONDENSE_PROMPT = (
    "Rewrite the student's latest message as one question that can be understood without the "
    "conversation, so it can be searched for in their notes: replace words like 'it', 'that' or "
    "'the second one' with what they refer to. Keep the student's language and wording. If the "
    "message already stands on its own, return it unchanged. Reply with the question only.\n\n"
    "Conversation:\n{conversation}\n\nLatest message: {question}"
)


def standalone_question(question: str, history: list[dict] | None) -> str:
    """The question rewritten to stand on its own (unchanged when there is no earlier conversation)."""
    turns = clean_history(history)
    if not turns or not (question or "").strip():
        return question
    conversation = "\n".join(
        f"{'Student' if t['role'] == 'user' else 'Tutor'}: {t['content'][:600]}" for t in turns
    )
    text, err = chat(
        [{"role": "user", "content": CONDENSE_PROMPT.format(conversation=conversation, question=question.strip())}],
        "study",
        max_tokens=300,
        temperature=0.0,
        reasoning="off",
    )
    if err or not text:
        logger.info("Couldn't rewrite a follow-up question (%s); searching with it as asked", err)
        return question
    text = text.strip().strip('"').strip()
    return text if 0 < len(text) <= 1000 else question


# ---------- Study tools ----------
_STUDY_REASONING = "off"  # flashcards, quizzes and summaries don't need the model's long reasoning


# Models often write LaTeX inside JSON strings with single backslashes: "\cdot" is an invalid JSON
# escape (the whole reply fails to parse), and "\frac" / "\theta" / "\neq" parse silently as a form
# feed / tab / newline. A backslash followed by two or more lowercase letters is a LaTeX command (a
# real line break is "\n" before a capital, digit or space), so it is escaped before parsing.
_LATEX_COMMAND = re.compile(r"(?<!\\)\\(?=[a-z]{2,})")
_BAD_JSON_ESCAPE = re.compile(r'(?<!\\)\\(?![\\"/bfnrtu])')


def _repair_latex_escapes(raw: str) -> str:
    return _BAD_JSON_ESCAPE.sub(r"\\\\", _LATEX_COMMAND.sub(r"\\\\", raw))


def _parse_json_loose(raw: str) -> Any:
    raw = raw.strip()
    raw = re.sub(r"^```(?:json)?\s*", "", raw)
    raw = re.sub(r"\s*```\s*$", "", raw)
    return json.loads(_repair_latex_escapes(raw))


def _tokens(text: str) -> list[str]:
    """Words of 3+ characters in any script (math/CS terms like "ref", "rref"; Hindi words too)."""
    words = (w.strip(".,;:!?()[]{}<>\"'`*_#|-–—«»“”‘’।") for w in (text or "").lower().split())
    return [w for w in words if len(w) >= 3 and not w.isdigit() and w not in _GROUNDING_STOPWORDS]


def _primary_body_from_study_ctx(ctx: str) -> str:
    marker = "--- PRIMARY FILE CONTENT ---"
    i = (ctx or "").find(marker)
    if i >= 0:
        return (ctx[i + len(marker) :]).lstrip()
    return ctx or ""


def _context_keywords(context: str) -> set[str]:
    toks = _tokens(context)
    if not toks:
        return set()
    freq: dict[str, int] = {}
    for t in toks:
        freq[t] = freq.get(t, 0) + 1
    ranked = sorted(freq.items(), key=lambda kv: (-kv[1], -len(kv[0]), kv[0]))
    return {k for k, _v in ranked[:250]}


def _validate_flashcards_smart(items: Any, n: int) -> list[dict[str, str]] | None:
    """Accept flashcards with valid front/back; no verbatim evidence requirement."""
    if not isinstance(items, list):
        return None
    cleaned: list[dict[str, str]] = []
    for it in items:
        if len(cleaned) >= n:
            break
        if not isinstance(it, dict):
            continue
        front = str(it.get("front") or "").strip()
        back = str(it.get("back") or "").strip()
        if len(front) < 5 or len(back) < 5:
            continue
        source = str(it.get("source") or "notes").strip()
        cleaned.append({"front": front, "back": back, "source": source})
    return cleaned if len(cleaned) >= 1 else None


def _validate_mcq_smart(items: Any, n: int) -> list[dict[str, Any]] | None:
    """Accept MCQs with valid structure; no verbatim evidence requirement."""
    if not isinstance(items, list):
        return None
    cleaned: list[dict[str, Any]] = []
    for it in items:
        if len(cleaned) >= n:
            break
        if not isinstance(it, dict):
            continue
        q = str(it.get("question") or "").strip()
        opts = it.get("options")
        ai = it.get("answer_index")
        if not q or not isinstance(opts, list) or len(opts) != 4:
            continue
        try:
            ai_i = int(ai)
        except Exception:
            continue
        if ai_i < 0 or ai_i > 3:
            continue
        norm_opts = [str(x or "").strip() for x in opts]
        if any(not o for o in norm_opts):
            continue
        source = str(it.get("source") or "notes").strip()
        explanation = str(it.get("explanation") or "").strip()
        order = list(range(4))
        random.shuffle(order)
        cleaned.append({
            "question": q,
            "options": [norm_opts[i] for i in order],
            "answer_index": order.index(ai_i),
            "explanation": explanation,
            "source": source,
        })
    return cleaned if len(cleaned) >= 1 else None


def _coerce_study_list(parsed: Any) -> list | None:
    if isinstance(parsed, list):
        return parsed
    if isinstance(parsed, dict):
        for k in ("items", "flashcards", "cards", "mcq", "mcqs", "questions", "data", "results"):
            v = parsed.get(k)
            if isinstance(v, list):
                return v
    return None


def study_items(context: str, task: str, n: int, language: str = "English") -> tuple[Any, str | None]:
    ctx = context[:60000]
    body = _primary_body_from_study_ctx(ctx)
    keywords = _context_keywords(body or ctx)
    if len(keywords) < 4:
        return None, "Not enough usable note content for study generation."

    if task == "flashcards":
        prompt = (
            f"You are generating exam-preparation flashcards for a student.\n\n"
            f"RULES:\n"
            f"1. Generate EXACTLY {n} flashcards.\n"
            f"2. PRIMARY SOURCE: the notes below. Most cards (~70%) should test concepts directly from the notes.\n"
            f"3. EXTENDED SOURCE: for the remaining ~30%, create cards on closely related concepts from the SAME subject "
            f"   that a student should know for exam preparation — but NEVER drift to unrelated subjects.\n"
            f"4. Mix difficulty: include definitions, conceptual 'why' questions, tricky edge-case cards, "
            f"   and application/problem-solving cards.\n"
            f"5. 'front' = question or prompt. 'back' = concise, correct answer.\n"
            f"6. 'source' = 'notes' if from the notes, 'subject_knowledge' if extended.\n"
            f"7. Write math in LaTeX ($...$). Output ONLY a JSON array. No markdown fence, no extra text.\n"
            f"   Each object: {{\"front\": str, \"back\": str, \"source\": str}}\n\n"
            f"Notes:\n{ctx}"
        )
    else:
        prompt = (
            f"You are generating challenging exam-style MCQs for a student.\n\n"
            f"RULES:\n"
            f"1. Generate EXACTLY {n} MCQs.\n"
            f"2. PRIMARY SOURCE: the notes below. Most questions (~70%) should test concepts directly from the notes.\n"
            f"3. EXTENDED SOURCE: for the remaining ~30%, create questions on closely related concepts from the SAME subject "
            f"   that commonly appear in exams — but NEVER drift to unrelated subjects.\n"
            f"4. Mix difficulty: include recall, application, analysis, and tricky 'gotcha' questions.\n"
            f"5. Each question must have exactly 4 plausible options. Distractors should be realistic, not obviously wrong.\n"
            f"6. 'explanation' = one or two sentences on why the correct option is right (and the tempting wrong one is wrong).\n"
            f"7. 'source' = 'notes' if from the notes, 'subject_knowledge' if extended.\n"
            f"8. Write math in LaTeX ($...$). Output ONLY a JSON array. No markdown fence, no extra text.\n"
            f"   Each object: {{\"question\": str, \"options\": [str,str,str,str], \"answer_index\": 0-3, \"explanation\": str, \"source\": str}}\n\n"
            f"Notes:\n{ctx}"
        )

    lang = language_instruction(language)
    if lang:
        prompt = prompt.replace("\n\nNotes:\n", f"\n\n{lang} JSON keys stay in English.\n\nNotes:\n", 1)
    label = "flashcards" if task == "flashcards" else "MCQs"
    last_err = "generation failed"
    for k in range(3):
        msg = prompt if k == 0 else (prompt + "\n\nPrevious output had formatting issues. Regenerate valid JSON strictly following the schema.")
        raw, err = chat([{"role": "user", "content": msg}], "study", 8192, 0.4, _STUDY_REASONING)
        if err:
            last_err = err
            continue
        if not raw:
            last_err = "empty model output"
            continue
        try:
            parsed = _parse_json_loose(raw)
            coerced = _coerce_study_list(parsed)
            if coerced is None:
                last_err = "Model returned JSON but not a list of study items."
                continue
            if task == "flashcards":
                valid = _validate_flashcards_smart(coerced, n)
            else:
                valid = _validate_mcq_smart(coerced, n)
            if valid is not None and len(valid) >= 1:
                return valid, None
            last_err = "Model output did not match expected schema."
        except json.JSONDecodeError as e:
            last_err = f"invalid JSON: {e}"

    # Never invent study items ourselves: a wrong "answer key" is worse than a clear error.
    logger.warning("Study generation (%s) failed after retries: %s", task, last_err)
    return None, f"The AI couldn't generate {label} right now. Please try again."


def summary(context: str, language: str = "English") -> tuple[str | None, str | None]:
    """Generate a concise 100-150 word summary covering all key topics from the notes."""
    ctx = (context or "").strip()[:60000]
    body = _primary_body_from_study_ctx(ctx)
    keywords = _context_keywords(body or ctx)
    if len(keywords) < 4:
        return None, "Not enough usable note content for summary generation."

    prompt = (
        "You are a study assistant. Read the student's notes below and write a SINGLE, "
        "concise summary of 100-150 words.\n\n"
        "RULES:\n"
        "1. Cover ALL major topics, definitions, formulas, and key takeaways from the notes.\n"
        "2. Use the same terminology as the notes.\n"
        "3. Structure: start with the overarching topic, then list key concepts in logical order.\n"
        "4. Do NOT add content from outside the notes — summarize only what is provided.\n"
        "5. Write in plain text paragraphs (no bullet points, no JSON, no markdown headers).\n"
        "6. Aim for exactly 100-150 words. Be dense and information-rich.\n"
        f"{language_instruction(language)}\n\n"
        f"Notes:\n{ctx}"
    )

    last_err = "generation failed"
    for k in range(2):
        msg = prompt if k == 0 else (prompt + "\n\nPrevious output was too long or formatted incorrectly. Write 100-150 words of plain text only.")
        raw, err = chat([{"role": "user", "content": msg}], "study", 4096, 0.2, _STUDY_REASONING)
        if err:
            last_err = err
            continue
        if not raw:
            last_err = "empty model output"
            continue
        text = raw.strip()
        text = re.sub(r"^```(?:text)?\s*", "", text)
        text = re.sub(r"\s*```\s*$", "", text)
        if len(text) >= 40:
            return text, None
        last_err = "summary too short"

    logger.warning("Summary generation failed after retries: %s", last_err)
    return None, "The AI couldn't write a summary right now. Please try again."


