"""
The notes pipeline, built on LlamaIndex with Postgres (pgvector) as its store:

    models.py      the search model, the re-checking model and the language model
    indexing.py    text → passages → meaning fingerprints → Postgres (with a keyword index)
    retrieval.py   question → keyword + meaning search in each place → re-check → best passages
    generation.py  passages + question → answer (or flashcards, quizzes, summaries)

Reading text out of PDFs and photos happens before this, in backend/ocr.py.
"""
