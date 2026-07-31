#!/usr/bin/env bash
set -euo pipefail

HOST="root@160.251.252.203"
REMOTE_BASE="/var/www/hexa-defense"
REPO_ROOT="$(cd "$(dirname "$0")" && pwd)"

ok()   { echo "[OK]  $*"; }
info() { echo "[...] $*"; }

BUILD_DATE="$(date '+%Y-%m-%d')"
TMP_INDEX="$(mktemp /tmp/hexa-index-XXXXXX.html)"

# ソースファイルは書き換えず、一時ファイルにビルド日時を埋め込んでアップロードする
sed "s/<!-- BUILD_DATE -->/ \/ ${BUILD_DATE}/" "$REPO_ROOT/index.html" > "$TMP_INDEX"
trap 'rm -f "$TMP_INDEX"' EXIT

info "index.html: uploading (build: ${BUILD_DATE})"
scp "$TMP_INDEX" "$HOST:$REMOTE_BASE/index.html"
ok "index.html done"

ASSETS=(
  manifest.json
  hexa-favicon.svg
  favicon-32.png
  apple-touch-icon.png
  icon-192.png
  icon-512.png
)

for f in "${ASSETS[@]}"; do
  info "$f: uploading"
  scp "$REPO_ROOT/$f" "$HOST:$REMOTE_BASE/$f"
  ok "$f done"
done

echo ""
echo "Deploy complete: https://hexa.ea-journey.com/ (${BUILD_DATE})"
