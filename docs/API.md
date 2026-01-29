# APEX OS API Reference

Complete API documentation for all APEX OS endpoints.

## Base URL

- **Production:** `https://vibe-infoacademy.vercel.app`
- **Development:** `http://localhost:5173`

## Authentication

Currently, all endpoints are public. For production, implement authentication via:
- Supabase Auth
- API key headers
- JWT tokens

---

## Terminal API

### POST /api/terminal

Chat with the AI coding assistant.

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "message": "string (required, max 10000 chars)",
  "history": [
    {
      "role": "user | assistant",
      "content": "string"
    }
  ]
}
```

**Success Response (200):**
```json
{
  "response": "AI generated response with markdown formatting",
  "model": "gemini-2.0-flash"
}
```

**Error Responses:**

| Code | Error | Description |
|------|-------|-------------|
| 400 | Message required | Empty or missing message |
| 400 | Message too long | Exceeds 10000 characters |
| 400 | Safety filter | Message flagged by content filter |
| 405 | Method not allowed | Use POST only |
| 429 | Rate limit | Too many requests |
| 500 | Server error | API key missing or AI failure |

**Example:**
```bash
curl -X POST https://vibe-infoacademy.vercel.app/api/terminal \
  -H "Content-Type: application/json" \
  -d '{
    "message": "How do I implement a debounce function in TypeScript?",
    "history": []
  }'
```

---

## Intelligence API

### GET /api/intelligence/items

List all frontier intelligence items.

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| status | string | Filter by status (draft, active, archived) |
| category | string | Filter by category |
| is_active | boolean | Filter by active state |

**Success Response (200):**
```json
{
  "items": [
    {
      "id": "uuid",
      "title": "Model Context Protocol",
      "description": "New standard for AI agents...",
      "logic": "Implementation instructions...",
      "source_url": "https://...",
      "category": "AI",
      "tags": ["AI Agents", "Protocol"],
      "is_active": true,
      "status": "active",
      "manifested_node_id": null,
      "created_at": "2026-01-29T01:15:53.394Z",
      "updated_at": "2026-01-29T01:15:53.394Z"
    }
  ]
}
```

**Example:**
```bash
curl https://vibe-infoacademy.vercel.app/api/intelligence/items
```

---

### POST /api/intelligence/sync

Trigger frontier research synchronization pipeline.

This endpoint:
1. Queries Perplexity Sonar for latest AI/dev trends
2. Processes results through Gemini to extract structured data
3. Saves new items to Supabase (deduplicates by title)

**Request:** No body required

**Success Response (200):**
```json
{
  "success": true,
  "processed": 5,
  "new_items": 3,
  "items": [
    {
      "id": "uuid",
      "title": "New Technology",
      "description": "Why it matters...",
      "logic": "How to use it...",
      "category": "AI",
      "tags": ["tag1", "tag2"]
    }
  ],
  "research_summary": "Based on the search results..."
}
```

**Error Response (500):**
```json
{
  "success": false,
  "error": "PERPLEXITY_API_KEY missing"
}
```

**Example:**
```bash
curl -X POST https://vibe-infoacademy.vercel.app/api/intelligence/sync
```

---

### PATCH /api/intelligence/items

Update an intelligence item.

**Request Body:**
```json
{
  "id": "uuid (required)",
  "is_active": true,
  "status": "active",
  "title": "Updated title",
  "description": "Updated description"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "item": { ... }
}
```

**Example:**
```bash
curl -X PATCH https://vibe-infoacademy.vercel.app/api/intelligence/items \
  -H "Content-Type: application/json" \
  -d '{
    "id": "e8e62bda-0c88-4547-ab21-fd5275d1bb82",
    "is_active": true,
    "status": "active"
  }'
```

---

### GET /api/intelligence/manifest

Get the intelligence manifest (summary of all active items).

**Success Response (200):**
```json
{
  "total": 15,
  "active": 8,
  "draft": 7,
  "categories": {
    "AI": 5,
    "Backend": 3,
    "Frontend": 2
  }
}
```

---

## Knowledge API

### POST /api/knowledge/ingest

Ingest content into the knowledge base.

**Request Body:**
```json
{
  "source_type": "url | github | notion | youtube | markdown",
  "source_url": "https://...",
  "content": "Raw content (for markdown type)",
  "metadata": {
    "title": "Optional title",
    "tags": ["tag1", "tag2"]
  }
}
```

**Success Response (200):**
```json
{
  "success": true,
  "source_id": "uuid",
  "chunks_created": 15,
  "embeddings_created": 15
}
```

---

### POST /api/knowledge/query

Semantic search across the knowledge base.

**Request Body:**
```json
{
  "query": "How to implement authentication?",
  "limit": 5,
  "threshold": 0.7
}
```

**Success Response (200):**
```json
{
  "results": [
    {
      "chunk_id": "uuid",
      "content": "Matching content...",
      "similarity": 0.89,
      "source": {
        "title": "Auth Guide",
        "url": "https://..."
      }
    }
  ]
}
```

---

### GET /api/knowledge/sources

List all ingested knowledge sources.

**Success Response (200):**
```json
{
  "sources": [
    {
      "id": "uuid",
      "type": "github",
      "url": "https://github.com/...",
      "title": "Repository Name",
      "chunks_count": 42,
      "created_at": "2026-01-29T..."
    }
  ]
}
```

---

## Matrix Director API

### POST /api/matrix-director

AI-powered game state mutations based on terminal conversations.

**Request Body:**
```json
{
  "conversation_log": [
    { "role": "user", "content": "..." },
    { "role": "assistant", "content": "..." }
  ],
  "current_node_id": "node-001",
  "player_state": {
    "xp": 1500,
    "completed_quests": ["q1", "q2"]
  }
}
```

**Success Response (200):**
```json
{
  "mutations": [
    {
      "type": "unlock_node",
      "node_id": "node-002",
      "reason": "Demonstrated understanding of..."
    },
    {
      "type": "award_xp",
      "amount": 50,
      "reason": "Completed coding challenge"
    }
  ],
  "narrative": "The path forward reveals itself..."
}
```

---

## Error Handling

All endpoints return errors in this format:

```json
{
  "error": "Human readable error message",
  "code": "ERROR_CODE (optional)",
  "details": { }
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| MISSING_API_KEY | 500 | Server configuration error |
| RATE_LIMITED | 429 | Too many requests |
| INVALID_INPUT | 400 | Bad request body |
| NOT_FOUND | 404 | Resource doesn't exist |
| METHOD_NOT_ALLOWED | 405 | Wrong HTTP method |
| SAFETY_BLOCKED | 400 | Content flagged |

---

## Rate Limits

| Service | Limit | Reset |
|---------|-------|-------|
| Gemini | 60 req/min | 60 seconds |
| Perplexity | 50 req/min | 60 seconds |
| Supabase | 500 req/min | 60 seconds |

---

## Webhooks (Coming Soon)

Future webhook support for:
- New intelligence item discovered
- Quest completed
- Node unlocked
- Achievement earned

---

## SDK Usage

### JavaScript/TypeScript

```typescript
// Simple fetch wrapper
async function apexChat(message: string, history: any[] = []) {
  const res = await fetch('https://vibe-infoacademy.vercel.app/api/terminal', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history })
  });
  return res.json();
}

// Usage
const response = await apexChat('How do I use React hooks?');
console.log(response.response);
```

### Python

```python
import requests

def apex_chat(message: str, history: list = []):
    response = requests.post(
        'https://vibe-infoacademy.vercel.app/api/terminal',
        json={'message': message, 'history': history}
    )
    return response.json()

# Usage
result = apex_chat('Explain Python decorators')
print(result['response'])
```

### cURL

```bash
# Chat
curl -X POST https://vibe-infoacademy.vercel.app/api/terminal \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello"}'

# Sync intelligence
curl -X POST https://vibe-infoacademy.vercel.app/api/intelligence/sync

# Get items
curl https://vibe-infoacademy.vercel.app/api/intelligence/items
```

---

## OpenAPI Spec

Full OpenAPI 3.0 specification available at:
`/api/openapi.json` (coming soon)
