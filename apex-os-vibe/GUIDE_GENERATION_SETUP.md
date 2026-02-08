# APEX OS - Automated Guide Generation System

```
╔══════════════════════════════════════════════════════════════════╗
║  AUTOMATED GUIDE GENERATION FROM CONTENT                        ║
║  Status: READY FOR INTEGRATION                                  ║
║  Components: Vertex AI + Notion API + Serverless Function      ║
╚══════════════════════════════════════════════════════════════════╝
```

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  CONTENT PIPELINE FLOW                                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  news-source-hub.vercel.app (YOUR EXISTING HUB)                 │
│       │                                                         │
│       ├─ VentureBeat                                            │
│       ├─ Hacker News                                            │
│       ├─ MarkTechPost                                           │
│       └─ OpenAI Updates                                         │
│            │                                                    │
│            ▼ webhook / API call on new stories                 │
│                                                                 │
│  /api/generate-guides (THIS NEW ENDPOINT)                       │
│       │                                                         │
│       ├─> Vertex AI (Gemini 1.5 Pro)                            │
│       │   └─> Generate 3 guides                                 │
│       │                                                         │
│       └─> Notion API                                            │
│           └─> Publish to Content Library                        │
│                                                                 │
│  Notion Database: "Source Code - Content Library"               │
│       │                                                         │
│       └─> Ready for your teaching ecosystem                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Setup Instructions

### 1. Notion Setup (5 minutes)

#### Create the Database

1. Go to Notion
2. Create a new database: **"Source Code - Content Library"**
3. Add these properties:

```yaml
Properties:
  Title:           Title (text)
  Source:          Select (VentureBeat, Hacker News, MarkTechPost, OpenAI, etc.)
  Source URL:      URL
  Content Type:    Select (How-To Guide, Play Guide, Why This Works)
  Status:          Select (Review Needed, Approved, Published, Archived)
  Tags:            Multi-select (AI, Cloud, Security, Web Dev, DevOps, etc.)
  Date Ingested:   Date
  Quality Score:   Number (1-5 rating after human review)
```

#### Create Notion Integration

1. Go to https://www.notion.so/my-integrations
2. Click **"+ New integration"**
3. Name: **"Source Code Guide Generator"**
4. Select your workspace
5. Click **"Submit"**
6. Copy the **Internal Integration Token** (starts with `secret_`)
7. Go to your Content Library database
8. Click **"..."** → **"Connections"** → Add your integration

### 2. Google Cloud Setup (10 minutes)

#### Enable Vertex AI

```bash
# 1. Go to Google Cloud Console
# 2. Create/select project
# 3. Enable Vertex AI API

gcloud services enable aiplatform.googleapis.com

# 4. Create service account
gcloud iam service-accounts create guide-generator \
  --display-name="Guide Generator Service Account"

# 5. Grant permissions
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="serviceAccount:guide-generator@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/aiplatform.user"

# 6. Create and download key
gcloud iam service-accounts keys create vertex-ai-key.json \
  --iam-account=guide-generator@YOUR_PROJECT_ID.iam.gserviceaccount.com

# 7. Set environment variable
export GOOGLE_APPLICATION_CREDENTIALS=/path/to/vertex-ai-key.json
```

### 3. Environment Variables

Add to `/Users/nico/apex-os-vibe/.env.local`:

```bash
# Notion Configuration
NOTION_TOKEN=secret_your_notion_integration_token_here
NOTION_CONTENT_LIBRARY_ID=your_database_id_here

# Google Cloud Configuration
GOOGLE_CLOUD_PROJECT=your-gcp-project-id
GOOGLE_APPLICATION_CREDENTIALS=/path/to/vertex-ai-key.json

# API Security (generate a random secret)
GUIDE_API_SECRET=your_random_secret_here_use_openssl_rand_base64_32
```

To get your Notion database ID:
1. Open your database in Notion
2. Copy the URL
3. The ID is between the workspace name and the "?v=" part
4. Example: `notion.so/workspace/THIS_IS_THE_ID?v=...`

### 4. Deploy to Vercel

```bash
cd /Users/nico/apex-os-vibe

# Add environment variables to Vercel
vercel env add NOTION_TOKEN
vercel env add NOTION_CONTENT_LIBRARY_ID
vercel env add GOOGLE_CLOUD_PROJECT
vercel env add GUIDE_API_SECRET

# For GOOGLE_APPLICATION_CREDENTIALS, you need to:
# 1. Convert vertex-ai-key.json to base64
cat vertex-ai-key.json | base64

# 2. Add as env var (paste the base64 string)
vercel env add GOOGLE_APPLICATION_CREDENTIALS_BASE64

# 3. Update lib/guide-generator/vertex-ai-generator.ts to decode it
```

### 5. Test the Endpoint

```bash
curl -X POST https://your-app.vercel.app/api/generate-guides \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_GUIDE_API_SECRET" \
  -d '{
    "title": "GPT-5 Released with Multimodal Capabilities",
    "content": "OpenAI today announced GPT-5...",
    "source": "OpenAI",
    "url": "https://openai.com/blog/gpt-5",
    "publishedAt": "2026-02-08",
    "contentType": "news"
  }'
```

Expected response:
```json
{
  "success": true,
  "source": "GPT-5 Released with Multimodal Capabilities",
  "guides": {
    "howTo": "page_id_1",
    "playGuide": "page_id_2",
    "whyThisWorks": "page_id_3"
  },
  "timestamp": "2026-02-08T..."
}
```

## Integration with Your Content Hub

### Option A: Add Webhook to Existing Pipeline

In your `news-source-hub` backend (wherever stories are processed):

```javascript
// Inside your existing story processing function
async function onNewStory(story) {
  // Your existing logic...
  await saveToDatabase(story);
  
  // NEW: Trigger guide generation
  await fetch('https://apex-os-vibe.vercel.app/api/generate-guides', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GUIDE_API_SECRET}`
    },
    body: JSON.stringify({
      title: story.title,
      content: story.content || story.description,
      source: story.source,
      url: story.url,
      publishedAt: story.publishedAt,
      contentType: 'news'
    })
  });
}
```

### Option B: Create a Bridge API Route

In your `news-source-hub`, create `/api/trigger-guides.js`:

```javascript
export default async function handler(req, res) {
  const { stories } = req.body; // batch of new stories
  
  const results = [];
  
  for (const story of stories) {
    try {
      const response = await fetch(
        'https://apex-os-vibe.vercel.app/api/generate-guides',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.GUIDE_API_SECRET}`
          },
          body: JSON.stringify({
            title: story.title,
            content: story.content,
            source: story.source,
            url: story.url
          })
        }
      );
      
      results.push(await response.json());
    } catch (error) {
      console.error(`Failed to generate guides for: ${story.title}`, error);
    }
  }
  
  res.status(200).json({ processed: results.length, results });
}
```

## What Gets Generated

For each content piece, the system generates **3 complementary guides**:

### 1. HOW-TO GUIDE 🛠️
- **Focus:** Practical, actionable steps
- **Format:** Step-by-step tutorial
- **Includes:** Code examples, prerequisites, common mistakes
- **Example:** "How to Build a RAG System with GPT-5"

### 2. PLAY GUIDE 🎮
- **Focus:** Hands-on experimentation
- **Format:** Challenge-based learning
- **Includes:** Starter/Intermediate/Advanced levels
- **Example:** "Experiment: Build Your Own Multimodal Chatbot"

### 3. WHY THIS WORKS 🧠
- **Focus:** Deep conceptual understanding
- **Format:** Mental models and patterns
- **Includes:** Historical context, non-obvious insights
- **Example:** "Behind the Scenes: How Multimodal Models Actually Think"

## Quality Control Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│  QUALITY FEEDBACK LOOP                                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  AI generates guides                                            │
│       ↓                                                         │
│  Published to Notion with "Review Needed" status                │
│       ↓                                                         │
│  You rate them 1-5 stars (Quality Score field)                  │
│       ↓                                                         │
│  Top-rated guides (4-5 stars) → mark "Approved"                 │
│       ↓                                                         │
│  Export monthly: "Approved" guides only                         │
│       ↓                                                         │
│  Upload to Vertex AI Data Store (future enhancement)            │
│       ↓                                                         │
│  AI learns YOUR voice and style                                 │
│       ↓                                                         │
│  Better guides next cycle                                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Future Enhancements

### Phase 2: NotebookLM Integration (when API available)

```javascript
// For YouTube videos and long-form content
async function processDeepContent(youtubeUrl) {
  // 1. Send to NotebookLM API
  const summary = await notebookLM.analyze({
    url: youtubeUrl,
    context: yourExistingTeachingMaterials
  });
  
  // 2. Feed summary to guide generator
  const guides = await generateGuides({
    title: summary.title,
    content: summary.keyTakeaways,
    source: 'YouTube',
    url: youtubeUrl
  });
  
  // 3. Publish to Notion
  await publishToNotion(guides);
}
```

### Phase 3: Agent Builder Data Store

Upload your best guides to train the agent:

```bash
# Monthly export of 4-5 star guides
notion-export --database=CONTENT_LIBRARY_ID --filter="Quality Score >= 4"

# Upload to Agent Builder
gcloud vertex-ai data-stores create source-code-guides \
  --location=us-central1 \
  --import-path=gs://your-bucket/approved-guides/
```

## Monitoring & Analytics

Track in Notion using views:

1. **Review Queue:** Status = "Review Needed"
2. **Top Rated:** Quality Score >= 4
3. **By Source:** Group by Source
4. **By Tag:** Group by Tags
5. **Monthly Production:** Date Ingested (this month)

## Cost Estimation

```yaml
Google Vertex AI (Gemini 1.5 Pro):
  Input: $3.50 / 1M tokens
  Output: $10.50 / 1M tokens
  
  Per guide set (3 guides):
    Input: ~5,000 tokens = $0.0175
    Output: ~3,000 tokens = $0.0315
    Total: ~$0.05 per content piece
    
  100 stories/month: $5/month
  
Notion API:
  Free tier: unlimited API calls
  
Total monthly cost: ~$5-10
```

## Support

Issues? Check:
1. Vertex AI credentials configured correctly
2. Notion integration has access to database
3. Environment variables set in Vercel
4. API secret matches in both systems

---

```
╔══════════════════════════════════════════════════════════════════╗
║  READY TO DEPLOY                                                ║
║  Next: Complete Google Cloud setup & add env vars              ║
╚══════════════════════════════════════════════════════════════════╝
```
