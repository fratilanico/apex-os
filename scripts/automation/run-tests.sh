#!/usr/bin/env bash
set -euo pipefail

required_env=(SUPABASE_URL SUPABASE_ANON_KEY SUPABASE_SERVICE_ROLE_KEY)
missing=()

for key in "${required_env[@]}"; do
  if [[ -z "${!key:-}" ]]; then
    missing+=("$key")
  fi
done

if (( ${#missing[@]} > 0 )); then
  echo "Missing env vars: ${missing[*]}"
  echo "Export them and re-run this script."
  exit 1
fi

npm run typecheck
npm run test
npm run build
