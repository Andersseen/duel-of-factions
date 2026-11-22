#!/usr/bin/env bash
# Creates the Cloudflare Pages project on the first deployment and is a no-op afterwards.
# Any failure other than "already exists" (bad token, missing account id…) fails the job.
set -uo pipefail

: "${PAGES_PROJECT:?}" "${CLOUDFLARE_API_TOKEN:?missing secret}" "${CLOUDFLARE_ACCOUNT_ID:?missing secret}"

output="$(npx --no-install wrangler pages project create "$PAGES_PROJECT" \
  --production-branch=main \
  --compatibility-date=2026-09-21 \
  --compatibility-flags=nodejs_compat 2>&1)"
status=$?

printf '%s\n' "$output"
if [[ $status -ne 0 && "$output" != *"already exists"* ]]; then
  exit "$status"
fi
exit 0
