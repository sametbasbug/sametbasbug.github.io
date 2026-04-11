from __future__ import annotations

import re

from news_pipeline.models.queue import QueueItem

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
}


def has_manual_review(item: QueueItem) -> bool:
    return any(note.startswith("manual-review:") for note in item.notes)


def looks_too_english(text: str) -> bool:
    lowered = f" {text.strip().lower()} "
    hits = sum(1 for marker in ENGLISH_MARKERS if marker in lowered)
    if re.search(r"\bthe\b|\band\b|\bof\b|\bto\b", lowered):
        hits += 1
    return hits >= 2


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
    return True, None
