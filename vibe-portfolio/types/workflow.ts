/**
 * Type definitions for the Workflow Registry system
 * Workflows are documented patterns for AI-assisted development tasks
 */

// Confidence level based on verification status
export type WorkflowConfidence = 'high' | 'medium' | 'low';

// Category for organizing workflows
export type WorkflowCategory =
  | 'MEDIA_ANALYSIS'
  | 'BROWSER_AUTOMATION'
  | 'VOICE_NLP'
  | 'MULTI_AGENT'
  | 'API_INTEGRATION'
  | 'DEVELOPMENT'
  | 'STANDARDS';

// Prerequisite types
export type PrerequisiteType = 'tool' | 'service' | 'config' | 'skill';

/**
 * A prerequisite required to execute a workflow
 */
export interface WorkflowPrerequisite {
  name: string;
  type: PrerequisiteType;
  required: boolean;
  installCommand?: string;
  description?: string;
}

/**
 * A code pattern example for the workflow
 */
export interface WorkflowCodePattern {
  language: string;
  code: string;
  description: string;
  filename?: string;
}

/**
 * Environment variable required by the workflow
 */
export interface WorkflowEnvVar {
  name: string;
  description: string;
  example?: string;
  required: boolean;
}

/**
 * Progress tracking for a workflow
 */
export interface WorkflowProgress {
  workflowId: string;
  mastered: boolean;
  practiceCount: number;
  lastPracticed: string;
  xpEarned: number;
}

/**
 * Main workflow definition
 */
export interface Workflow {
  id: string;
  name: string;
  category: WorkflowCategory;
  confidence: WorkflowConfidence;
  lastVerified: string;
  location: string;
  description: string;
  triggerPhrases: string[];
  prerequisites: WorkflowPrerequisite[];
  codePatterns: WorkflowCodePattern[];
  flow?: string; // ASCII flow diagram
  envVars?: WorkflowEnvVar[];
  notes?: string[];
  relatedWorkflows?: string[]; // IDs of related workflows
  xpReward: number; // XP for mastering this workflow
  questId?: string; // Associated quest ID
}

/**
 * The complete workflow registry
 */
export interface WorkflowRegistry {
  version: string;
  lastUpdated: string;
  workflows: Workflow[];
  categories: WorkflowCategory[];
  deprecated: string[]; // IDs of deprecated workflows
}

/**
 * Category metadata for display
 */
export interface WorkflowCategoryInfo {
  id: WorkflowCategory;
  name: string;
  description: string;
  icon: string; // Lucide icon name
  color: string; // Tailwind color class
}

/**
 * Workflow category display information
 */
export const WORKFLOW_CATEGORIES: WorkflowCategoryInfo[] = [
  {
    id: 'MEDIA_ANALYSIS',
    name: 'Media Analysis',
    description: 'Video, audio, and image processing workflows',
    icon: 'Video',
    color: 'text-purple-400',
  },
  {
    id: 'BROWSER_AUTOMATION',
    name: 'Browser Automation',
    description: 'Chrome DevTools and web automation workflows',
    icon: 'Globe',
    color: 'text-blue-400',
  },
  {
    id: 'VOICE_NLP',
    name: 'Voice & NLP',
    description: 'Speech recognition and natural language workflows',
    icon: 'Mic',
    color: 'text-green-400',
  },
  {
    id: 'MULTI_AGENT',
    name: 'Multi-Agent',
    description: 'AI agent orchestration and swarm patterns',
    icon: 'Users',
    color: 'text-cyan-400',
  },
  {
    id: 'API_INTEGRATION',
    name: 'API Integration',
    description: 'REST APIs, webhooks, and service integration',
    icon: 'Plug',
    color: 'text-yellow-400',
  },
  {
    id: 'DEVELOPMENT',
    name: 'Development',
    description: 'Coding patterns and development workflows',
    icon: 'Code',
    color: 'text-orange-400',
  },
  {
    id: 'STANDARDS',
    name: 'Standards',
    description: 'Coding standards and best practices',
    icon: 'BookOpen',
    color: 'text-red-400',
  },
];

/**
 * Get category info by ID
 */
export function getCategoryInfo(categoryId: WorkflowCategory): WorkflowCategoryInfo | undefined {
  return WORKFLOW_CATEGORIES.find((c) => c.id === categoryId);
}

/**
 * Get confidence badge styling
 */
export function getConfidenceBadge(confidence: WorkflowConfidence): {
  emoji: string;
  label: string;
  color: string;
} {
  switch (confidence) {
    case 'high':
      return { emoji: '🟢', label: 'High', color: 'text-green-400' };
    case 'medium':
      return { emoji: '🟡', label: 'Medium', color: 'text-yellow-400' };
    case 'low':
      return { emoji: '🔴', label: 'Low', color: 'text-red-400' };
  }
}
