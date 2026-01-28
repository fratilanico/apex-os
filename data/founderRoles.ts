/**
 * Founder-Focused Role Mapping for AI Tools
 * 
 * Transforms technical tools into "C-Suite team members"
 * that founders can intuitively understand and orchestrate.
 */

export interface FounderRole {
  role: string;         // The "job title" (e.g., "The Builder")
  subtitle: string;     // The value proposition (e.g., "Your Senior Engineer")
  description: string;  // Founder-focused benefit with cost/equity savings
}

/**
 * Maps each tool ID to its founder-facing role
 * 
 * CORE TIER: Daily drivers for autonomous development
 * ASSET TIER: Specialized tools for content & debugging
 */
export const FOUNDER_ROLE_MAPPING: Record<string, FounderRole> = {
  // ===== CORE STACK (Tier 1) =====
  
  'cursor': {
    role: 'The Builder',
    subtitle: 'Your Senior Engineer',
    description: 'Writes production code while you describe features in plain English. Replaces hiring a $180K senior developer.',
  },
  
  'claude-code': {
    role: 'The Architect',
    subtitle: 'Your CTO',
    description: 'Designs system architecture and makes technical decisions. Saves you from giving up 20% equity to a technical co-founder.',
  },
  
  'gemini': {
    role: 'The Researcher',
    subtitle: 'Context Master',
    description: 'Analyzes 200K+ token contexts for architectural insights. Replaces weeks of manual documentation review.',
  },
  
  'openai-codex': {
    role: 'The Async Engine',
    subtitle: 'Cloud orchestration',
    description: 'Handles background tasks and API integrations. Replaces hiring a $120K backend engineer.',
  },
  
  'antigravity': {
    role: 'The Scale Engine',
    subtitle: '10x multiplier',
    description: 'Handles deployment, infrastructure, and scaling. Replaces an entire DevOps team ($300K/year saved).',
  },
  
  'codemachine': {
    role: 'The Orchestrator',
    subtitle: 'Multi-agent swarms',
    description: 'Coordinates specialized agents for complex features. Replaces managing a 5-person engineering team.',
  },
  
  // ===== ASSET LAYER (Tier 2) =====
  
  'notebooklm': {
    role: 'The Analyst',
    subtitle: 'Document synthesis',
    description: 'Synthesizes research and generates insights from documents. Replaces hiring a $90K research analyst.',
  },
  
  'google-stitch': {
    role: 'The Designer',
    subtitle: 'UI generation',
    description: 'Generates pixel-perfect UI components from wireframes. Saves $60K-100K on design contractors.',
  },
  
  'gpt-5-2': {
    role: 'The Debugger',
    subtitle: 'Root cause specialist',
    description: 'Identifies and fixes production bugs in minutes. Saves 60% of debugging time vs manual troubleshooting.',
  },
  
  'opencode': {
    role: 'The Framework',
    subtitle: 'Agent foundation',
    description: 'Provides infrastructure for agent orchestration. Saves months of building internal tooling.',
  },
  
  'imagen-3': {
    role: 'The Visualizer',
    subtitle: 'Brand assets',
    description: 'Creates marketing visuals and brand assets. Replaces hiring a $50K/year graphic designer.',
  },
  
  'veo-3-1': {
    role: 'The Producer',
    subtitle: 'Video generation',
    description: 'Produces marketing videos and product demos. Saves $5K-15K per video vs agency costs.',
  },
};

/**
 * Get founder role for a tool by ID
 * Falls back to generic role if not found
 */
export function getFounderRole(toolId: string): FounderRole {
  return FOUNDER_ROLE_MAPPING[toolId] || {
    role: 'The Specialist',
    subtitle: 'AI Assistant',
    description: 'Specialized AI tool for targeted tasks. Saves time and reduces operational costs.',
  };
}

/**
 * Type guard to check if a tool has a founder role
 */
export function hasFounderRole(toolId: string): boolean {
  return toolId in FOUNDER_ROLE_MAPPING;
}
