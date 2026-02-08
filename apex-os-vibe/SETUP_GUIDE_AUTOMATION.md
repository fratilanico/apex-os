# APEX OS - Automated Setup (ASAP)

```
╔══════════════════════════════════════════════════════════════════╗
║  ONE COMMAND TO RULE THEM ALL                                   ║
╚══════════════════════════════════════════════════════════════════╝
```

## Quick Start (30 seconds)

```bash
cd /Users/nico/apex-os-vibe
./scripts/one-click-setup.sh
```

That's it. The script will:
- ✅ Create Notion database automatically
- ✅ Setup Google Cloud Vertex AI
- ✅ Configure environment variables
- ✅ Deploy to Vercel
- ✅ Run tests

## What You Need

1. **Notion Integration Token**
   - The script will open the page for you
   - Just click a few buttons and copy the token

2. **Google Cloud Project** (optional)
   - If you have gcloud CLI installed, we'll configure it
   - If not, we'll skip it (you can add later)

## Alternative: Manual Scripts

If you want more control:

### 1. Setup Everything
```bash
./scripts/setup-guide-automation.sh
```
Interactive prompts for credentials.

### 2. Test the System
```bash
./scripts/test-guide-system.sh
```
Validates Notion, GCP, and generates a test guide.

### 3. Just Create Notion Database
```bash
node scripts/notion-database-creator.mjs <your-notion-token>
```

### 4. Just Setup GCP
```bash
./scripts/setup-gcp-vertex.sh <your-project-id>
```

## NPM Commands (After Setup)

```bash
# Test guide generation locally
npm run test:guides

# Deploy to production
npm run deploy:guides

# Check configuration
npm run check:guides
```

## Troubleshooting

### "Notion token invalid"
- Go to https://www.notion.so/my-integrations
- Create new integration
- Copy the token (starts with `secret_`)

### "GCP project not found"
- Run: `gcloud projects list`
- Use the PROJECT_ID from that list

### "Command not found: gcloud"
- Optional: Install from https://cloud.google.com/sdk/docs/install
- Or skip GCP setup (can add later)

## What Gets Created

```
Files:
  .env.local              - Your environment configuration
  vertex-ai-key.json      - GCP credentials (git ignored)
  SETUP_SUMMARY.txt       - Quick reference for your config

Notion:
  Database: "Source Code - Content Library"
  - All properties configured
  - Ready to receive guides

Google Cloud:
  Service Account: guide-generator
  Permissions: Vertex AI access
  Key: vertex-ai-key.json
```

## Next Steps After Setup

1. **Test it works:**
   ```bash
   ./scripts/test-guide-system.sh
   ```

2. **Deploy to Vercel:**
   ```bash
   vercel --prod
   ```

3. **Connect to your content hub:**
   - See GUIDE_GENERATION_SETUP.md
   - Add webhook call when processing stories

4. **Check Notion:**
   - Your database will have test guides
   - Review and rate them 1-5 stars

## Support

If something fails:
1. Check SETUP_SUMMARY.txt for your config
2. Run `./scripts/test-guide-system.sh` to diagnose
3. See full docs in GUIDE_GENERATION_SETUP.md

---

**TL;DR:** Run `./scripts/one-click-setup.sh` and follow prompts.
