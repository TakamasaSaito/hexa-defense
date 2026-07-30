#!/usr/bin/env bash
set -euo pipefail

HOST="root@160.251.252.203"
REMOTE_BASE="/var/www/hexa-defense"
REPO_ROOT="$(cd "$(dirname "$0")" && pwd)"

ok()   { echo "[OK]  $*"; }
info() { echo "[...] $*"; }

info "index.html: uploading"
scp "$REPO_ROOT/index.html" "$HOST:$REMOTE_BASE/index.html"
ok "index.html done"

echo ""
echo "Deploy complete: https://hexa.ea-journey.com/"
