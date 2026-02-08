#!/usr/bin/env bash
# Sync Kimi API keys to Vercel for apex-os-vibe
# Usage:
#   KIMI_API_KEY=... KIMI_API_KEY_1=... KIMI_API_KEY_2=... KIMI_API_KEY_3=... ./scripts/set-kimi-env.sh
# Requires: vercel CLI logged in, scope nicos-projects-81a407b9, run from project root

set -euo pipefail

SCOPE="nicos-projects-81a407b9"

add_key() {
  local name="$1" value="$2"
  if [[ -z "${value}" ]]; then
    echo "[skip] ${name} not set" >&2
    return
  fi
  echo "[apply] ${name}" >&2
  printf "%s" "${value}" | vercel env add "${name}" production --scope "${SCOPE}" >/dev/null
}

add_key "KIMI_API_KEY"   "${KIMI_API_KEY:-}"
add_key "KIMI_API_KEY_1" "${KIMI_API_KEY_1:-}"
add_key "KIMI_API_KEY_2" "${KIMI_API_KEY_2:-}"
add_key "KIMI_API_KEY_3" "${KIMI_API_KEY_3:-}"

echo "Done. Run: npx vercel --prod --scope ${SCOPE} --confirm" >&2
