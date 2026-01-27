# 🦞 ClawBot Integration for Vibe Coder

Complete guide for integrating ClawBot into your APEX OS / Vibe Coder terminal.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Local Development Setup](#local-development-setup)
- [Production Server Setup](#production-server-setup)
- [Frontend Usage](#frontend-usage)
- [Troubleshooting](#troubleshooting)
- [Cost Breakdown](#cost-breakdown)
- [Security Considerations](#security-considerations)

---

## Overview

This integration adds **ClawBot** (Clawdbot) as a second AI mode in your Vibe Coder terminal, alongside the existing Gemini mode.

### Features

- ✅ **Dual AI Modes**: Switch between Gemini (fast/free) and ClawBot (powerful/autonomous)
- ✅ **Real-time WebSocket**: Streaming responses from ClawBot
- ✅ **Tool Execution**: ClawBot can run commands, read/write files
- ✅ **Session Persistence**: Maintains context across conversations
- ✅ **Auto-reconnect**: Handles connection drops gracefully
- ✅ **Production Ready**: Systemd service, SSL support, monitoring

---

## Architecture

```
┌─────────────────────────────────────────────┐
│     Vibe Portfolio (Frontend)               │
│                                              │
│  [⚡ Gemini Mode] [🦞 ClawBot Mode]         │
│                                              │
│  TerminalChat Component                     │
│  ↓ (if Gemini)         ↓ (if ClawBot)       │
│  POST /api/terminal    WebSocket             │
└──────┬──────────────────────┬────────────────┘
       │                      │
       ▼                      ▼
┌──────────────┐    ┌────────────────────────┐
│ Vercel       │    │ ClawBot Server         │
│ Function     │    │ (Your VPS/Local)       │
│ (Gemini API) │    │                        │
└──────────────┘    │ - Gateway (WS)         │
                    │ - Claude API           │
                    │ - Tool execution       │
                    │ - Systemd service      │
                    └────────────────────────┘
```

---

## Local Development Setup

### Step 1: Install ClawBot on Your Mac

```bash
# Install ClawBot globally
npm install -g clawdbot

# Run onboarding wizard
clawdbot onboard

# When prompted:
# - Choose "Anthropic" as provider
# - Use "Claude Code CLI" if you have Claude Max subscription
# - OR use "Anthropic API key" if you have API credits
# - Skip messaging platforms (Telegram, Discord, etc.) for now
# - Enable Web UI: Yes

# Start the gateway
clawdbot gateway start

# Verify it's running
clawdbot channels status
# Should show: Gateway reachable at ws://localhost:18789
```

### Step 2: Get Your Gateway Token

```bash
# View your ClawBot config to find the token
cat ~/.clawdbot/clawdbot.json | grep -A 3 '"auth"'

# Look for:
# "auth": {
#   "mode": "token",
#   "token": "YOUR_TOKEN_HERE"
# }
```

### Step 3: Configure Vibe Portfolio

```bash
cd vibe-portfolio

# Copy .env.example to .env.local
cp .env.example .env.local

# Edit .env.local and add:
VITE_CLAWBOT_WS_URL="ws://localhost:18789"
VITE_CLAWBOT_TOKEN="your-token-from-step-2"
```

### Step 4: Test Locally

```bash
# Start Vibe Portfolio dev server
npm run dev

# Open browser to http://localhost:5173
# You should see the mode switcher with Gemini and ClawBot options
# Click ClawBot mode - it should connect (green indicator)
```

---

## Production Server Setup

### Option 1: DigitalOcean Droplet (Recommended - $6/mo)

#### Create Droplet

1. Go to [DigitalOcean](https://cloud.digitalocean.com/droplets/new)
2. Choose:
   - **Image**: Ubuntu 24.04 LTS
   - **Plan**: Basic ($6/mo - 1GB RAM, 25GB SSD)
   - **Datacenter**: Closest to your users
   - **Authentication**: SSH key (add your public key)
   - **Hostname**: `clawbot-server`

#### Deploy ClawBot

```bash
# SSH into your droplet
ssh root@your-droplet-ip

# Clone your repo (or copy deployment scripts)
git clone https://github.com/your-username/vibe-portfolio.git
cd vibe-portfolio/scripts/clawbot-server

# Run setup script
chmod +x setup-server.sh
./setup-server.sh

# Follow prompts:
# - Enter your Anthropic API key
# - Gateway token will be auto-generated

# Install systemd service
chmod +x install-service.sh
sudo ./install-service.sh

# Start ClawBot
sudo systemctl start clawbot

# Check status
sudo systemctl status clawbot

# View logs
sudo journalctl -u clawbot -f
```

#### Verify Server Setup

```bash
# Run verification script
chmod +x verify-setup.sh
./verify-setup.sh

# Should show all green checkmarks ✓
```

#### Configure Firewall

```bash
# Already done by setup script, but verify:
sudo ufw status

# Should show:
# 22/tcp    ALLOW  (SSH)
# 18789/tcp ALLOW  (ClawBot Gateway)
```

### Option 2: Add SSL/HTTPS (Recommended for Production)

```bash
# Point your domain to the server IP first
# Wait for DNS to propagate (5-60 minutes)

# Run SSL setup
cd scripts/clawbot-server
chmod +x setup-ssl.sh
sudo ./setup-ssl.sh clawbot.yourdomain.com

# This will:
# - Install Nginx
# - Get Let's Encrypt SSL certificate
# - Configure reverse proxy
# - Set up auto-renewal

# Your ClawBot is now at wss://clawbot.yourdomain.com
```

### Update Vibe Portfolio for Production

```bash
# In your Vercel project, add environment variables:
vercel env add VITE_CLAWBOT_WS_URL

# Enter value:
wss://clawbot.yourdomain.com
# (or ws://YOUR_SERVER_IP:18789 if no SSL)

vercel env add VITE_CLAWBOT_TOKEN
# Enter the token from ~/clawbot-credentials.txt on server

# Deploy
git push origin main  # Auto-deploys on Vercel
```

---

## Frontend Usage

### Using the Terminal

```tsx
// The TerminalChat component is ready to use
import { TerminalChat } from '@/components/ui/Terminal/TerminalChat';

function MyPage() {
  return (
    <div>
      <h1>APEX Terminal</h1>
      <TerminalChat />
    </div>
  );
}
```

### Mode Switcher

- Click **⚡ Gemini** for fast, free AI (good for quick questions)
- Click **🦞 ClawBot** for powerful autonomous agent (good for complex tasks)

### Connection Status

- **Green dot** 🟢: Connected to ClawBot
- **Yellow dot** 🟡: Reconnecting...
- **Red dot** 🔴: Disconnected

### Programmatic Access

```tsx
import { useTerminalStore } from '@/stores/terminalStore';

function MyComponent() {
  const { mode, setMode, clawbot, sendToClawBot } = useTerminalStore();
  
  // Switch to ClawBot mode
  const useClawBot = () => {
    setMode('clawbot');
  };
  
  // Send message
  const askClawBot = async (question: string) => {
    try {
      sendToClawBot(question);
    } catch (error) {
      console.error('ClawBot error:', error);
    }
  };
  
  // Check connection status
  const isConnected = clawbot.status.connected;
  
  return (
    <button onClick={useClawBot} disabled={!isConnected}>
      Ask ClawBot
    </button>
  );
}
```

---

## Troubleshooting

### ClawBot Won't Connect

**Symptom**: Red dot, "Disconnected" status

**Solutions**:

```bash
# 1. Check if ClawBot gateway is running
clawdbot channels status

# 2. Restart gateway
clawdbot gateway restart

# 3. Check logs
tail -f ~/.clawdbot/logs/gateway.log

# 4. Verify WebSocket URL in .env.local
cat vibe-portfolio/.env.local | grep CLAWBOT

# 5. Test connection manually
cd vibe-portfolio/scripts/clawbot-server
./test-connection.sh ws://localhost:18789 YOUR_TOKEN
```

### "CORS Error" in Browser

**Solution**: Update ClawBot config to allow your domain:

```bash
# Edit ClawBot config
nano ~/.clawdbot/clawdbot.json

# Update CORS section:
{
  "gateway": {
    "cors": {
      "enabled": true,
      "origins": [
        "http://localhost:5173",
        "https://your-vibe-portfolio.vercel.app"
      ]
    }
  }
}

# Restart gateway
clawdbot gateway restart
```

### Server: ClawBot Service Won't Start

```bash
# Check service status
sudo systemctl status clawbot

# View error logs
sudo journalctl -u clawbot -n 50

# Common issues:
# 1. Missing API key - check /opt/clawbot/.clawdbot/clawdbot.json
# 2. Port in use - sudo lsof -i :18789
# 3. Permission issues - sudo chown -R clawbot:clawbot /opt/clawbot

# Restart service
sudo systemctl restart clawbot
```

### Connection Drops Frequently

**Solution**: Increase timeouts in Nginx config:

```nginx
# In /etc/nginx/sites-available/clawbot
location / {
    # Increase these values:
    proxy_connect_timeout 7d;
    proxy_send_timeout 7d;
    proxy_read_timeout 7d;
}

# Reload Nginx
sudo nginx -t && sudo systemctl reload nginx
```

---

## Cost Breakdown

| Component | Monthly Cost | Notes |
|-----------|--------------|-------|
| **ClawBot Server** (DigitalOcean 1GB) | $6 | Can run 24/7 |
| **Claude API** (Anthropic) | $20-50 | Pay-as-you-go, depends on usage |
| **Domain** (optional) | $1 | For wss:// (or use Cloudflare free) |
| **Total** | **$27-57/mo** | |

### Reducing Costs

- **Use Claude Max subscription**: Share API quota with setup-token instead of paying per-request
- **Start with local-only**: Run ClawBot on your Mac, skip server for development
- **Use Haiku model**: Cheaper than Sonnet for simple tasks

---

## Security Considerations

### ⚠️ Important Security Notes

1. **Never commit `.env.local`** - Contains sensitive tokens
2. **Rotate tokens regularly** - Gateway token should change every 90 days
3. **Use SSL in production** - Always use `wss://` not `ws://`
4. **Restrict CORS origins** - Only allow your actual domain
5. **Monitor API usage** - Set up billing alerts in Anthropic console
6. **Firewall rules** - Only open ports 22, 80, 443, 18789

### Recommended Setup

```bash
# Strong firewall
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP (for Let's Encrypt)
sudo ufw allow 443/tcp   # HTTPS
sudo ufw allow 18789/tcp # ClawBot (or use Nginx reverse proxy)
sudo ufw enable

# Fail2ban (prevents brute force)
sudo apt install fail2ban
sudo systemctl enable fail2ban

# Auto-updates
sudo apt install unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

---

## Advanced Configuration

### Custom ClawBot Settings

Edit `~/.clawdbot/clawdbot.json`:

```json
{
  "agents": {
    "defaults": {
      "model": {
        "primary": "anthropic/claude-sonnet-4-5"
      },
      "workspace": "/opt/clawbot/workspace",
      "maxConcurrent": 4,  // Max parallel tasks
      "timeout": 300000     // 5 minutes per task
    }
  },
  "gateway": {
    "rateLimit": {
      "enabled": true,
      "maxRequestsPerMinute": 60  // Adjust based on needs
    }
  }
}
```

### Multi-Agent Setup

Enable multiple specialized agents:

```bash
# Configure additional agents in ClawBot
clawdbot configure --section agents

# Create specialized agents for different tasks
# - coding agent
# - devops agent
# - research agent
```

---

## Support & Resources

- **ClawBot Docs**: [https://docs.clawd.bot](https://docs.clawd.bot)
- **GitHub**: [https://github.com/clawdbot/clawdbot](https://github.com/clawdbot/clawdbot)
- **Anthropic Claude**: [https://console.anthropic.com](https://console.anthropic.com)

---

## Quick Reference

```bash
# Local Development
clawdbot gateway start      # Start ClawBot
clawdbot gateway stop       # Stop ClawBot
clawdbot channels status    # Check status
clawdbot dashboard          # Open Web UI

# Production Server
sudo systemctl start clawbot       # Start service
sudo systemctl stop clawbot        # Stop service
sudo systemctl restart clawbot     # Restart service
sudo systemctl status clawbot      # Check status
sudo journalctl -u clawbot -f      # View logs

# Testing
./test-connection.sh ws://localhost:18789 YOUR_TOKEN
./verify-setup.sh

# SSL Setup
sudo ./setup-ssl.sh your-domain.com
```

---

**Version**: 1.0.0  
**Last Updated**: January 2026  
**Compatible with**: Vibe Portfolio v0.0.0+, ClawBot 2026.1.25+
