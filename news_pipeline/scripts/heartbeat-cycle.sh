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
autopublish_output="$(news-pipeline autopublish --limit 1 --min-score 0.68 || true)"
printf '%s\n' "$autopublish_output"

autopublished_paths=()
while IFS= read -r line; do
  [ -n "$line" ] && autopublished_paths+=("$line")
done <<EOF
$(printf '%s\n' "$autopublish_output" | sed -n 's/^autopublished: .* -> \(\/.*\.md\)$/\1/p')
EOF
if [ "${#autopublished_paths[@]}" -gt 0 ]; then
  echo "--- GIT PUSH ---"
  bash news_pipeline/scripts/push-autopublished.sh "${autopublished_paths[@]}"
fi

echo "--- MANUAL REVIEW ---"
news-pipeline queue review | sed -n '1,5p' || true

echo "--- STRONG NEW ---"
news-pipeline queue list --status new | sed -n '1,8p' || true
