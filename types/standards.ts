/**
 * Type definitions for AGENTS.md coding standards
 * Structured representation of coding rules and best practices
 */

// Priority levels per RFC 2119
export type StandardPriority = 'MUST' | 'MUST_NOT' | 'SHOULD' | 'SHOULD_NOT' | 'MAY';

// Standard categories matching AGENTS.md sections
export type StandardCategory =
  | 'SECURITY'
  | 'CODE_STYLE'
  | 'ERROR_HANDLING'
  | 'TESTING'
  | 'ARCHITECTURE'
  | 'PERFORMANCE'
  | 'ACCESSIBILITY'
  | 'GIT_WORKFLOW'
  | 'DOCUMENTATION'
  | 'UNIVERSAL_PRINCIPLES';

/**
 * A code example demonstrating good or bad practice
 */
export interface StandardExample {
  type: 'good' | 'bad';
  language: string;
  code: string;
  explanation: string;
}

/**
 * A single coding standard rule
 */
export interface Standard {
  id: string;
  title: string;
  category: StandardCategory;
  priority: StandardPriority;
  description: string;
  rationale: string;
  examples: StandardExample[];
  keywords: string[]; // For semantic search
  relatedStandards?: string[]; // IDs of related standards
}

/**
 * Complete standards manifest
 */
export interface StandardsManifest {
  version: string;
  lastUpdated: string;
  priorityHierarchy: string[];
  standards: Standard[];
  categories: StandardCategory[];
}

/**
 * Category metadata for display
 */
export interface StandardCategoryInfo {
  id: StandardCategory;
  name: string;
  description: string;
  icon: string; // Lucide icon name
  color: string; // Tailwind color class
}

/**
 * Standard category display information
 */
export const STANDARD_CATEGORIES: StandardCategoryInfo[] = [
  {
    id: 'SECURITY',
    name: 'Security',
    description: 'Security guidelines and vulnerability prevention',
    icon: 'Shield',
    color: 'text-red-400',
  },
  {
    id: 'CODE_STYLE',
    name: 'Code Style',
    description: 'Naming conventions, formatting, and style rules',
    icon: 'Paintbrush',
    color: 'text-blue-400',
  },
  {
    id: 'ERROR_HANDLING',
    name: 'Error Handling',
    description: 'Exception handling and error management patterns',
    icon: 'AlertTriangle',
    color: 'text-orange-400',
  },
  {
    id: 'TESTING',
    name: 'Testing',
    description: 'Unit, integration, and e2e testing standards',
    icon: 'TestTube',
    color: 'text-green-400',
  },
  {
    id: 'ARCHITECTURE',
    name: 'Architecture',
    description: 'System design and structural patterns',
    icon: 'Building',
    color: 'text-purple-400',
  },
  {
    id: 'PERFORMANCE',
    name: 'Performance',
    description: 'Optimization and performance standards',
    icon: 'Zap',
    color: 'text-yellow-400',
  },
  {
    id: 'ACCESSIBILITY',
    name: 'Accessibility',
    description: 'A11y standards and inclusive design',
    icon: 'Eye',
    color: 'text-pink-400',
  },
  {
    id: 'GIT_WORKFLOW',
    name: 'Git Workflow',
    description: 'Version control and collaboration patterns',
    icon: 'GitBranch',
    color: 'text-cyan-400',
  },
  {
    id: 'DOCUMENTATION',
    name: 'Documentation',
    description: 'Code comments and documentation standards',
    icon: 'FileText',
    color: 'text-gray-400',
  },
  {
    id: 'UNIVERSAL_PRINCIPLES',
    name: 'Universal Principles',
    description: 'DRY, SOLID, KISS and other core principles',
    icon: 'Sparkles',
    color: 'text-amber-400',
  },
];

/**
 * Priority hierarchy (highest to lowest)
 */
export const PRIORITY_HIERARCHY = [
  'Security Guidelines',
  'Explicit User Instructions',
  'AGENTS.md Rules',
  'Language/Framework Conventions',
  'Agent Defaults',
];

/**
 * Get category info by ID
 */
export function getStandardCategoryInfo(categoryId: StandardCategory): StandardCategoryInfo | undefined {
  return STANDARD_CATEGORIES.find((c) => c.id === categoryId);
}

/**
 * Get priority badge styling
 */
export function getPriorityBadge(priority: StandardPriority): {
  label: string;
  color: string;
  bgColor: string;
} {
  switch (priority) {
    case 'MUST':
      return { label: 'MUST', color: 'text-red-400', bgColor: 'bg-red-400/20' };
    case 'MUST_NOT':
      return { label: 'MUST NOT', color: 'text-red-400', bgColor: 'bg-red-400/20' };
    case 'SHOULD':
      return { label: 'SHOULD', color: 'text-yellow-400', bgColor: 'bg-yellow-400/20' };
    case 'SHOULD_NOT':
      return { label: 'SHOULD NOT', color: 'text-yellow-400', bgColor: 'bg-yellow-400/20' };
    case 'MAY':
      return { label: 'MAY', color: 'text-green-400', bgColor: 'bg-green-400/20' };
  }
}
