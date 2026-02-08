#!/bin/bash
#
# Test ClawBot Connection
# =======================
# Tests WebSocket connection to ClawBot Gateway
#
# Usage: ./test-connection.sh [ws://localhost:18789] [token]
#

WS_URL=${1:-"ws://localhost:18789"}
TOKEN=${2:-""}

echo "🧪 Testing ClawBot Connection"
echo "=============================="
echo "URL: $WS_URL"
echo ""

# Check if wscat is installed
if ! command -v wscat &> /dev/null; then
  echo "📦 Installing wscat..."
  npm install -g wscat
fi

# Test connection
echo "Connecting to ClawBot..."
echo ""

if [ -n "$TOKEN" ]; then
  wscat -c "$WS_URL?token=$TOKEN"
else
  wscat -c "$WS_URL"
fi
