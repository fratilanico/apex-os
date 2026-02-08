#!/bin/bash
#
# Setup SSL/HTTPS for ClawBot
# ============================
# Installs Nginx and Let's Encrypt SSL certificate
#
# Usage: sudo ./setup-ssl.sh your-domain.com
#

set -e

if [ "$EUID" -ne 0 ]; then 
  echo "❌ Please run as root (use sudo)"
  exit 1
fi

if [ -z "$1" ]; then
  echo "❌ Usage: sudo ./setup-ssl.sh your-domain.com"
  exit 1
fi

DOMAIN=$1

echo "🔒 Setting up SSL for ClawBot"
echo "============================="
echo "Domain: $DOMAIN"
echo ""

# Install Nginx
echo "📦 Installing Nginx..."
apt update
apt install -y nginx

# Install Certbot
echo "📦 Installing Certbot..."
apt install -y certbot python3-certbot-nginx

# Stop Nginx temporarily for certificate issuance
systemctl stop nginx

# Get SSL certificate
echo ""
echo "📜 Obtaining SSL certificate from Let's Encrypt..."
echo "You'll need to verify domain ownership."
echo ""

certbot certonly --standalone -d "$DOMAIN" --non-interactive --agree-tos --email admin@"$DOMAIN" || {
  echo "❌ Failed to obtain certificate"
  echo "Make sure:"
  echo "  1. Domain DNS points to this server's IP"
  echo "  2. Port 80 is open and accessible"
  exit 1
}

# Update Nginx configuration with actual domain
sed "s/clawbot\.yourdomain\.com/$DOMAIN/g" nginx-clawbot.conf > /etc/nginx/sites-available/clawbot

# Enable site
ln -sf /etc/nginx/sites-available/clawbot /etc/nginx/sites-enabled/

# Test Nginx configuration
nginx -t

# Start Nginx
systemctl start nginx
systemctl enable nginx

# Set up auto-renewal
systemctl enable certbot.timer
systemctl start certbot.timer

echo ""
echo "✅ SSL setup complete!"
echo ""
echo "Your ClawBot is now available at:"
echo "  https://$DOMAIN"
echo ""
echo "WebSocket URL for Vibe Portfolio:"
echo "  VITE_CLAWBOT_WS_URL=\"wss://$DOMAIN\""
echo ""
echo "SSL certificate will auto-renew via certbot timer"
echo ""
