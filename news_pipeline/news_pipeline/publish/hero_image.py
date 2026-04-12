from __future__ import annotations

from typing import Any

import httpx

from news_pipeline.models.queue import QueueItem
from news_pipeline.utils.env import get_env

DEFAULT_HERO_IMAGE = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1200&h=675&auto=format&fit=crop"
PEXELS_SEARCH_URL = "https://api.pexels.com/v1/search"
CATEGORY_QUERIES = {
    "Teknoloji": "technology conference ai software abstract",
    "Siyaset": "government diplomacy flags parliament",
    "Dünya": "world diplomacy international news",
    "Ekonomi": "finance market charts business",
    "Türkiye": "ankara istanbul skyline turkey",
}


def _build_query(item: QueueItem) -> str:
    category = item.draft_category or "Teknoloji"
    base_query = CATEGORY_QUERIES.get(category, "news editorial abstract")
    title = item.draft_title.lower()

    if any(term in title for term in ["anthropic", "claude", "openai", "chatgpt", "ai"]):
        return "artificial intelligence conference technology"
    if any(term in title for term in ["ukrayna", "russia", "rusya", "iran", "trump"]):
        return "diplomacy flags international conflict"
    if "ekonomi" in title or "market" in title:
        return "financial charts business economy"
    return base_query


def _pick_photo(data: dict[str, Any]) -> str | None:
    photos = data.get("photos") or []
    for photo in photos:
        src = photo.get("src") or {}
        candidate = src.get("landscape") or src.get("large2x") or src.get("large")
        if candidate:
            return str(candidate)
    return None


def pick_hero_image(item: QueueItem) -> str:
    api_key = get_env("PEXELS_API_KEY")
    if not api_key:
        return DEFAULT_HERO_IMAGE

    params = {
        "query": _build_query(item),
        "per_page": 8,
        "orientation": "landscape",
        "size": "large",
    }

    try:
        with httpx.Client(timeout=12.0, follow_redirects=True) as client:
            response = client.get(PEXELS_SEARCH_URL, params=params, headers={"Authorization": api_key})
            response.raise_for_status()
        image = _pick_photo(response.json())
        return image or DEFAULT_HERO_IMAGE
    except Exception:
        return DEFAULT_HERO_IMAGE
