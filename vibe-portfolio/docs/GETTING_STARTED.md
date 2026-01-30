# Getting Started with APEX OS

This guide will get you from zero to a running APEX OS instance in under 10 minutes.

## Prerequisites

Before you begin, ensure you have:

- **Node.js 18+** - [Download](https://nodejs.org/)
- **Git** - [Download](https://git-scm.com/)
- **A code editor** - VS Code, Cursor, or similar

## Step 1: Clone & Install

```bash
# Clone the repository
git clone https://github.com/fratilanico/apex-os.git
cd apex-os

# Install dependencies
npm install
```

## Step 2: Get Your API Keys

You'll need API keys from these services (all have free tiers):

### Google AI Studio (Gemini)
1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Click "Get API Key"
3. Create a new key
4. Copy the key starting with `AIza...`

### Perplexity AI
1. Go to [Perplexity Settings](https://www.perplexity.ai/settings/api)
2. Generate an API key
3. Copy the key starting with `pplx-...`

### Supabase
1. Go to [Supabase](https://supabase.com/) and create a project
2. Go to Settings → API
3. Copy the **Project URL** (e.g., `https://abc123.supabase.co`)
4. Copy the **anon public** key (starts with `eyJ...`)

## Step 3: Configure Environment

Create a `.env` file in the project root:

```bash
# Create from template
cp .env.example .env

# Or create manually
touch .env
```

Add your keys:

```env
# Required
GEMINI_API_KEY=AIza...your_key_here
PERPLEXITY_API_KEY=pplx-...your_key_here
SUPABASE_URL=https://yourproject.supabase.co
SUPABASE_ANON_KEY=eyJ...your_key_here

# Optional
VITE_SITE_PASSWORD=optional_password_gate
```

## Step 4: Setup Database

Run this SQL in your Supabase SQL Editor:

```sql
-- Create the frontier intelligence table
CREATE TABLE frontier_intelligence (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  logic TEXT,
  source_url TEXT,
  category TEXT,
  tags TEXT[],
  is_active BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'draft',
  manifested_node_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable public access (adjust for production)
ALTER TABLE frontier_intelligence ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all" ON frontier_intelligence
  FOR ALL USING (true) WITH CHECK (true);
```

## Step 5: Start Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Step 6: Verify Everything Works

### Test the Terminal
1. Navigate to the Terminal section
2. Type "Hello, what can you help me build?"
3. You should get a response from Gemini

### Test Intelligence Sync
```bash
curl -X POST http://localhost:5173/api/intelligence/sync
```

You should see a JSON response with `"success": true`.

## What's Next?

Now that you have APEX OS running:

1. **Explore the Interface**
   - Terminal: AI coding assistant
   - Matrix: Knowledge graph navigation
   - Skill Tree: Track your progress

2. **Customize Your Experience**
   - Modify quests in `data/questsData.ts`
   - Add achievements in `data/achievementsData.ts`
   - Adjust AI prompts in `api/terminal.ts`

3. **Deploy to Production**
   ```bash
   npm install -g vercel
   vercel --prod
   ```

4. **Sync Frontier Intelligence**
   - Visit the Admin page
   - Click "Sync Frontier" to pull latest tech trends

## Common First-Time Issues

### "GEMINI_API_KEY missing"
- Check your `.env` file exists
- Restart the dev server after adding keys

### "Supabase connection failed"
- Verify URL is lowercase (no capitals)
- Check the anon key is the long JWT, not the short one

### "Module not found"
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Port 5173 already in use
```bash
# Kill the process
lsof -ti:5173 | xargs kill -9
npm run dev
```

## Need Help?

- Check the [full documentation](./README.md)
- Open an issue on [GitHub](https://github.com/fratilanico/apex-os/issues)

---

**Welcome to the Frontier, Developer.**
