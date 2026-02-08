# 🚀 START HERE - Automated Guide Generation

## One Command Setup

```bash
cd /Users/nico/apex-os-vibe
npm run guides:setup
```

**That's it!** The script will:
- ✅ Open Notion integration page in your browser
- ✅ Create your database automatically via API
- ✅ Setup Google Cloud Vertex AI
- ✅ Configure all environment variables
- ✅ Deploy to Vercel (optional)
- ✅ Run tests

## Alternative: Shell Script

```bash
./scripts/one-click-setup.sh
```

Same thing, just runs the shell script directly.

## What You'll Need

1. **Notion Integration Token** (the script opens the page for you)
2. **Google Cloud Project** (optional - script checks if you have gcloud)

## After Setup

Test it:
```bash
npm run guides:test
```

Deploy:
```bash
npm run guides:deploy
```

Check config:
```bash
npm run guides:check
```

## How It Works

```
Your Content Hub → /api/generate-guides → Vertex AI → 3 Guides → Notion
```

Each content piece generates:
- 🛠️ **How-To Guide** - Practical steps
- 🎮 **Play Guide** - Hands-on experiments  
- 🧠 **Why This Works** - Deep concepts

Cost: ~$0.05 per content piece (~$5/month for 100 stories)

## Full Docs

- **Quick automation:** `SETUP_GUIDE_AUTOMATION.md`
- **Detailed setup:** `GUIDE_GENERATION_SETUP.md`
- **Quick reference:** `QUICK_START_GUIDE_GENERATION.md`

## Support

Script fails? Run:
```bash
npm run guides:test
```

This will diagnose the issue.

---

**TL;DR:** `npm run guides:setup` → follow prompts → done.
