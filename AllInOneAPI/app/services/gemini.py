import os
import typing
import httpx

"""Simple helper to call Google's Generative Language (Gemini) API.

This module prefers the official `google.generativeai` client if installed
but falls back to an HTTP request to the REST endpoint using an API key.

Environment variables:
- GEMINI_API_KEY or GOOGLE_API_KEY : API key for the Generative API
- GEMINI_MODEL (optional): model name, default `text-bison-001`

Exports:
- async def generate_text(prompt: str) -> str
"""


API_KEY = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
# default to the beta Gemini model commonly used; allow override with GEMINI_MODEL
MODEL = os.getenv("GEMINI_MODEL") or "gemini-2.5-flash"
# Read your system prompt from .env, with a default fallback
SYSTEM_PROMPT = os.getenv("GEMINI_SYSTEM_PROMPT")


async def generate_text(prompt: str, temperature: float = 0.2, max_output_tokens: int = 512) -> str:
    """Generate a single-text reply using the v1beta generateContent endpoint.

    Uses the same request shape you provided in Postman:
    {"contents": [{"parts": [{"text": prompt}]}]}

    Returns the first candidate's first part text when available.
    """
    if not API_KEY:
        raise RuntimeError("Gemini API key not found in GEMINI_API_KEY or GOOGLE_API_KEY environment variables")

    url = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent"
    headers = {
        "x-goog-api-key": API_KEY,
        "Content-Type": "application/json",
    }

    payload = {
        "contents": [
            {
                "parts": [
                    {"text": prompt}
                ]
            }
        ],
        # optional best-effort mapping of semantics to older parameters
        # the v1beta endpoint may accept tuning params in a different structure; keep minimal by default
    }

    async with httpx.AsyncClient(timeout=30.0) as client:
        r = await client.post(url, headers=headers, json=payload)
        r.raise_for_status()
        j = r.json()

    # Parse candidates[].content.parts[].text per your example
    try:
        if isinstance(j, dict) and "candidates" in j and j["candidates"]:
            cand = j["candidates"][0]
            content = cand.get("content") or {}
            # content may be dict with 'parts' list
            if isinstance(content, dict):
                parts = content.get("parts") or []
                if parts and isinstance(parts[0], dict) and "text" in parts[0]:
                    return parts[0]["text"]
            # sometimes candidate may directly include 'content'->'parts' different nesting
            # try deeper traversal
            if "content" in cand and isinstance(cand["content"], dict):
                parts = cand["content"].get("parts", [])
                if parts and isinstance(parts[0], dict) and "text" in parts[0]:
                    return parts[0]["text"]

        # fallback: try to stringify some known fields
        if isinstance(j, dict):
            if "candidates" in j and j["candidates"]:
                return str(j["candidates"][0].get("content", ""))
            if "output" in j:
                return str(j["output"])

    except Exception:
        # swallow parsing errors and return raw json string as fallback
        pass

    return str(j)
