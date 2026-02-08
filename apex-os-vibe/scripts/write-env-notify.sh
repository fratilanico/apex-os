#!/usr/bin/env bash
# Generate .env.local with notification/Resend/Telegram/Discord settings from current shell env.
# Usage: export the variables first, then run this script.
#   export RESEND_API_KEY=...
#   export FROM_EMAIL=...
#   export NOTIFY_EMAIL=...
#   export TELEGRAM_BOT_TOKEN=...
#   export TELEGRAM_CHAT_ID=...
#   export DISCORD_WEBHOOK_URL=...
#   export WEBHOOK_URL=...               # optional, defaults to /api/waitlist-notify
#   export VITE_SUPABASE_URL=...
#   export VITE_SUPABASE_ANON_KEY=...
#   ./scripts/write-env-notify.sh

set -euo pipefail

ENV_FILE=".env.local"
BACKUP_FILE=".env.local.bak"

echo "[info] Writing $ENV_FILE from current shell environment..."
if [ -f "$ENV_FILE" ]; then
  cp "$ENV_FILE" "$BACKUP_FILE"
  echo "[info] Backup created: $BACKUP_FILE"
fi

cat > "$ENV_FILE" <<'EOF'
# --- Notification / Email (Resend) ---
RESEND_API_KEY=${RESEND_API_KEY}
FROM_EMAIL=${FROM_EMAIL}
NOTIFY_EMAIL=${NOTIFY_EMAIL}

# --- Telegram / Discord (optional) ---
TELEGRAM_BOT_TOKEN=${TELEGRAM_BOT_TOKEN}
TELEGRAM_CHAT_ID=${TELEGRAM_CHAT_ID}
DISCORD_WEBHOOK_URL=${DISCORD_WEBHOOK_URL}

# --- Webhook (defaults to /api/waitlist-notify) ---
WEBHOOK_URL=${WEBHOOK_URL}

# --- Supabase (waitlist storage) ---
VITE_SUPABASE_URL=${VITE_SUPABASE_URL}
VITE_SUPABASE_ANON_KEY=${VITE_SUPABASE_ANON_KEY}

# --- Resend sender (used in API route) ---
FROM_EMAIL=${FROM_EMAIL}
EOF

echo "[done] $ENV_FILE written. Verify values (empty entries mean missing env in shell)."
