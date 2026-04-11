from __future__ import annotations

from pathlib import Path

from news_pipeline.collectors.rss import RssCollector
from news_pipeline.config.loader import load_yaml
from news_pipeline.models.article import RawArticle
from news_pipeline.models.source import SourceConfig
from news_pipeline.storage.json_store import JsonStore
from news_pipeline.utils.logging import get_logger


def collect_command(config_path: str = "news_pipeline/news_pipeline/config/sources.yaml") -> None:
    logger = get_logger()
    root = Path.cwd()
    raw_store = JsonStore(root / "news_pipeline/data/raw", RawArticle)
    config = load_yaml(root / config_path)

    for source_data in config.get("sources", []):
        source = SourceConfig.model_validate(source_data)
        if not source.enabled:
            continue
        if source.kind != "rss":
            logger.info(f"skip {source.id}, only rss collector is wired in v1")
            continue
        collector = RssCollector(source)
        import asyncio
        result = asyncio.run(collector.collect())
        for article in result:
            raw_store.save(f"{source.id}-{hash(str(article.url))}", article)
        logger.info(f"collected {len(result)} raw items from {source.name}")
