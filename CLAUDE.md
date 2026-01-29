# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**APEX OS** — A gamified portfolio and learning platform built as a "Sovereign Developer Interface" for vibe coders. The platform combines interactive AI terminals, skill progression systems, and a cyberpunk-themed UI.

**Tech Stack:**
- React 19 + TypeScript + Vite
- Zustand for state management (persisted to localStorage)
- Tailwind CSS with TRON-inspired design tokens
- React Three Fiber for 3D game environment
- Vercel serverless functions for API routes
- Google Gemini 3 Flash/Pro for AI
- Perplexity Sonar for web search

## Development Commands

```bash
npm install        # Install dependencies
npm run dev        # Start dev server at localhost:5173
npm run build      # Production build to dist/
npm run typecheck  # Run TypeScript type checking
npm run analyze    # Build + open bundle analyzer
```

## Architecture

### Directory Structure

```
vibe-portfolio/
├── api/                    # Vercel serverless functions
│   ├── terminal.ts         # Main chat endpoint (Gemini 3 Flash)
│   ├── terminal-vertex.ts  # Vertex AI endpoint (alternative)
│   ├── matrix-director.ts  # Graph mutation AI for game state
│   ├── chat.ts             # Legacy chat endpoint
│   └── _lib/               # API utilities (gemini.ts, perplexity.ts)
├── components/
│   ├── artifacts/          # Feature-specific UI components
│   │   └── PlayerOne/      # HUD components (ApexTerminalHUD, SkillTreeHUD, etc.)
│   ├── game/               # Three.js game components
│   │   ├── TronEnvironment/  # 3D scene (TronGrid, DataStreams, TronScene)
│   │   └── HolographicUI/    # 3D UI elements (HoloTerminal, Cyberdeck)
│   └── ui/                 # Shared UI primitives
├── stores/                 # Zustand state stores
├── lib/                    # Business logic
│   ├── agents/             # Multi-agent routing system
│   └── intelligence/       # AI constraints and helpers
├── pages/                  # Route components
├── data/                   # Static data (quests, achievements, curriculum)
├── types/                  # TypeScript type definitions
└── hooks/                  # Custom React hooks
```

### State Management Architecture

All stores use Zustand with `persist` middleware. They interact cross-store via `getState()`:

| Store | Responsibility |
|-------|----------------|
| `useGameEngine` | Unified game state: player position, challenges, fork choices. Coordinates Matrix + SkillTree. |
| `useMatrixStore` | Graph state: nodes, edges, active node. Processes Director AI responses. |
| `useSkillTreeStore` | Progression: XP, gold, quests, skills, DM logs. Quest completion rewards. |
| `useAuthStore` | Authentication state |
| `terminalStore` | Terminal command history and context |

**Cross-store pattern:**
```typescript
// Inside useGameEngine action
const matrixStore = useMatrixStore.getState();
const skillTreeStore = useSkillTreeStore.getState();
matrixStore.updateNode(id, { status: 'completed' });
skillTreeStore.completeQuest(questId);
```

### Multi-Agent System

Located in `lib/agents/`. Four AI agents with different capabilities:

| Agent | Model | Use Case |
|-------|-------|----------|
| `sovereign` | gemini-3-pro-preview | Orchestration, long-context (1M tokens) |
| `architect` | deepseek-reasoner | Deep reasoning, Socratic teaching |
| `builder` | gemini-3-flash-preview | Code generation, debugging |
| `scout` | perplexity-sonar-pro | Real-time web search, citations |

**Router** (`lib/agents/router.ts`) classifies tasks by keywords and routes to best agent:
```typescript
import { routeTask } from '@/lib/agents/router';
const decision = routeTask({ query, requiresCode: true });
// => { agentId: 'builder', confidence: 0.8, reasoning: '...' }
```

### API Pattern (Vercel Serverless)

API files in `/api/` are auto-routed by Vite middleware (dev) and Vercel (prod):

```typescript
// api/example.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  // ... handler logic
  return res.status(200).json({ data });
}
```

Local dev uses custom Vite plugin (`localApiMiddleware` in vite.config.ts) to mirror Vercel's routing.

### Type System

Key types in `types/`:

```typescript
// types/matrix.ts
type NodeStatus = 'locked' | 'discovered' | 'active' | 'completed' | 'remedial';
type NodeType = 'COGNITIVE_BASE' | 'AGENT_LOGIC' | 'CLI_INTERFACE' | 'LOW_LEVEL_ENGINE' | 'VALIDATION' | 'BRANCH' | 'FORK' | 'KNOWLEDGE_CELL';

interface MatrixNode {
  id: string;
  type: 'oasis';
  position: { x: number; y: number };
  data: MatrixNodeData;
}
```

## Code Conventions

### From AGENTS.md (Mandatory)

- **TypeScript strict mode**: Use explicit return types on public functions. Prefer `interface` for object shapes, `type` for unions/aliases.
- **No `any`**: Use `unknown` and narrow with type guards.
- **Nullish coalescing**: Prefer `??` over `||` for defaults.
- **Error handling**: Never swallow errors silently. Log with context, then rethrow or handle explicitly.
- **Import order**: Node builtins → External packages → Internal aliases (`@/`) → Relative imports → Type imports
- **Naming**: PascalCase for components/types, camelCase for functions/variables, SCREAMING_SNAKE for constants.

### React Patterns

- Components use lazy loading via `React.lazy()` for code splitting
- Error boundaries wrap all routes
- Stores accessed via hooks: `const { nodes } = useMatrixStore()`

### Styling

- Tailwind CSS with custom TRON theme tokens (`tron-cyan`, `tron-glow`, etc.)
- Custom animations: `scanline`, `flicker`, `terminal-blink`, `text-glow`
- Font: JetBrains Mono for code, Inter for UI

## Environment Variables

Required in `.env`:
```
GEMINI_API_KEY=       # Google AI Studio API key
PERPLEXITY_API_KEY=   # Perplexity API key (for Scout agent)
VITE_SITE_PASSWORD=   # Optional: Password gate for staging
```

## Key Files Reference

| File | Purpose |
|------|---------|
| `App.tsx` | Router setup, lazy loading, error boundaries |
| `vite.config.ts` | Build config + local API middleware |
| `stores/useGameEngine.ts` | Central game state coordinator |
| `lib/agents/router.ts` | Multi-agent task routing |
| `api/terminal.ts` | Main AI chat endpoint |
| `api/matrix-director.ts` | AI that mutates game graph based on terminal logs |
| `data/questsData.ts` | Quest definitions with XP/gold rewards |
| `tailwind.config.js` | TRON theme tokens and animations |

## Common Patterns

### Adding a new API endpoint
1. Create `api/your-endpoint.ts` with Vercel handler signature
2. Access via `/api/your-endpoint` in frontend

### Adding a new store
1. Create `stores/useYourStore.ts` using Zustand + persist pattern
2. Export from `stores/index.ts`
3. Use `getState()` for cross-store communication

### Adding a new page
1. Create `pages/YourPage.tsx`
2. Add lazy import in `App.tsx`
3. Add route inside `<Routes>` with ErrorBoundary wrapper

## Automation Scripts

When terminal commands can't be executed directly (network issues, complex multi-line commands, authentication):
1. Create a shell script in `scripts/automation/`
2. Make it executable
3. Run it for the user

```
scripts/automation/
├── run-migration.sh     # Database migrations
├── run-migration.mjs    # Node.js migration runner
└── ...                  # Future automation scripts
```

## Database Connection

**Supabase Project:** `lglhpsfrkhcbnecwduuk`

Direct connection:
```
postgresql://postgres:[PASSWORD]@db.lglhpsfrkhcbnecwduuk.supabase.co:5432/postgres
```

Pooler connection (try different regions if needed):
```
postgresql://postgres.lglhpsfrkhcbnecwduuk:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

Regions to try: `eu-central-1`, `us-east-1`, `us-west-1`, `eu-west-1`, `eu-west-2`, `ap-southeast-1`

## Git Workflow

Follow Conventional Commits:
```
feat(scope): description
fix(scope): description
refactor(scope): description
```

Branch naming: `feature/TICKET-description`, `fix/TICKET-description`
