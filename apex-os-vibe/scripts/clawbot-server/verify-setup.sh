#!/bin/bash
#
# Verify ClawBot Setup
# ====================
# Checks if ClawBot server is properly configured
#

echo "🔍 ClawBot Setup Verification"
echo "=============================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

check() {
  if $1 &> /dev/null; then
    echo -e "${GREEN}✓${NC} $2"
  else
    echo -e "${RED}✗${NC} $2"
    return 1
  fi
}

# Check Node.js
echo "📦 Dependencies:"
check "command -v node" "Node.js installed"
NODE_VERSION=$(node --version 2>/dev/null || echo "not found")
echo "   Version: $NODE_VERSION"

# Check ClawBot
check "command -v clawdbot" "ClawBot installed"
CLAWBOT_VERSION=$(clawdbot --version 2>/dev/null || echo "not found")
echo "   Version: $CLAWBOT_VERSION"

echo ""

# Check user
echo "👤 Service User:"
if id "clawbot" &>/dev/null; then
  echo -e "${GREEN}✓${NC} User 'clawbot' exists"
else
  echo -e "${YELLOW}⚠${NC} User 'clawbot' not found"
fi

echo ""

# Check directories
echo "📁 Directories:"
check "[ -d /opt/clawbot ]" "/opt/clawbot exists"
check "[ -d /opt/clawbot/.clawdbot ]" "ClawBot config directory"
check "[ -f /opt/clawbot/.clawdbot/clawdbot.json ]" "Configuration file"

echo ""

# Check systemd service
echo "🔧 Systemd Service:"
if [ -f /etc/systemd/system/clawbot.service ]; then
  echo -e "${GREEN}✓${NC} Service file installed"
  
  if systemctl is-enabled clawbot &>/dev/null; then
    echo -e "${GREEN}✓${NC} Service enabled"
  else
    echo -e "${YELLOW}⚠${NC} Service not enabled"
  fi
  
  if systemctl is-active clawbot &>/dev/null; then
    echo -e "${GREEN}✓${NC} Service is running"
  else
    echo -e "${RED}✗${NC} Service is not running"
  fi
else
  echo -e "${YELLOW}⚠${NC} Service file not installed"
fi

echo ""

# Check firewall
echo "🔥 Firewall:"
if command -v ufw &> /dev/null; then
  if sudo ufw status | grep -q "18789.*ALLOW" &>/dev/null; then
    echo -e "${GREEN}✓${NC} Port 18789 open"
  else
    echo -e "${YELLOW}⚠${NC} Port 18789 not open in firewall"
  fi
else
  echo -e "${YELLOW}⚠${NC} UFW not installed"
fi

echo ""

# Check if gateway is responding
echo "🌐 Gateway Status:"
if curl -s --max-time 2 http://localhost:18789/health &>/dev/null; then
  echo -e "${GREEN}✓${NC} Gateway responding on localhost"
else
  echo -e "${RED}✗${NC} Gateway not responding (may be normal if not started)"
fi

echo ""
echo "═══════════════════════════════════"
echo ""

# Overall status
if systemctl is-active clawbot &>/dev/null; then
  echo -e "${GREEN}✅ ClawBot is running!${NC}"
  echo ""
  echo "View logs: sudo journalctl -u clawbot -f"
else
  echo -e "${YELLOW}⚠ ClawBot is not running${NC}"
  echo ""
  echo "Start it: sudo systemctl start clawbot"
  echo "Check logs: sudo journalctl -u clawbot -f"
fi

echo ""
