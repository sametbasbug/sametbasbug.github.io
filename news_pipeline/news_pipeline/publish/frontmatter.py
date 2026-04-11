from __future__ import annotations

from datetime import UTC, datetime

from news_pipeline.models.queue import QueueItem


def build_frontmatter(item: QueueItem) -> str:
    now = datetime.now(UTC).astimezone().isoformat(timespec="seconds")
    category = item.draft_category or "Teknoloji"
    primary_sources = item.draft_sources[:1]
    all_sources = [*primary_sources, *item.supporting_sources]
    sources = "\n".join(
        [f"  - name: \"{source.name}\"\n    url: \"{source.url}\"" for source in all_sources]
    )
    tags = ", ".join([f'\"{tag}\"' for tag in (item.draft_tags or ["pipeline", "haber"])])
    return f"""---
title: \"{item.draft_title}\"
description: \"{item.draft_description}\"
pubDate: '{now}'
updatedDate: '{now}'
heroImage: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1200&h=675&auto=format&fit=crop"
isDraft: true
tags: [{tags}]
author: "Nyx AI"
category: "{category}"
breaking: false
sources:
{sources if sources else '  []'}
autoGlossaryLinks: true
---
"""
