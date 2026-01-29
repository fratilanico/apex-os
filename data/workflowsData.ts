import type { Workflow, WorkflowRegistry } from '../types/workflow';

/**
 * Complete workflow registry data
 * 13 documented workflows from the Skills Registry
 */
export const WORKFLOWS: Workflow[] = [
  {
    id: 'x-video-analysis',
    name: 'X.com Video Analysis',
    category: 'MEDIA_ANALYSIS',
    confidence: 'medium',
    lastVerified: '2026-01-29',
    location: 'workflows/video-analysis.md',
    description: 'Downloads and analyzes video content from X.com (Twitter) posts. Handles both videos with audio (transcription path) and silent videos/GIFs (visual analysis path).',
    triggerPhrases: [
      'analyze this tweet',
      "what's in this X post",
      'transcribe this video from twitter',
      'analyze https://x.com/...'
    ],
    prerequisites: [
      { name: 'yt-dlp', type: 'tool', required: true, installCommand: 'brew install yt-dlp' },
      { name: 'ffmpeg', type: 'tool', required: true, installCommand: 'brew install ffmpeg' },
      { name: 'whisper', type: 'tool', required: true, installCommand: 'pip install openai-whisper' },
      { name: 'Chrome DevTools MCP', type: 'service', required: false }
    ],
    codePatterns: [
      {
        language: 'bash',
        code: 'yt-dlp -o "%(title)s.%(ext)s" "https://x.com/user/status/123456"',
        description: 'Download video from X.com'
      }
    ],
    notes: [
      'yt-dlp handles X.com video extraction natively',
      'Some content may require authentication',
      'GIFs are treated as silent videos'
    ],
    xpReward: 250,
    questId: 'workflow-media-01'
  },
  {
    id: 'youtube-video-analysis',
    name: 'YouTube Video Analysis',
    category: 'MEDIA_ANALYSIS',
    confidence: 'high',
    lastVerified: '2026-01-29',
    location: 'video-analyzer skill',
    description: 'Downloads and analyzes YouTube videos including regular videos and Shorts.',
    triggerPhrases: [
      'analyze this youtube video',
      'transcribe this video',
      "what's in this youtube short"
    ],
    prerequisites: [
      { name: 'yt-dlp', type: 'tool', required: true, installCommand: 'brew install yt-dlp' },
      { name: 'ffmpeg', type: 'tool', required: true, installCommand: 'brew install ffmpeg' },
      { name: 'whisper', type: 'tool', required: true, installCommand: 'pip install openai-whisper' }
    ],
    codePatterns: [
      {
        language: 'bash',
        code: 'yt-dlp -x --audio-format mp3 "https://youtube.com/watch?v=..."',
        description: 'Extract audio for transcription'
      }
    ],
    notes: [
      'Most reliable platform for yt-dlp',
      'Age-restricted content may need cookies'
    ],
    xpReward: 200,
    questId: 'workflow-media-02'
  },
  {
    id: 'platform-navigation',
    name: 'Platform Navigation',
    category: 'BROWSER_AUTOMATION',
    confidence: 'medium',
    lastVerified: '2026-01-29',
    location: 'Chrome MCP integration',
    description: 'Navigate social media platforms using Chrome DevTools MCP to find content, scroll feeds, and identify video elements.',
    triggerPhrases: [
      'browse to this profile',
      'find videos on this page',
      'scroll through the feed'
    ],
    prerequisites: [
      { name: 'Chrome DevTools MCP', type: 'service', required: true },
      { name: 'Browser session active', type: 'config', required: true }
    ],
    codePatterns: [
      {
        language: 'typescript',
        code: 'await mcp.navigate_page({ url: "https://twitter.com/user" });\nawait mcp.take_snapshot();',
        description: 'Navigate and capture page content'
      }
    ],
    notes: [
      'See platform-selectors.md for DOM selectors',
      'Some platforms have infinite scroll',
      'May need to wait for dynamic content to load'
    ],
    xpReward: 200
  },
  {
    id: 'voice-command-router',
    name: 'Voice Command Router',
    category: 'VOICE_NLP',
    confidence: 'high',
    lastVerified: '2026-01-29',
    location: 'jarvis-interface/services/commandRouter.ts',
    description: 'Translates natural language voice commands into MCP (Model Context Protocol) browser actions. Pattern-based NLP for browser control.',
    triggerPhrases: [
      'execute voice command',
      'voice control browser',
      'speak to control browser'
    ],
    prerequisites: [
      { name: 'MCP Bridge', type: 'service', required: true, description: 'Running on localhost:3001' },
      { name: 'Chrome DevTools MCP', type: 'service', required: true },
      { name: 'Browser session', type: 'config', required: true }
    ],
    flow: `Voice Input → Command Router → Pattern Matching → MCP Bridge → Browser Action
                              ↓ (no match)
                         AI Interpretation`,
    codePatterns: [
      {
        language: 'typescript',
        code: `import { executeVoiceCommand } from './services/commandRouter';

const result = await executeVoiceCommand('Open Gmail');
if (result.success) {
  console.log('Action:', result.action);
}`,
        description: 'Executing a voice command programmatically',
        filename: 'commandRouter.ts'
      }
    ],
    notes: [
      'Supported commands: open, go to, click, type, screenshot, scroll',
      'Recognized sites: gmail, google, youtube, twitter, github, linkedin'
    ],
    xpReward: 300,
    questId: 'workflow-01'
  },
  {
    id: 'jarvis-voice-pipeline',
    name: 'JARVIS Voice Pipeline',
    category: 'VOICE_NLP',
    confidence: 'high',
    lastVerified: '2026-01-29',
    location: 'jarvis-interface/',
    description: 'Complete voice assistant pipeline: wake word detection → speech recognition → command routing → MCP execution → text-to-speech response.',
    triggerPhrases: [
      'set up voice assistant',
      'build jarvis interface',
      'voice automation'
    ],
    prerequisites: [
      { name: 'Picovoice SDK', type: 'service', required: true, description: 'Wake word detection' },
      { name: 'Web Speech API', type: 'service', required: true, description: 'Browser-native' },
      { name: 'MCP Bridge', type: 'service', required: true, description: 'localhost:3001' },
      { name: 'ElevenLabs API key', type: 'config', required: true },
      { name: 'Chrome DevTools MCP', type: 'service', required: true }
    ],
    flow: `1. Wake Word Detection (Picovoice)
   ↓
2. Audio Feedback (Activation Beep)
   ↓
3. Speech Recognition (Web Speech API)
   ↓
4. Command Router (Natural Language → MCP Actions)
   ↓
5. MCP Bridge Execution (Chrome Automation)
   ↓
6. Result Processing (Action → Natural Language)
   ↓
7. Text-to-Speech (ElevenLabs)`,
    envVars: [
      { name: 'VITE_ELEVENLABS_API_KEY', description: 'ElevenLabs API key for TTS', required: true },
      { name: 'VITE_ELEVENLABS_VOICE_ID', description: 'Voice ID (default: Daniel)', example: 'onwK4e9ZLuTAKqWW03F9', required: false },
      { name: 'VITE_PICOVOICE_ACCESS_KEY', description: 'Picovoice access key', required: true }
    ],
    codePatterns: [
      {
        language: 'typescript',
        code: `interface JarvisState {
  systemStatus: 'idle' | 'listening' | 'processing' | 'speaking';
  isListening: boolean;
  isSpeaking: boolean;
  currentTranscript: string;
  conversationHistory: ConversationEntry[];
}`,
        description: 'JARVIS Voice Pipeline State Interface',
        filename: 'useJarvisStore.ts'
      }
    ],
    relatedWorkflows: ['voice-command-router', 'chrome-devtools-mcp'],
    xpReward: 400,
    questId: 'workflow-01'
  },
  {
    id: 'multi-agent-orchestration',
    name: 'Multi-Agent Orchestration',
    category: 'MULTI_AGENT',
    confidence: 'high',
    lastVerified: '2026-01-29',
    location: 'apex-platform/APEX_MASTER.md',
    description: 'Three-layer AI agent system for autonomous task completion: Research Layer (eyes), Core Layer (brain), Asset Layer (hands).',
    triggerPhrases: [
      'orchestrate agents',
      'multi-agent workflow',
      'deploy agent swarm'
    ],
    prerequisites: [
      { name: 'Perplexity API key', type: 'config', required: true, description: 'For The Nexus (research)' },
      { name: 'Gemini API key', type: 'config', required: true, description: 'For The Sovereign (strategy)' },
      { name: 'DeepSeek API key', type: 'config', required: false, description: 'For The Architect (reasoning)' },
      { name: 'Claude API key', type: 'config', required: false, description: 'For The Builder (code)' }
    ],
    flow: `Input: "I want to build a Fintech App"
  ↓
1. Research Layer → Nexus scans market (Perplexity)
  ↓
2. Core Layer → Architect designs DB schema (DeepSeek R1)
  ↓
3. Asset Layer → Builder generates MVP boilerplate (Claude)`,
    codePatterns: [
      {
        language: 'typescript',
        code: `import { routeTask } from '@/lib/agents/router';

const decision = routeTask({
  query: 'Build a REST API',
  requiresCode: true
});
// => { agentId: 'builder', confidence: 0.8, reasoning: '...' }`,
        description: 'Routing a task through the multi-agent system',
        filename: 'router.ts'
      }
    ],
    notes: [
      'Layer 1 (Research): The Nexus (Perplexity Sonar Pro), The Sovereign (Gemini)',
      'Layer 2 (Core): The Architect (DeepSeek R1), The Mentor (DeepSeek R1)',
      'Layer 3 (Asset): The Builder (Claude), The Designer (Voxel Engine)'
    ],
    xpReward: 500,
    questId: 'workflow-03'
  },
  {
    id: 'perplexity-research-agents',
    name: 'Perplexity Research Agents',
    category: 'API_INTEGRATION',
    confidence: 'high',
    lastVerified: '2026-01-29',
    location: 'opencode-perplexity-research-agent/',
    description: 'OpenCode agents using Perplexity Sonar models for multi-source real-time research with citations.',
    triggerPhrases: [
      'deep research on <topic>',
      'perplexity search',
      'comprehensive research'
    ],
    prerequisites: [
      { name: 'Perplexity API key', type: 'config', required: true },
      { name: 'OpenCode CLI', type: 'tool', required: true, installCommand: 'npm i -g opencode' }
    ],
    codePatterns: [
      {
        language: 'json',
        code: `{
  "provider": {
    "perplexity": {
      "npm": "@ai-sdk/perplexity",
      "options": { "baseURL": "https://api.perplexity.ai" },
      "models": {
        "sonar-deep-research": {
          "cost": { "input": 2.0, "output": 8.0 },
          "limit": { "context": 127072, "output": 32768 }
        }
      }
    }
  }
}`,
        description: 'OpenCode configuration for Perplexity',
        filename: 'opencode.json'
      }
    ],
    notes: [
      'perplexity-researcher: General research with citations',
      'perplexity-researcher-deep: Long-form reports, white papers',
      'perplexity-researcher-pro: Academic-level analysis',
      'perplexity-researcher-reasoning: Step-by-step troubleshooting'
    ],
    xpReward: 350
  },
  {
    id: 'headless-agent-api',
    name: 'Headless Agent API',
    category: 'API_INTEGRATION',
    confidence: 'high',
    lastVerified: '2026-01-29',
    location: 'newsletter-source-hub/AGENT.md',
    description: 'REST API designed for AI agents to read feeds and curate content programmatically.',
    triggerPhrases: [
      'agent api integration',
      'headless content curation',
      'automated feed management'
    ],
    prerequisites: [
      { name: 'API admin password', type: 'config', required: true, description: 'x-admin-password header' }
    ],
    codePatterns: [
      {
        language: 'bash',
        code: `# Discovery
GET /api/agent

# Read pending items
GET /api/agent?resource=feed/pending

# Curate item
POST /api/agent
Headers: x-admin-password: YOUR_PASSWORD
Body: {
  "tool": "curate_item",
  "args": { "id": "item_id", "status": "approved" }
}`,
        description: 'Headless Agent API endpoints'
      }
    ],
    notes: [
      'Base URL: /api/agent',
      'Read operations (GET) are public',
      'Write operations (POST) require authentication'
    ],
    xpReward: 300
  },
  {
    id: 'business-lead-generation',
    name: 'Business Lead Generation',
    category: 'API_INTEGRATION',
    confidence: 'medium',
    lastVerified: '2026-01-29',
    location: 'business_leads_london/',
    description: 'Systematic approach to finding businesses that need web/digital services using web research.',
    triggerPhrases: [
      'find business leads',
      'lead generation',
      'prospect research'
    ],
    prerequisites: [
      { name: 'Google Maps access', type: 'service', required: true },
      { name: 'Search queries template', type: 'config', required: false }
    ],
    codePatterns: [
      {
        language: 'text',
        code: `Search Query Templates:
"<industry> <location> without website"
"<industry> <location> outdated website"
"independent <business type> <location>"

Qualification Criteria:
✅ No website at all
✅ Outdated website (10+ years old)
✅ Not mobile-friendly
✅ No online booking system
✅ Poor Google presence`,
        description: 'Lead generation search patterns'
      }
    ],
    notes: [
      'Research sources: Google Maps, Yelp, TripAdvisor, LinkedIn',
      'Target markets: Small local businesses, Professional services, Real estate'
    ],
    xpReward: 200
  },
  {
    id: 'chrome-devtools-mcp',
    name: 'Chrome DevTools MCP',
    category: 'BROWSER_AUTOMATION',
    confidence: 'high',
    lastVerified: '2026-01-29',
    location: 'chrome-devtools-mcp/',
    description: 'Browser automation via Model Context Protocol. Control Chrome programmatically through MCP tools.',
    triggerPhrases: [
      'control browser',
      'automate chrome',
      'browser automation'
    ],
    prerequisites: [
      { name: 'Node.js 22.0.0+', type: 'config', required: true },
      { name: 'Chrome browser', type: 'service', required: true },
      { name: 'MCP server', type: 'service', required: true, description: 'npm start in chrome-devtools-mcp' }
    ],
    codePatterns: [
      {
        language: 'bash',
        code: `cd chrome-devtools-mcp
npm install
npm start
# Server runs on http://localhost:3001`,
        description: 'Starting the MCP server'
      },
      {
        language: 'typescript',
        code: `// Available MCP Tools:
await mcp.navigate_page({ url: "https://example.com" });
await mcp.take_screenshot();
await mcp.take_snapshot();
await mcp.click({ uid: "button-123" });
await mcp.fill({ uid: "input-456", value: "Hello" });
await mcp.list_pages();
await mcp.hover({ uid: "element-789" });
await mcp.press_key({ key: "Enter" });`,
        description: 'MCP tool usage examples',
        filename: 'mcpService.ts'
      }
    ],
    relatedWorkflows: ['voice-command-router', 'jarvis-voice-pipeline', 'platform-navigation'],
    xpReward: 350,
    questId: 'workflow-02'
  },
  {
    id: 'apex-os-development',
    name: 'APEX OS Development',
    category: 'DEVELOPMENT',
    confidence: 'high',
    lastVerified: '2026-01-29',
    location: 'vibe-portfolio/CLAUDE.md',
    description: 'Gamified portfolio/learning platform with AI terminals, skill progression, and cyberpunk UI. React + Three.js + Zustand + Vercel.',
    triggerPhrases: [
      'apex os development',
      'gamified portfolio',
      '3d interface development'
    ],
    prerequisites: [
      { name: 'React 19 + TypeScript', type: 'config', required: true },
      { name: 'Zustand', type: 'tool', required: true, installCommand: 'npm i zustand' },
      { name: 'React Three Fiber', type: 'tool', required: true, installCommand: 'npm i @react-three/fiber @react-three/drei' },
      { name: 'Tailwind CSS', type: 'tool', required: true },
      { name: 'Vercel account', type: 'service', required: true }
    ],
    codePatterns: [
      {
        language: 'typescript',
        code: `// Cross-store communication pattern
const matrixStore = useMatrixStore.getState();
const skillTreeStore = useSkillTreeStore.getState();

matrixStore.updateNode(id, { status: 'completed' });
skillTreeStore.completeQuest(questId);`,
        description: 'Cross-store state management',
        filename: 'useGameEngine.ts'
      }
    ],
    notes: [
      'Key stores: useGameEngine, useMatrixStore, useSkillTreeStore, terminalStore',
      'API: Vercel serverless functions in /api/',
      'AI: Gemini 3 Flash/Pro, Perplexity Sonar'
    ],
    xpReward: 400
  },
  {
    id: 'vercel-serverless-api',
    name: 'Vercel Serverless API',
    category: 'DEVELOPMENT',
    confidence: 'high',
    lastVerified: '2026-01-29',
    location: 'vibe-portfolio/api/',
    description: 'Pattern for creating API endpoints that work both in Vite dev server and Vercel production.',
    triggerPhrases: [
      'add api endpoint',
      'create serverless function',
      'vercel api route'
    ],
    prerequisites: [
      { name: 'Vite', type: 'tool', required: true },
      { name: '@vercel/node', type: 'tool', required: true, installCommand: 'npm i @vercel/node' }
    ],
    codePatterns: [
      {
        language: 'typescript',
        code: `// api/example.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { input } = req.body;
    // ... handler logic
    return res.status(200).json({ data });
  } catch (error) {
    return res.status(500).json({ error: 'Internal error' });
  }
}`,
        description: 'Standard Vercel serverless function pattern',
        filename: 'api/example.ts'
      }
    ],
    notes: [
      'Create api/your-endpoint.ts with Vercel handler signature',
      'Access via /api/your-endpoint in frontend',
      'Works both in dev (Vite middleware) and prod (Vercel)'
    ],
    xpReward: 250
  },
  {
    id: 'agents-md-standards',
    name: 'AGENTS.md Standards',
    category: 'STANDARDS',
    confidence: 'high',
    lastVerified: '2026-01-29',
    location: '~/AGENTS.md',
    description: 'Comprehensive coding standards document that all AI agents must follow. Defines mandatory rules, conventions, and patterns.',
    triggerPhrases: [
      'follow agents.md',
      'code standards',
      'ai development guidelines'
    ],
    prerequisites: [
      { name: 'AGENTS.md file', type: 'config', required: true, description: 'In project root' }
    ],
    codePatterns: [
      {
        language: 'typescript',
        code: `// TypeScript Rules from AGENTS.md:
// MUST: Use explicit return types for public functions
function calculateDiscount(price: number, percent: number): number {
  return price * (percent / 100);
}

// MUST: Prefer interfaces for object shapes
interface User {
  id: string;
  name: string;
  email: string;
}

// MUST NOT: Use 'any' - use 'unknown' instead
function parseJSON(text: string): unknown {
  return JSON.parse(text);
}

// MUST: Use nullish coalescing over OR
const name = user.name ?? 'Anonymous'; // GOOD
// const name = user.name || 'Anonymous'; // BAD`,
        description: 'TypeScript standards from AGENTS.md'
      }
    ],
    notes: [
      'Priority: Security > User Instructions > AGENTS.md > Conventions > Defaults',
      'Key principles: DRY, SOLID, KISS',
      'Import order: Node builtins → External → Internal (@/) → Relative → Type imports'
    ],
    xpReward: 300
  }
];

/**
 * Complete workflow registry
 */
export const WORKFLOW_REGISTRY: WorkflowRegistry = {
  version: '1.0.0',
  lastUpdated: '2026-01-29',
  workflows: WORKFLOWS,
  categories: ['MEDIA_ANALYSIS', 'BROWSER_AUTOMATION', 'VOICE_NLP', 'MULTI_AGENT', 'API_INTEGRATION', 'DEVELOPMENT', 'STANDARDS'],
  deprecated: []
};

/**
 * Get workflow by ID
 */
export function getWorkflowById(id: string): Workflow | undefined {
  return WORKFLOWS.find(w => w.id === id);
}

/**
 * Get workflows by category
 */
export function getWorkflowsByCategory(category: string): Workflow[] {
  return WORKFLOWS.filter(w => w.category === category);
}

/**
 * Search workflows by trigger phrase
 */
export function searchWorkflowsByPhrase(phrase: string): Workflow[] {
  const lower = phrase.toLowerCase();
  return WORKFLOWS.filter(w =>
    w.triggerPhrases.some(tp => tp.toLowerCase().includes(lower)) ||
    w.name.toLowerCase().includes(lower) ||
    w.description.toLowerCase().includes(lower)
  );
}

// Legacy export for backwards compatibility
export const workflowsData = WORKFLOWS;
