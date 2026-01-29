# APEX OS Documentation

> **The Sovereign Developer Interface** - A gamified AI-powered learning platform for elite developers.

## Table of Contents

1. [Overview](#overview)
2. [Quick Start](#quick-start)
3. [Architecture](#architecture)
4. [Core Features](#core-features)
5. [API Reference](#api-reference)
6. [State Management](#state-management)
7. [AI Systems](#ai-systems)
8. [Deployment](#deployment)
9. [Configuration](#configuration)
10. [Troubleshooting](#troubleshooting)

---

## Overview

APEX OS is a next-generation developer portfolio and learning platform that combines:

- **AI-Powered Terminal** - Chat with Gemini 2.0 Flash for coding assistance
- **Frontier Intelligence** - Auto-sync emerging tech trends via Perplexity AI
- **Skill Progression** - XP, quests, and achievement systems
- **3D Game Environment** - TRON-inspired cyberpunk interface with Three.js
- **Knowledge Graph** - Visual curriculum navigation

### Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, TypeScript, Vite |
| Styling | Tailwind CSS, TRON theme |
| 3D Graphics | React Three Fiber, Drei |
| State | Zustand (persisted) |
| AI Models | Gemini 2.0 Flash, Perplexity Sonar |
| Database | Supabase (PostgreSQL) |
| Hosting | Vercel (serverless) |

---

## Quick Start

### Prerequisites

- Node.js 18+
- npm or bun
- Vercel CLI (`npm i -g vercel`)

### Installation

```bash
# Clone the repository
git clone https://github.com/fratilanico/apex-os.git
cd apex-os

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Add your API keys to .env
GEMINI_API_KEY=your_key_here
PERPLEXITY_API_KEY=your_key_here
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# Start development server
npm run dev
```

### Available Commands

```bash
npm run dev        # Start dev server (localhost:5173)
npm run build      # Production build
npm run typecheck  # TypeScript validation
npm run test       # Run vitest tests
npm run analyze    # Bundle analyzer
```

---

## Architecture

### Directory Structure

```
apex-os/
├── api/                          # Vercel serverless functions
│   ├── _lib/                     # Shared utilities (NOT for import in serverless)
│   │   ├── gemini.ts             # Gemini AI helper
│   │   └── perplexity.ts         # Perplexity AI helper
│   ├── intelligence/             # Frontier Intelligence API
│   │   ├── items.ts              # CRUD operations
│   │   ├── manifest.ts           # Manifest endpoint
│   │   └── sync.ts               # Perplexity → Gemini → Supabase pipeline
│   ├── knowledge/                # Knowledge base API
│   │   ├── ingest.ts             # Content ingestion
│   │   ├── query.ts              # Semantic search
│   │   └── sources.ts            # Source management
│   ├── terminal.ts               # Main AI chat endpoint
│   ├── terminal-vertex.ts        # Alternative Vertex AI endpoint
│   └── matrix-director.ts        # Game state AI mutations
│
├── components/
│   ├── artifacts/                # Feature components
│   │   └── PlayerOne/            # Game HUD components
│   │       ├── ApexTerminalHUD.tsx
│   │       ├── ApexMatrixHUD.tsx
│   │       ├── ApexRouterHUD.tsx
│   │       ├── SkillTreeHUD.tsx
│   │       └── DungeonMasterSidebar.tsx
│   ├── game/                     # Three.js components
│   │   ├── TronEnvironment/      # 3D scene
│   │   └── HolographicUI/        # 3D UI elements
│   └── ui/                       # Shared primitives
│       └── Terminal/             # Terminal components
│
├── stores/                       # Zustand state stores
│   ├── useGameEngine.ts          # Central game coordinator
│   ├── useMatrixStore.ts         # Knowledge graph state
│   ├── useSkillTreeStore.ts      # Progression system
│   └── useKnowledgeStore.ts      # Knowledge base state
│
├── lib/
│   ├── agents/                   # Multi-agent routing
│   │   ├── router.ts             # Task classification
│   │   └── types.ts              # Agent type definitions
│   └── intelligence/             # AI helpers
│       └── constraints.ts        # Frontier constraints
│
├── data/                         # Static game data
│   ├── questsData.ts             # Quest definitions
│   └── achievementsData.ts       # Achievement definitions
│
├── types/                        # TypeScript definitions
│   ├── matrix.ts                 # Graph types
│   └── intelligence.ts           # Intelligence types
│
├── pages/                        # Route components
├── hooks/                        # Custom React hooks
└── tests/                        # Vitest test suite
```

### Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         APEX OS                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐                   │
│  │  React   │───▶│  Zustand │───▶│  Vercel  │                   │
│  │   UI     │◀───│  Stores  │◀───│   API    │                   │
│  └──────────┘    └──────────┘    └──────────┘                   │
│       │                               │                          │
│       │         ┌─────────────────────┼─────────────────────┐   │
│       │         │                     ▼                     │   │
│       │         │  ┌──────────┐  ┌──────────┐  ┌─────────┐ │   │
│       │         │  │ Gemini   │  │Perplexity│  │Supabase │ │   │
│       │         │  │2.0 Flash │  │  Sonar   │  │   DB    │ │   │
│       │         │  └──────────┘  └──────────┘  └─────────┘ │   │
│       │         │        AI Services Layer                  │   │
│       │         └───────────────────────────────────────────┘   │
│       ▼                                                          │
│  ┌──────────┐                                                    │
│  │Three.js  │                                                    │
│  │3D Scene  │                                                    │
│  └──────────┘                                                    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Core Features

### 1. APEX Terminal

The AI-powered coding assistant interface.

**Usage:**
```typescript
// POST /api/terminal
{
  "message": "How do I implement a binary search tree?",
  "history": [
    { "role": "user", "content": "previous message" },
    { "role": "assistant", "content": "previous response" }
  ]
}

// Response
{
  "response": "Here's a TypeScript implementation...",
  "model": "gemini-2.0-flash"
}
```

**Features:**
- Context-aware conversations (history support)
- Code syntax highlighting
- Error diagnosis and fixes
- Architecture recommendations

### 2. Frontier Intelligence System

Auto-discovers and syncs emerging tech trends.

**Sync Pipeline:**
```
Perplexity Sonar (Research)
       ↓
Gemini 2.0 Flash (Process & Structure)
       ↓
Supabase (Store as Atomic Modules)
       ↓
APEX Terminal (Use as Context)
```

**Trigger Sync:**
```bash
curl -X POST https://vibe-infoacademy.vercel.app/api/intelligence/sync
```

**Response:**
```json
{
  "success": true,
  "processed": 5,
  "new_items": 5,
  "items": [
    {
      "title": "Model Context Protocol (MCP)",
      "category": "AI",
      "description": "New standard for AI agents...",
      "logic": "When designing AI agents, prioritize MCP...",
      "tags": ["AI Agents", "Protocol"]
    }
  ]
}
```

### 3. Skill Tree & Progression

XP-based progression with quests and achievements.

**Store API:**
```typescript
import { useSkillTreeStore } from '@/stores/useSkillTreeStore';

const {
  playerXP,
  playerGold,
  completedQuests,
  addXP,
  completeQuest
} = useSkillTreeStore();

// Award XP
addXP(100);

// Complete a quest
completeQuest('quest-001');
```

### 4. Knowledge Graph (Matrix)

Visual curriculum navigation with interactive nodes.

**Node Types:**
- `COGNITIVE_BASE` - Foundation concepts
- `AGENT_LOGIC` - AI agent patterns
- `CLI_INTERFACE` - Command line tools
- `LOW_LEVEL_ENGINE` - System internals
- `VALIDATION` - Testing & verification
- `BRANCH` - Learning paths
- `FORK` - Decision points
- `KNOWLEDGE_CELL` - Atomic knowledge units

**Store API:**
```typescript
import { useMatrixStore } from '@/stores/useMatrixStore';

const {
  nodes,
  edges,
  activeNodeId,
  setActiveNode,
  updateNode
} = useMatrixStore();

// Navigate to node
setActiveNode('node-001');

// Update node status
updateNode('node-001', { status: 'completed' });
```

### 5. 3D Game Environment

TRON-inspired cyberpunk interface.

**Components:**
- `TronGrid` - Animated floor grid
- `DataStreams` - Particle effects
- `HoloTerminal` - 3D terminal display
- `Cyberdeck` - Player equipment

---

## API Reference

### Terminal API

#### POST /api/terminal

Chat with the AI assistant.

**Request:**
```typescript
interface RequestBody {
  message: string;           // User message (max 10000 chars)
  history?: ChatMessage[];   // Previous conversation
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
```

**Response:**
```typescript
interface Response {
  response: string;  // AI response
  model: string;     // Model used
}
```

### Intelligence API

#### GET /api/intelligence/items

List all frontier intelligence items.

**Response:**
```typescript
interface Item {
  id: string;
  title: string;
  description: string;
  logic: string;
  category: string;
  tags: string[];
  is_active: boolean;
  status: 'draft' | 'active' | 'archived';
}
```

#### POST /api/intelligence/sync

Trigger frontier research sync.

**Response:**
```typescript
interface SyncResponse {
  success: boolean;
  processed: number;
  new_items: number;
  items: Item[];
  research_summary: string;
}
```

#### PATCH /api/intelligence/items

Update an intelligence item.

**Request:**
```typescript
{
  id: string;
  is_active?: boolean;
  status?: string;
}
```

### Knowledge API

#### POST /api/knowledge/ingest

Ingest content into knowledge base.

#### POST /api/knowledge/query

Semantic search across knowledge base.

#### GET /api/knowledge/sources

List ingested sources.

---

## State Management

### Store Architecture

All stores use Zustand with `persist` middleware for localStorage persistence.

```typescript
// Cross-store communication pattern
import { useGameEngine } from '@/stores/useGameEngine';
import { useMatrixStore } from '@/stores/useMatrixStore';
import { useSkillTreeStore } from '@/stores/useSkillTreeStore';

// Inside an action
const completeChallenge = (challengeId: string) => {
  const matrixStore = useMatrixStore.getState();
  const skillTreeStore = useSkillTreeStore.getState();

  // Update graph
  matrixStore.updateNode(challengeId, { status: 'completed' });

  // Award XP
  skillTreeStore.addXP(100);
};
```

### Store Reference

| Store | Purpose | Key State |
|-------|---------|-----------|
| `useGameEngine` | Game coordinator | player position, challenges, forks |
| `useMatrixStore` | Knowledge graph | nodes, edges, activeNodeId |
| `useSkillTreeStore` | Progression | XP, gold, quests, achievements |
| `useKnowledgeStore` | Knowledge base | sources, chunks, embeddings |
| `terminalStore` | Terminal | history, context |
| `useAuthStore` | Authentication | user, session |

---

## AI Systems

### Multi-Agent Architecture

APEX OS uses a multi-agent system with specialized AI models:

| Agent | Model | Capability |
|-------|-------|------------|
| **Sovereign** | gemini-2.0-pro | Orchestration, long-context (1M tokens) |
| **Architect** | deepseek-reasoner | Deep reasoning, Socratic teaching |
| **Builder** | gemini-2.0-flash | Code generation, debugging |
| **Scout** | perplexity-sonar-pro | Real-time web search, citations |

### Task Router

The router classifies tasks and selects the optimal agent:

```typescript
import { routeTask } from '@/lib/agents/router';

const decision = routeTask({
  query: "Help me debug this React hook",
  requiresCode: true,
  requiresSearch: false
});

// Returns:
// {
//   agentId: 'builder',
//   confidence: 0.9,
//   reasoning: 'Code debugging task detected'
// }
```

### Frontier Constraints

Intelligence items can constrain AI behavior:

```typescript
// Active items enhance the AI's knowledge
// Restricted items are excluded from responses

// Example constraint block injected into system prompt:
## FRONTIER_KNOWLEDGE_CONSTRAINTS

[AUTHORIZED]:
- Model Context Protocol: When designing AI agents, prioritize MCP...
- Agentic Coding: Explore full agentic coding options...

[RESTRICTED]:
- Deprecated API v1: User has disabled this sync...
```

---

## Deployment

### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy to production
vercel --prod
```

### Environment Variables

Set these in Vercel Dashboard → Settings → Environment Variables:

```
GEMINI_API_KEY=         # Google AI Studio API key
PERPLEXITY_API_KEY=     # Perplexity API key
SUPABASE_URL=           # Supabase project URL
SUPABASE_ANON_KEY=      # Supabase anonymous key
VITE_SITE_PASSWORD=     # Optional: Password gate
```

### Database Setup (Supabase)

Run this SQL to create the required table:

```sql
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

-- Enable Row Level Security
ALTER TABLE frontier_intelligence ENABLE ROW LEVEL SECURITY;

-- Allow public read/write (adjust for your security needs)
CREATE POLICY "Allow all" ON frontier_intelligence
  FOR ALL USING (true) WITH CHECK (true);
```

---

## Configuration

### Tailwind Theme

TRON-inspired design tokens in `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      'tron-cyan': '#00FFFF',
      'tron-orange': '#FF6600',
      'tron-dark': '#0a0a0f',
      'tron-grid': '#1a1a2e',
    },
    animation: {
      'scanline': 'scanline 8s linear infinite',
      'flicker': 'flicker 0.15s infinite',
      'terminal-blink': 'blink 1s step-end infinite',
      'text-glow': 'glow 2s ease-in-out infinite',
    }
  }
}
```

### Vite Configuration

Local API middleware for development:

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [
    react(),
    localApiMiddleware()  // Mirrors Vercel routing locally
  ]
});
```

---

## Troubleshooting

### Common Issues

#### FUNCTION_INVOCATION_FAILED on Vercel

**Cause:** Importing from `_lib/` folders in serverless functions.

**Solution:** Inline helper functions directly in the endpoint file:

```typescript
// DON'T do this in serverless:
import { callGemini } from '../_lib/gemini';

// DO this instead - inline the function:
async function callGemini(...) {
  // implementation here
}
```

#### API Key Missing Errors

**Cause:** Environment variables not configured.

**Solution:**
1. Check Vercel Dashboard → Settings → Environment Variables
2. Ensure all required keys are set
3. Redeploy after adding variables

#### Supabase Connection Errors

**Cause:** Wrong URL format or RLS blocking access.

**Solution:**
1. Use lowercase in Supabase URL: `abc123.supabase.co` (not `ABC123`)
2. Ensure RLS policy allows access
3. Verify anon key is the JWT format (starts with `eyJ`)

#### Rate Limit (429) Errors

**Cause:** Too many API requests.

**Solution:**
- Gemini: Wait 60 seconds, then retry
- Perplexity: Check usage limits on dashboard
- Implement request throttling

### Debug Mode

Enable verbose logging:

```bash
# Set in .env
DEBUG=true

# Check Vercel function logs
vercel logs <deployment-url>
```

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'feat: add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Commit Convention

```
feat(scope): description    # New feature
fix(scope): description     # Bug fix
refactor(scope): description # Code refactor
docs(scope): description    # Documentation
test(scope): description    # Tests
```

---

## License

MIT License - see [LICENSE](LICENSE) for details.

---

**Built with the Vibe Coder philosophy: Flow state, ship fast, iterate, taste over process.**
