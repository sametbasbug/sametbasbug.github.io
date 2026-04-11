from __future__ import annotations

from news_pipeline.models.queue import DraftSource, QueueItem

SOURCE_NAME_WEIGHTS = {
    "Politico Europe": 0.90,
    "BBC World": 0.86,
    "TechCrunch": 0.84,
}


def source_weight(source: DraftSource) -> float:
    return SOURCE_NAME_WEIGHTS.get(source.name, 0.70)


def rebalance_sources(item: QueueItem) -> QueueItem:
    combined = [*item.draft_sources, *item.supporting_sources]
    deduped: list[DraftSource] = []
    seen_urls: set[str] = set()
    seen_names: set[str] = set()
    for source in combined:
        url = str(source.url)
        if url in seen_urls:
            continue
        seen_urls.add(url)
        deduped.append(source)

    if not deduped:
        item.draft_sources = []
        item.supporting_sources = []
        return item

    ordered = sorted(deduped, key=source_weight, reverse=True)
    primary = ordered[0]
    seen_names.add(primary.name)

    supporting: list[DraftSource] = []
    for source in ordered[1:]:
        if source.name in seen_names:
            continue
        supporting.append(source)
        seen_names.add(source.name)
        if len(supporting) >= 4:
            break

    item.draft_sources = [primary]
    item.supporting_sources = supporting
    return item
