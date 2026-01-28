#!/bin/bash
#
# ClawBot Server Setup Script
# =============================
# Sets up ClawBot on a fresh Ubuntu 24.04 server
#
# Usage: 
#   wget -qO- https://your-repo.com/setup-server.sh | bash
#   OR
#   ./setup-server.sh
#

set -e  # Exit on error

echo "🦞 ClawBot Server Setup"
echo "======================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -eq 0 ]; then 
  echo -e "${RED}❌ Please do not run as root${NC}"
  echo "Run as a regular user with sudo privileges"
  exit 1
fi

echo -e "${GREEN}✓${NC} Running as user: $(whoami)"

# Update system
echo ""
echo "📦 Updating system packages..."
sudo apt update
sudo apt upgrade -y

# Install Node.js 22
echo ""
echo "📦 Installing Node.js 22..."
if ! command -v node &> /dev/null; then
  curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
  sudo apt install -y nodejs
else
  echo -e "${YELLOW}⚠${NC}  Node.js already installed"
fi

NODE_VERSION=$(node --version)
echo -e "${GREEN}✓${NC} Node.js version: $NODE_VERSION"

# Install ClawBot globally
echo ""
echo "🦞 Installing ClawBot..."
sudo npm install -g clawdbot

CLAWBOT_VERSION=$(clawdbot --version 2>/dev/null || echo "unknown")
echo -e "${GREEN}✓${NC} ClawBot version: $CLAWBOT_VERSION"

# Create clawbot user
echo ""
echo "👤 Creating clawbot service user..."
if id "clawbot" &>/dev/null; then
  echo -e "${YELLOW}⚠${NC}  User 'clawbot' already exists"
else
  sudo useradd -r -s /bin/bash -d /opt/clawbot -m clawbot
  echo -e "${GREEN}✓${NC} Created user 'clawbot'"
fi

# Set up directories
echo ""
echo "📁 Setting up directories..."
sudo mkdir -p /opt/clawbot
sudo chown -R clawbot:clawbot /opt/clawbot
echo -e "${GREEN}✓${NC} Directories ready"

# Configure firewall
echo ""
echo "🔥 Configuring firewall..."
if command -v ufw &> /dev/null; then
  sudo ufw allow 22/tcp comment 'SSH'
  sudo ufw allow 18789/tcp comment 'ClawBot Gateway'
  sudo ufw --force enable
  echo -e "${GREEN}✓${NC} Firewall configured"
else
  echo -e "${YELLOW}⚠${NC}  UFW not found, skipping firewall setup"
fi

# Prompt for ClawBot configuration
echo ""
echo "🔧 ClawBot Configuration"
echo "========================"
echo ""
echo "You need an Anthropic API key to use ClawBot."
echo "Get one at: https://console.anthropic.com/settings/keys"
echo ""

read -p "Enter your Anthropic API key: " ANTHROPIC_API_KEY
read -p "Enter a secure gateway token (or press Enter to generate): " GATEWAY_TOKEN

if [ -z "$GATEWAY_TOKEN" ]; then
  GATEWAY_TOKEN=$(openssl rand -hex 32)
  echo -e "${GREEN}✓${NC} Generated gateway token: $GATEWAY_TOKEN"
fi

# Create ClawBot config as clawbot user
echo ""
echo "📝 Creating ClawBot configuration..."
sudo -u clawbot bash << EOF
cd /opt/clawbot

# Create config directory
mkdir -p ~/.clawdbot

# Create configuration file
cat > ~/.clawdbot/clawdbot.json << 'CONFIG'
{
  "meta": {
    "lastTouchedVersion": "2026.1.25",
    "lastTouchedAt": "$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")"
  },
  "models": {
    "providers": {
      "anthropic": {
        "apiKey": "${ANTHROPIC_API_KEY}",
        "models": []
      }
    }
  },
  "agents": {
    "defaults": {
      "model": {
        "primary": "anthropic/claude-sonnet-4-5"
      },
      "workspace": "/opt/clawbot/workspace",
      "maxConcurrent": 4
    }
  },
  "gateway": {
    "port": 18789,
    "mode": "production",
    "bind": "0.0.0.0",
    "auth": {
      "mode": "token",
      "token": "${GATEWAY_TOKEN}"
    },
    "cors": {
      "enabled": true,
      "origins": ["*"]
    },
    "rateLimit": {
      "enabled": true,
      "maxRequestsPerMinute": 60
    }
  },
  "channels": {
    "telegram": {
      "enabled": false
    }
  }
}
CONFIG

# Create workspace directory
mkdir -p ~/workspace

echo "Configuration created successfully"
EOF

echo -e "${GREEN}✓${NC} ClawBot configured"

# Save credentials for user
echo ""
echo "💾 Saving connection details..."
cat > ~/clawbot-credentials.txt << EOF
ClawBot Server Credentials
==========================

WebSocket URL: ws://$(curl -s ifconfig.me):18789
Gateway Token: ${GATEWAY_TOKEN}

IMPORTANT: Add these to your Vibe Portfolio .env file:
VITE_CLAWBOT_WS_URL="ws://$(curl -s ifconfig.me):18789"
VITE_CLAWBOT_TOKEN="${GATEWAY_TOKEN}"

For production with SSL, use:
VITE_CLAWBOT_WS_URL="wss://your-domain.com"

This file contains sensitive information. Keep it secure!
EOF

chmod 600 ~/clawbot-credentials.txt
echo -e "${GREEN}✓${NC} Credentials saved to ~/clawbot-credentials.txt"

echo ""
echo "✅ ClawBot server setup complete!"
echo ""
echo "Next steps:"
echo "1. Install systemd service: sudo ./install-service.sh"
echo "2. Start ClawBot: sudo systemctl start clawbot"
echo "3. Check status: sudo systemctl status clawbot"
echo ""
echo "Your credentials are in: ~/clawbot-credentials.txt"
echo ""
