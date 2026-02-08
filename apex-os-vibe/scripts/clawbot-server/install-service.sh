#!/bin/bash
#
# Install ClawBot Systemd Service
# ================================
# 
# Usage: sudo ./install-service.sh
#

set -e

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
  echo "❌ Please run as root (use sudo)"
  exit 1
fi

echo "🔧 Installing ClawBot systemd service..."

# Copy service file
cp clawbot.service /etc/systemd/system/

# Reload systemd
systemctl daemon-reload

# Enable service (start on boot)
systemctl enable clawbot

echo "✅ Service installed successfully!"
echo ""
echo "Commands:"
echo "  Start:   sudo systemctl start clawbot"
echo "  Stop:    sudo systemctl stop clawbot"
echo "  Restart: sudo systemctl restart clawbot"
echo "  Status:  sudo systemctl status clawbot"
echo "  Logs:    sudo journalctl -u clawbot -f"
echo ""
