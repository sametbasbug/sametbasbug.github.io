from __future__ import annotations

from pathlib import Path

from slugify import slugify

from news_pipeline.models.queue import QueueItem
from news_pipeline.publish.body_template import build_body
from news_pipeline.publish.frontmatter import build_frontmatter


def write_draft(content_root: Path, item: QueueItem) -> Path:
    content_root.mkdir(parents=True, exist_ok=True)
    slug = slugify(item.draft_title, lowercase=True)
    path = content_root / f"{slug}.md"
    body = build_body(item)
    path.write_text(f"{build_frontmatter(item)}\n{body}\n", encoding="utf-8")
    return path
