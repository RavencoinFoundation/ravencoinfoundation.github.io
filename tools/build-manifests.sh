#!/usr/bin/env bash
# Regenerate the folder manifests in data/manifests/.
#
# The document lists on /documents/ read the GitHub contents API first, so new
# files usually appear the moment they are pushed — no build step required.
# These manifests are the offline fallback for when GitHub's API is unreachable
# or rate-limited. Run this after adding or removing documents:
#
#   ./tools/build-manifests.sh
#
set -euo pipefail

cd "$(dirname "$0")/.."
mkdir -p data/manifests

for folder in BoardMeetingMinutes CodeSecurityAudit ProposalArchive; do
  slug=$(echo "$folder" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]\{1,\}/-/g')
  out="data/manifests/${slug}.json"
  {
    echo "["
    find "$folder" -maxdepth 1 -type f \
      ! -name '.*' ! -name 'index.html' -exec basename {} \; |
      LC_ALL=C sort |
      sed 's/\\/\\\\/g; s/"/\\"/g; s/^/  "/; s/$/",/' |
      sed '$ s/,$//'
    echo "]"
  } > "$out"
  echo "$out"
done
