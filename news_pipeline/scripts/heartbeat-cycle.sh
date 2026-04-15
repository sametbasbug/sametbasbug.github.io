#!/usr/bin/env bash
set -euo pipefail

ROOT="/Volumes/KIOXIA/blog-project"
cd "$ROOT"

source news_pipeline/.venv/bin/activate

news-pipeline collect >/tmp/news-pipeline-collect.log 2>&1 || cat /tmp/news-pipeline-collect.log
news-pipeline process >/tmp/news-pipeline-process.log 2>&1 || cat /tmp/news-pipeline-process.log

echo "--- HEARTBEAT SUMMARY ---"
news-pipeline queue summary || true

echo "--- AUTOPUBLISH ---"
echo "disabled: direct autopublish is off, waiting for Asteria editorial gate"

echo "--- MANUAL REVIEW ---"
news-pipeline queue review | sed -n '1,5p' || true

echo "--- STRONG NEW ---"
news-pipeline queue list --status new | sed -n '1,8p' || true

if [ "${RUN_ASTERIA_GATE:-1}" = "1" ]; then
  bash news_pipeline/scripts/asteria-editorial-gate.sh || true
else
  echo "--- ASTERIA EDITORIAL GATE ---"
  echo "skipped: RUN_ASTERIA_GATE=${RUN_ASTERIA_GATE:-0}"
fi
