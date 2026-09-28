#!/usr/bin/env sh
set -eu

missing=0
for file in   index.html   ARCHITECTURE.md   CURRICULUM.md   css/app.css   js/app.js   js/registry.js   content/modules-registry.json
do
  if [ ! -f "$file" ]; then
    echo "FEHLT: $file" >&2
    missing=1
  fi
done

if [ "$missing" -ne 0 ]; then
  echo "Root-Check fehlgeschlagen. Push/Deployment abbrechen." >&2
  exit 1
fi

echo "Root-Check OK."
