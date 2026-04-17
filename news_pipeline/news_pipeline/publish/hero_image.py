from __future__ import annotations

import re
import unicodedata
from pathlib import Path
from typing import Any

import httpx

from news_pipeline.models.queue import QueueItem
from news_pipeline.utils.env import get_env

DEFAULT_HERO_IMAGE = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1200&h=675&auto=format&fit=crop"
PEXELS_SEARCH_URL = "https://api.pexels.com/v1/search"
NEWS_CONTENT_DIR = Path(__file__).resolve().parents[3] / "src" / "content" / "anlikHaber"
CATEGORY_QUERIES = {
    "Teknoloji": [
        "software interface desktop workstation technology",
        "computer screen coding productivity app",
        "abstract technology device screen",
    ],
    "Siyaset": [
        "government building parliament diplomacy",
        "politics diplomacy official building flags",
        "press briefing government office",
    ],
    "Dünya": [
        "international diplomacy world map newsroom",
        "global affairs diplomacy official meeting room",
        "border checkpoint international relations",
    ],
    "Ekonomi": [
        "financial market data charts business desk",
        "economy finance trading screen analytics",
        "business documents finance office charts",
    ],
    "Türkiye": [
        "ankara government turkey skyline",
        "istanbul city skyline turkey",
        "turkey public institution building",
    ],
}
EVENT_PENALTY_TERMS = {
    "conference",
    "event",
    "audience",
    "crowd",
    "stage",
    "speaker",
    "seminar",
    "summit",
    "meeting",
    "workshop",
    "handshake",
    "podium",
    "microphone",
    "people talking",
    "group of people",
}
GENERIC_PENALTY_TERMS = {
    "teamwork",
    "office meeting",
    "collaboration",
    "celebration",
    "networking",
    "presentation",
}
TECH_QUERY_RULES = [
    (["openai", "chatgpt", "codex", "anthropic", "claude", "gemini", "google ai", "ai"], [
        "artificial intelligence interface desktop software",
        "computer screen software workspace ai",
    ]),
    (["chrome", "browser", "tab", "search"], [
        "web browser interface laptop productivity",
        "browser software screen desktop",
    ]),
    (["mac", "macos", "desktop app", "app"], [
        "desktop application interface mac workspace",
        "laptop desk software interface",
    ]),
    (["security", "adobe", "pdf", "vulnerability", "hack"], [
        "cybersecurity computer screen warning",
        "security software laptop dark office",
    ]),
]
POLITICS_QUERY_RULES = [
    (["ukrayna", "ukraine", "rusya", "russia", "iran", "israil", "trump"], [
        "diplomacy flags conflict map government",
        "international relations government building flags",
    ]),
    (["ab", "eu", "avrupa birligi", "nato"], [
        "european union diplomacy flags building",
        "international diplomacy official building",
    ]),
]
ECONOMY_QUERY_RULES = [
    (["funding", "investment", "seed", "valuation", "startup"], [
        "startup finance office analytics laptop",
        "investment data charts business desk",
    ]),
    (["market", "borsa", "stock", "shares", "trading"], [
        "stock market charts trading screen",
        "finance data monitor business",
    ]),
]


def _normalize_text(value: str) -> str:
    normalized = unicodedata.normalize("NFKD", value or "")
    ascii_text = normalized.encode("ascii", "ignore").decode("ascii")
    return re.sub(r"\s+", " ", ascii_text.lower()).strip()


def _build_text_blob(item: QueueItem) -> str:
    parts = [
        item.draft_title,
        item.draft_description,
        " ".join(item.draft_tags),
        " ".join(item.draft_facts[:4]),
    ]
    return _normalize_text(" ".join(part for part in parts if part))


def _queries_from_rules(text: str, rules: list[tuple[list[str], list[str]]]) -> list[str]:
    queries: list[str] = []
    for triggers, candidates in rules:
        if any(trigger in text for trigger in triggers):
            queries.extend(candidates)
    return queries


def _build_queries(item: QueueItem) -> list[str]:
    category = item.draft_category or "Teknoloji"
    text = _build_text_blob(item)
    queries: list[str] = []

    if category == "Teknoloji":
        queries.extend(_queries_from_rules(text, TECH_QUERY_RULES))
    elif category in {"Siyaset", "Dünya", "Türkiye"}:
        queries.extend(_queries_from_rules(text, POLITICS_QUERY_RULES))
    elif category == "Ekonomi":
        queries.extend(_queries_from_rules(text, ECONOMY_QUERY_RULES))

    queries.extend(CATEGORY_QUERIES.get(category, ["news editorial illustration abstract"]))

    seen: set[str] = set()
    deduped: list[str] = []
    for query in queries:
        if query not in seen:
            seen.add(query)
            deduped.append(query)
    return deduped[:3]


def _recent_hero_images(limit: int = 30) -> set[str]:
    if not NEWS_CONTENT_DIR.exists():
        return set()

    files = sorted(
        NEWS_CONTENT_DIR.glob("*.md"),
        key=lambda path: path.stat().st_mtime,
        reverse=True,
    )
    images: set[str] = set()
    pattern = re.compile(r'^heroImage:\s*["\']?(.*?)["\']?\s*$')

    for path in files[:limit]:
        try:
            for line in path.read_text(encoding="utf-8").splitlines():
                match = pattern.match(line.strip())
                if match and match.group(1):
                    images.add(match.group(1).strip())
                    break
        except Exception:
            continue
    return images


def _photo_candidate(photo: dict[str, Any]) -> str | None:
    src = photo.get("src") or {}
    candidate = src.get("landscape") or src.get("large2x") or src.get("large")
    return str(candidate) if candidate else None


def _score_photo(photo: dict[str, Any], query: str, item: QueueItem, recent_images: set[str]) -> tuple[float, str | None]:
    candidate = _photo_candidate(photo)
    if not candidate:
        return float("-inf"), None

    score = 0.0
    text = _normalize_text(
        " ".join(
            [
                str(photo.get("alt") or ""),
                str(photo.get("url") or ""),
                str(query),
                item.draft_title,
                item.draft_description,
                " ".join(item.draft_tags),
            ]
        )
    )

    query_terms = [term for term in _normalize_text(query).split() if len(term) >= 4]
    for term in query_terms:
        if term in text:
            score += 2.0

    item_terms = [term for term in _build_text_blob(item).split() if len(term) >= 5][:10]
    for term in item_terms:
        if term in text:
            score += 1.2

    if item.draft_category == "Teknoloji":
        for term in ["screen", "computer", "laptop", "software", "interface", "desk", "workspace", "keyboard"]:
            if term in text:
                score += 1.8
    if item.draft_category == "Ekonomi":
        for term in ["finance", "chart", "market", "business", "analytics", "trading"]:
            if term in text:
                score += 1.8
    if item.draft_category in {"Siyaset", "Dünya", "Türkiye"}:
        for term in ["government", "parliament", "flag", "building", "diplomacy", "city"]:
            if term in text:
                score += 1.6

    for term in EVENT_PENALTY_TERMS:
        if term in text:
            score -= 4.5
    for term in GENERIC_PENALTY_TERMS:
        if term in text:
            score -= 2.5

    if candidate in recent_images:
        score -= 6.0

    width = int(photo.get("width") or 0)
    height = int(photo.get("height") or 0)
    if width >= 1400:
        score += 0.75
    if width > 0 and height > 0:
        aspect_ratio = width / max(height, 1)
        if 1.55 <= aspect_ratio <= 1.95:
            score += 1.0

    return score, candidate


def _search_photos(client: httpx.Client, api_key: str, query: str) -> list[dict[str, Any]]:
    params = {
        "query": query,
        "per_page": 15,
        "orientation": "landscape",
        "size": "large",
    }
    response = client.get(PEXELS_SEARCH_URL, params=params, headers={"Authorization": api_key})
    response.raise_for_status()
    return list((response.json().get("photos") or []))


def pick_hero_image(item: QueueItem) -> str:
    api_key = get_env("PEXELS_API_KEY")
    if not api_key:
        return DEFAULT_HERO_IMAGE

    recent_images = _recent_hero_images()
    queries = _build_queries(item)

    try:
        best_score = float("-inf")
        best_image: str | None = None
        with httpx.Client(timeout=12.0, follow_redirects=True) as client:
            for query in queries:
                photos = _search_photos(client, api_key, query)
                for photo in photos:
                    score, candidate = _score_photo(photo, query, item, recent_images)
                    if candidate and score > best_score:
                        best_score = score
                        best_image = candidate
                if best_image and best_score >= 3.5:
                    break
        return best_image or DEFAULT_HERO_IMAGE
    except Exception:
        return DEFAULT_HERO_IMAGE
