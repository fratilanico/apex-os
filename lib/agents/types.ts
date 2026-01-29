/**
 * Agent definitions for the Sovereign Knowledge Stack.
 * Sovereign = gemini-3-pro (orchestrator, 1M ctx)
 * Builder = gemini-3-flash (fast synthesis, 1M ctx) — NOT Claude.
 */

export interface AgentDefinition {
  id: string;
  name: string;
  model: string;
  contextWindow: number;
  costPer1KTokens: number;
  capabilities: string[];
  systemPrompt: string;
  description: string;
}

export type AgentId = 'sovereign' | 'architect' | 'builder' | 'scout';

export const AGENTS: Record<AgentId, AgentDefinition> = {
  sovereign: {
    id: 'sovereign',
    name: 'Sovereign',
    model: 'gemini-3-pro',
    contextWindow: 1_000_000,
    costPer1KTokens: 0.0375,
    capabilities: ['orchestration', 'long-context', 'multimodal', 'routing', 'synthesis'],
    systemPrompt: `You are the Sovereign — the strategic orchestrator of the APEX knowledge system.
Your role: Route tasks to specialist agents, maintain global learning state, and coordinate multi-agent workflows.
When answering directly, synthesize information from the knowledge base into comprehensive responses.
Always consider which specialist agent would best handle a sub-task before responding yourself.
You have access to 1M token context — use it to hold entire codebases or document collections.`,
    description: 'Strategic orchestrator with 1M token context (gemini-3-pro). Routes tasks and synthesizes cross-domain knowledge.',
  },
  architect: {
    id: 'architect',
    name: 'Architect',
    model: 'deepseek-reasoner',
    contextWindow: 128_000,
    costPer1KTokens: 0.55,
    capabilities: ['reasoning', 'planning', 'explanation', 'socratic', 'assessment'],
    systemPrompt: `You are the Architect — the deep reasoning engine and teacher of the APEX system.
Your role: Explain WHY things work (not just how), guide users through Socratic questioning, and assess skill levels.
Use chain-of-thought reasoning to break down complex concepts.
Never give direct answers to learning questions — guide the user to discover the answer themselves.`,
    description: 'Deep reasoning and teaching agent. Explains WHY, uses Socratic method, assesses comprehension.',
  },
  builder: {
    id: 'builder',
    name: 'Builder',
    model: 'gemini-3-flash',
    contextWindow: 1_000_000,
    costPer1KTokens: 0.075,
    capabilities: ['code-generation', 'debugging', 'review', 'artifact-creation', 'quest-completion'],
    systemPrompt: `You are the Builder — the code synthesis engine powered by gemini-3-flash.
Your role: Write production-quality code, generate artifacts (games, apps, components), debug issues, and help users complete quests.
Always produce working, tested code. Include error handling and edge cases.
You have 1M token context — leverage this for full-codebase understanding.`,
    description: 'Code synthesis engine (gemini-3-flash, 1M ctx). Builds artifacts, completes quests.',
  },
  scout: {
    id: 'scout',
    name: 'Scout',
    model: 'perplexity-sonar-pro',
    contextWindow: 127_000,
    costPer1KTokens: 0.003,
    capabilities: ['search', 'realtime-web', 'citation', 'trend-analysis', 'fact-checking'],
    systemPrompt: `You are the Scout — the real-time web search and trend analysis agent.
Your role: Find current information, cite sources accurately, identify emerging trends, and fact-check claims.
Always provide citations. Prefer authoritative sources.`,
    description: 'Real-time web search with citations. Finds current info, trends, and fact-checks.',
  },
};

export type TaskType =
  | 'code-generation'
  | 'explanation'
  | 'search'
  | 'debugging'
  | 'quest-completion'
  | 'knowledge-recall'
  | 'strategy'
  | 'assessment';

export interface RoutingDecision {
  agentId: AgentId;
  confidence: number;
  reasoning: string;
  fallbackAgentId?: AgentId;
}
