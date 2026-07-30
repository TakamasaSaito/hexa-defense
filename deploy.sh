#!/usr/bin/env bash
set -euo pipefail

HOST="root@160.251.252.203"
REMOTE_BASE="/var/www/hexa-defense"
REPO_ROOT="$(cd "$(dirname "$0")" && pwd)"

ok()   { echo "[OK]  $*"; }
info() { echo "[...] $*"; }

FILES=(
  index.html
  manifest.json
  hexa-favicon.svg
  favicon-32.png
  apple-touch-icon.png
  icon-192.png
  icon-512.png
)

for f in "${FILES[@]}"; do
  info "$f: uploading"
  scp "$REPO_ROOT/$f" "$HOST:$REMOTE_BASE/$f"
  ok "$f done"
done

echo ""
echo "Deploy complete: https://hexa.ea-journey.com/"
