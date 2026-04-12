from __future__ import annotations

import re

from news_pipeline.models.queue import QueueItem
from news_pipeline.publish.body_template import PLACEHOLDER_BODY_MARKERS, build_body

ENGLISH_MARKERS = {
    " will ",
    " with ",
    " after ",
    " says ",
    " gets ",
    " is ",
    " are ",
    " on ",
    " in ",
    " for ",
    " said ",
    " plans ",
    " exchange ",
    " ministry ",
    " against ",
    " through ",
    " everyone ",
    " talking ",
    " conference ",
    " over ",
    " violations ",
    " clickbait ",
}

TURKISH_MARKERS = {
    " ve ",
    " bir ",
    " için ",
    " ile ",
    " olarak ",
    " olduğunu ",
    " açıkladı ",
    " söyledi ",
    " gündeme ",
    " ateşkes ",
    " ihlali ",
    " konuştu ",
    " savundu ",
    " bildirdi ",
    " başbakanı ",
    " başkanı ",
    " yalnızca ",
    " kutlamak ",
    " kaybetti ",
    " ediliyor ",
}


def has_manual_review(item: QueueItem) -> bool:
    return any(note.startswith("manual-review:") for note in item.notes)


def looks_too_english(text: str) -> bool:
    lowered = f" {text.strip().lower()} "
    hits = sum(1 for marker in ENGLISH_MARKERS if marker in lowered)
    if re.search(r"\bthe\b|\band\b|\bof\b|\bto\b|\bover\b|\beveryone\b", lowered):
        hits += 1
    return hits >= 2


def has_strong_turkish_signal(text: str) -> bool:
    lowered = f" {text.strip().lower()} "
    turkish_hits = sum(1 for marker in TURKISH_MARKERS if marker in lowered)
    if re.search(r"[çğıöşü]", lowered):
        turkish_hits += 1
    if re.search(r"\b\w+(iyor|ıyor|uyor|üyor|di|dı|du|dü|ti|tı|tu|tü|nin|nın|nun|nün|si|sı|su|sü|lari|ları|leri)\b", lowered):
        turkish_hits += 1
    return turkish_hits >= 2


def has_placeholder_body(item: QueueItem) -> bool:
    body = build_body(item)
    return any(marker in body for marker in PLACEHOLDER_BODY_MARKERS)


def is_autopublish_candidate(item: QueueItem, min_score: float = 0.68) -> tuple[bool, str | None]:
    if item.status != "new":
        return False, "status is not new"
    if has_manual_review(item):
        return False, "manual-review item"
    if item.editorial_priority < min_score:
        return False, f"score below threshold ({item.editorial_priority:.3f})"
    if looks_too_english(item.draft_title):
        return False, "title still too english"
    if looks_too_english(item.draft_description):
        return False, "description still too english"
    if not has_strong_turkish_signal(item.draft_title):
        return False, "title lacks strong turkish signal"
    if not has_strong_turkish_signal(item.draft_description):
        return False, "description lacks strong turkish signal"
    if has_placeholder_body(item):
        return False, "body still contains template filler"
    return True, None
