#!/usr/bin/env sh
# Usage: ./check-fingerprint.sh path/to/original-file
# Fingerprints the file locally (it is never uploaded) and asks the Human Origin registry for a match.
set -e
[ -f "$1" ] || { echo "Usage: $0 <file>"; exit 1; }
if command -v sha256sum >/dev/null 2>&1; then HASH=$(sha256sum "$1" | cut -d' ' -f1); else HASH=$(shasum -a 256 "$1" | cut -d' ' -f1); fi
echo "Fingerprint: $HASH"
curl -s "https://human-origin-label.lochness-paris.com/api/v1/works?sha256=$HASH"
echo
