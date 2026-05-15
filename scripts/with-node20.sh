#!/usr/bin/env bash
set -euo pipefail

export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
if [[ ! -s "$NVM_DIR/nvm.sh" ]]; then
  echo "[error] nvm not found at $NVM_DIR/nvm.sh"
  echo "Install nvm from https://github.com/nvm-sh/nvm and retry."
  exit 1
fi

# shellcheck source=/dev/null
. "$NVM_DIR/nvm.sh"

if ! nvm version 20 >/dev/null 2>&1; then
  echo "[info] Installing Node 20 via nvm..."
  nvm install 20 >/dev/null
fi

nvm exec 20 npx cap "$@"
