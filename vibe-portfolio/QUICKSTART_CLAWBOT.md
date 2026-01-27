# 🦞 ClawBot Quick Start Guide

Get ClawBot running in your Vibe Coder terminal in **5 minutes**.

---

## 🚀 Local Development (Mac)

### 1. Install ClawBot

```bash
npm install -g clawdbot
clawdbot onboard
```

When prompted:
- **Model provider**: Anthropic
- **Auth method**: Claude Code CLI (if you have Claude Max) OR API key
- **Enable Web UI**: Yes
- **Messaging platforms**: Skip all (press Enter)

### 2. Get Your Token

```bash
cat ~/.clawdbot/clawdbot.json | grep '"token"'
# Copy the token value
```

### 3. Configure Vibe Portfolio

```bash
cd vibe-portfolio

# Add to .env.local:
echo 'VITE_CLAWBOT_WS_URL="ws://localhost:18789"' >> .env.local
echo 'VITE_CLAWBOT_TOKEN="YOUR_TOKEN_HERE"' >> .env.local
# Replace YOUR_TOKEN_HERE with the token from step 2
```

### 4. Start Everything

```bash
# Terminal 1: Start ClawBot
clawdbot gateway start

# Terminal 2: Start Vibe Portfolio
npm run dev
```

### 5. Test It

1. Open http://localhost:5173
2. Navigate to terminal/chat page
3. Click **🦞 ClawBot** mode
4. Look for green dot 🟢 (connected)
5. Send a message!

---

## 🌐 Production Server

### Quick Deploy to DigitalOcean

1. **Create Droplet**
   - Ubuntu 24.04 LTS
   - $6/mo plan (1GB RAM)
   - Add your SSH key

2. **SSH and Deploy**

```bash
ssh root@YOUR_DROPLET_IP

# Clone repo
git clone https://github.com/YOUR_USERNAME/vibe-portfolio.git
cd vibe-portfolio/scripts/clawbot-server

# Run automated setup
chmod +x setup-server.sh
./setup-server.sh
# Enter your Anthropic API key when prompted

# Install service
chmod +x install-service.sh
sudo ./install-service.sh

# Start it
sudo systemctl start clawbot

# Verify
chmod +x verify-setup.sh
./verify-setup.sh
```

3. **Get Connection Info**

```bash
cat ~/clawbot-credentials.txt
```

4. **Update Vercel Environment**

In your Vercel dashboard, add:
```
VITE_CLAWBOT_WS_URL=ws://YOUR_DROPLET_IP:18789
VITE_CLAWBOT_TOKEN=token_from_credentials_file
```

5. **Deploy**

```bash
git push origin main
```

Done! Your ClawBot is live. 🎉

---

## 🔒 Add SSL (Optional but Recommended)

```bash
# On your server, point domain to server IP first
# Then:
cd scripts/clawbot-server
chmod +x setup-ssl.sh
sudo ./setup-ssl.sh clawbot.yourdomain.com

# Update Vercel env:
VITE_CLAWBOT_WS_URL=wss://clawbot.yourdomain.com
```

---

## 🧪 Troubleshooting

### ClawBot won't connect?

```bash
# Check if running
clawdbot channels status

# Restart it
clawdbot gateway restart

# Check logs
tail -f ~/.clawdbot/logs/gateway.log
```

### Server issues?

```bash
# Check service
sudo systemctl status clawbot

# View logs
sudo journalctl -u clawbot -f

# Restart service
sudo systemctl restart clawbot
```

---

## 📚 Full Documentation

See [CLAWBOT_INTEGRATION.md](./CLAWBOT_INTEGRATION.md) for complete details.

---

**That's it!** You now have a dual-AI terminal with Gemini and ClawBot. 🚀
