# Agent API Integration Guide

This application provides a **Headless Agent API** designed for AI agents (Claude, Cursor, custom bots) to read the feed and curate content programmatically.

## Base URL
`/api/agent`

## Authentication
**Read Operations (GET):** Public (Read-only)
**Write Operations (POST):** Requires Header `x-admin-password: YOUR_ADMIN_PASSWORD`

## Capabilities

### 1. Discovery
**GET** `/api/agent`
Returns a list of available resources and tools.

### 2. Resources (Read Data)

#### Latest Feed (Full Digest)
**GET** `/api/agent?resource=feed/latest`
Returns the full JSON object of the current digest, including all items and metadata.

#### Pending Items (Queue)
**GET** `/api/agent?resource=feed/pending`
Returns a list of items with `status: "new"` that require curation.

### 3. Tools (Execute Actions)

#### Curate Item
**POST** `/api/agent`
**Headers:** `x-admin-password: ...`
**Body:**
```json
{
  "tool": "curate_item",
  "args": {
    "id": "item_id_hash",
    "status": "approved", // or "rejected", "pinned"
    "notes": "Great article on React Server Components" // optional
  }
}
```

#### Refresh Feed
(Trigger via the public cron endpoint instead: `/api/cron/digest`)

## Example Workflow (Claude)

1. **User:** "Check the pending queue."
2. **Agent:** GET `/api/agent?resource=feed/pending`
3. **User:** "Approve the first one."
4. **Agent:** POST `/api/agent` with `tool: "curate_item", args: { id: "...", status: "approved" }`
