from __future__ import annotations

import re

import httpx

from news_pipeline.models.queue import QueueItem

DEFAULT_HERO_IMAGE = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1200&h=675&auto=format&fit=crop"
OG_IMAGE_RE = re.compile(r'<meta[^>]+property=["\']og:image["\'][^>]+content=["\']([^"\']+)', re.I)


def pick_hero_image(item: QueueItem) -> str:
    if not item.draft_sources:
        return DEFAULT_HERO_IMAGE

    source_url = str(item.draft_sources[0].url)
    try:
        with httpx.Client(follow_redirects=True, timeout=10.0, headers={"User-Agent": "Mozilla/5.0"}) as client:
            response = client.get(source_url)
            response.raise_for_status()
        match = OG_IMAGE_RE.search(response.text)
        if match:
            return match.group(1)
    except Exception:
        pass

    return DEFAULT_HERO_IMAGE
