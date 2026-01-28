# 🚀 ClawBot Deployment Checklist

Use this checklist to deploy ClawBot integration step-by-step.

---

## ✅ Pre-Deployment

### Local Setup

- [ ] Node.js 22+ installed (`node --version`)
- [ ] npm or pnpm installed
- [ ] Vibe Portfolio runs locally (`npm run dev`)
- [ ] Have Anthropic API key OR Claude Max subscription

---

## 🖥️ Local Development Testing

### Step 1: Install ClawBot

```bash
npm install -g clawdbot
```

- [ ] ClawBot installed successfully
- [ ] Can run `clawdbot --version`

### Step 2: Configure ClawBot

```bash
clawdbot onboard
```

Configuration choices:
- [ ] Provider: Anthropic
- [ ] Auth: Claude Code CLI (if Claude Max) OR API Key
- [ ] Web UI: Yes
- [ ] Channels: Skip all (for now)

### Step 3: Start ClawBot Gateway

```bash
clawdbot gateway start
```

- [ ] Gateway started successfully
- [ ] Run `clawdbot channels status` shows "Gateway reachable"

### Step 4: Get Gateway Token

```bash
cat ~/.clawdbot/clawdbot.json | grep -A 3 '"auth"'
```

- [ ] Token copied

### Step 5: Configure Vibe Portfolio

```bash
cd vibe-portfolio

# Add to .env.local:
VITE_CLAWBOT_WS_URL="ws://localhost:18789"
VITE_CLAWBOT_TOKEN="YOUR_TOKEN_HERE"
```

- [ ] `.env.local` updated with ClawBot config
- [ ] Token matches ClawBot config

### Step 6: Test Locally

```bash
npm run dev
```

Open http://localhost:5173

- [ ] Terminal page loads
- [ ] Mode switcher shows [⚡ Gemini] [🦞 ClawBot]
- [ ] Can switch to ClawBot mode
- [ ] Green dot 🟢 appears (connected)
- [ ] Can send message to ClawBot
- [ ] Receives response from ClawBot
- [ ] Can switch back to Gemini mode
- [ ] Gemini mode still works

---

## 🌐 Production Server Setup

### Option A: DigitalOcean Droplet

#### Step 1: Create Droplet

- [ ] Go to DigitalOcean dashboard
- [ ] Create new Droplet
  - [ ] Image: Ubuntu 24.04 LTS
  - [ ] Plan: Basic $6/mo (1GB RAM)
  - [ ] Datacenter: Closest to users
  - [ ] Authentication: SSH key added
  - [ ] Hostname: `clawbot-server`
- [ ] Droplet created
- [ ] Can SSH: `ssh root@YOUR_IP`

#### Step 2: Deploy ClawBot

```bash
# SSH into server
ssh root@YOUR_DROPLET_IP

# Clone repo or copy scripts
git clone https://github.com/YOUR_USERNAME/vibe-portfolio.git
cd vibe-portfolio/scripts/clawbot-server

# Run setup
chmod +x setup-server.sh
./setup-server.sh
```

- [ ] Setup script completed
- [ ] Entered Anthropic API key
- [ ] Token generated and saved
- [ ] Credentials file created (`~/clawbot-credentials.txt`)

#### Step 3: Install Service

```bash
chmod +x install-service.sh
sudo ./install-service.sh
```

- [ ] Service installed
- [ ] Service enabled (starts on boot)

#### Step 4: Start ClawBot

```bash
sudo systemctl start clawbot
```

- [ ] Service started
- [ ] Check status: `sudo systemctl status clawbot` shows "active (running)"

#### Step 5: Verify Setup

```bash
chmod +x verify-setup.sh
./verify-setup.sh
```

- [ ] All checks passed ✓
- [ ] Gateway responding

#### Step 6: Configure Firewall

```bash
sudo ufw status
```

- [ ] Port 22 open (SSH)
- [ ] Port 18789 open (ClawBot)
- [ ] Firewall enabled

---

## 🔒 SSL Setup (Optional but Recommended)

### Step 1: Point Domain

- [ ] Domain purchased/available
- [ ] DNS A record points to server IP
- [ ] DNS propagated (check with `dig your-domain.com`)

### Step 2: Install SSL

```bash
cd scripts/clawbot-server
chmod +x setup-ssl.sh
sudo ./setup-ssl.sh clawbot.yourdomain.com
```

- [ ] Nginx installed
- [ ] SSL certificate obtained
- [ ] Nginx configured
- [ ] ClawBot accessible at `https://clawbot.yourdomain.com`

### Step 3: Test HTTPS

```bash
curl -I https://clawbot.yourdomain.com/health
```

- [ ] Returns 200 OK or similar
- [ ] No SSL errors

---

## 🚀 Deploy Frontend to Production

### Step 1: Update Vercel Environment Variables

In Vercel dashboard:

```bash
# Add these environment variables
VITE_CLAWBOT_WS_URL = ws://YOUR_SERVER_IP:18789
# OR with SSL:
VITE_CLAWBOT_WS_URL = wss://clawbot.yourdomain.com

VITE_CLAWBOT_TOKEN = (token from ~/clawbot-credentials.txt)
```

- [ ] `VITE_CLAWBOT_WS_URL` added
- [ ] `VITE_CLAWBOT_TOKEN` added
- [ ] Variables saved

### Step 2: Deploy

```bash
git add .
git commit -m "feat: add ClawBot integration"
git push origin main
```

- [ ] Code pushed to GitHub
- [ ] Vercel auto-deployed
- [ ] Deployment succeeded

### Step 3: Test Production

Open your live site (e.g., `https://your-site.vercel.app`)

- [ ] Site loads
- [ ] Navigate to terminal
- [ ] Mode switcher present
- [ ] Switch to ClawBot mode
- [ ] Green dot appears (connected)
- [ ] Can send message
- [ ] Receives response

---

## 📊 Post-Deployment

### Monitoring

- [ ] Set up uptime monitoring (e.g., UptimeRobot)
- [ ] Configure Anthropic API usage alerts
- [ ] Set up error tracking (Sentry)

### Backup

```bash
# On server
tar -czf clawbot-backup-$(date +%Y%m%d).tar.gz /opt/clawbot/.clawdbot/
```

- [ ] Backup created
- [ ] Backup stored securely

### Security

- [ ] SSH key-only authentication enabled
- [ ] Root login disabled
- [ ] Fail2ban installed
- [ ] Auto-updates configured

### Documentation

- [ ] Team knows how to access ClawBot
- [ ] Connection details documented
- [ ] Troubleshooting guide accessible

---

## 🧪 Verification Tests

### Test 1: Connection Stability

- [ ] Send 10 messages in a row
- [ ] All receive responses
- [ ] No disconnections

### Test 2: Reconnection

- [ ] Restart ClawBot: `sudo systemctl restart clawbot`
- [ ] Frontend auto-reconnects (yellow dot → green dot)
- [ ] Can send messages after reconnect

### Test 3: Mode Switching

- [ ] Switch Gemini → ClawBot multiple times
- [ ] Each mode works correctly
- [ ] Message history separate per mode

### Test 4: Error Handling

- [ ] Stop ClawBot: `sudo systemctl stop clawbot`
- [ ] Frontend shows disconnected (red dot)
- [ ] Shows helpful error message
- [ ] Doesn't crash

### Test 5: Cross-browser

- [ ] Works in Chrome
- [ ] Works in Firefox
- [ ] Works in Safari
- [ ] Works on mobile

---

## 🔧 Troubleshooting Checklist

If something doesn't work:

### ClawBot Won't Connect

- [ ] Gateway running? `clawdbot channels status`
- [ ] Firewall open? `sudo ufw status`
- [ ] Token matches? Check `.env.local` vs `clawdbot.json`
- [ ] CORS allowed? Check `clawdbot.json` origins

### Server Issues

- [ ] Service running? `sudo systemctl status clawbot`
- [ ] View logs: `sudo journalctl -u clawbot -f`
- [ ] Check errors: `sudo journalctl -u clawbot -n 50 --no-pager`

### Frontend Issues

- [ ] Browser console errors?
- [ ] Network tab shows WebSocket connection?
- [ ] Environment variables correct?
- [ ] Build successful?

---

## 📞 Emergency Rollback

If production breaks:

```bash
# On server
sudo systemctl stop clawbot

# In Vercel
# Remove ClawBot environment variables
# Redeploy

# Or revert commit
git revert HEAD
git push origin main
```

---

## ✅ Final Checklist

Before marking as "DONE":

- [ ] Local development works
- [ ] Production server deployed
- [ ] Frontend deployed to Vercel
- [ ] SSL configured (or skipped intentionally)
- [ ] All tests passed
- [ ] Team trained
- [ ] Documentation updated
- [ ] Monitoring set up
- [ ] Backups configured

---

**Status**: [ ] Not Started | [ ] In Progress | [ ] Complete

**Deployment Date**: _______________

**Deployed By**: _______________

**Issues Encountered**: _______________

---

Congratulations! 🎉 Your ClawBot integration is live!
