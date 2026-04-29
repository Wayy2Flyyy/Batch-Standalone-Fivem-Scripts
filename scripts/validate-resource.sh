#!/usr/bin/env bash
set -euo pipefail

required_files=(
  "fxmanifest.lua"
  "config/settings.lua"
  "client/main.lua"
  "server/main.lua"
  "web/index.html"
  "web/style.css"
  "web/app.js"
)

for file in "${required_files[@]}"; do
  if [[ ! -f "$file" ]]; then
    echo "Missing required file: $file" >&2
    exit 1
  fi
done

manifest_entries=(
  "ui_page 'web/index.html'"
  "'config/settings.lua'"
  "'client/main.lua'"
  "'server/main.lua'"
  "'web/index.html'"
  "'web/style.css'"
  "'web/app.js'"
)

for entry in "${manifest_entries[@]}"; do
  if ! grep -Fq "$entry" fxmanifest.lua; then
    echo "fxmanifest.lua is missing entry: $entry" >&2
    exit 1
  fi
done

if ! grep -Fq "RegisterNUICallback('close'" client/main.lua; then
  echo "client/main.lua is missing the close NUI callback" >&2
  exit 1
fi

if ! grep -Fq "postNui('close')" web/app.js; then
  echo "web/app.js is missing the close fetch handler" >&2
  exit 1
fi

echo "Resource structure validation passed."
