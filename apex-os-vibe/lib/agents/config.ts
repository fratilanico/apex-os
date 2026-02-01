// APEX OS Vibe - Agent Definitions
// 19 agents across 6 curriculum modules

export interface AgentDefinition {
  id: string;
  name: string;
  module: string;
  tier: 'free' | 'pro' | 'business';
  credits: number;
  description: string;
  capabilities: string[];
  model: string;
}

export const AGENTS: AgentDefinition[] = [
  // Module 00: Foundation (Free)
  {
    id: 'config-agent',
    name: 'Config Agent',
    module: 'Foundation',
    tier: 'free',
    credits: 5,
    description: 'Environment setup, configuration files, and project initialization',
    capabilities: ['env-setup', 'config', 'dotfiles', 'initialization'],
    model: 'claude-3-5-sonnet',
  },
  {
    id: 'doc-agent',
    name: 'Doc Agent',
    module: 'Foundation',
    tier: 'free',
    credits: 5,
    description: 'Documentation, README files, and technical writing',
    capabilities: ['docs', 'markdown', 'readme', 'technical-writing'],
    model: 'claude-3-5-sonnet',
  },
  
  // Module 01: Frontend (Free)
  {
    id: 'ui-agent',
    name: 'UI Agent',
    module: 'Frontend',
    tier: 'free',
    credits: 10,
    description: 'UI components, React, Vue, and design systems',
    capabilities: ['ui', 'components', 'react', 'vue', 'design-systems'],
    model: 'claude-3-5-sonnet',
  },
  {
    id: 'frontend-agent',
    name: 'Frontend Agent',
    module: 'Frontend',
    tier: 'free',
    credits: 10,
    description: 'Frontend architecture, state management, and SPA development',
    capabilities: ['frontend', 'spa', 'state-management', 'architecture'],
    model: 'claude-3-5-sonnet',
  },
  
  // Module 02: Backend (Pro)
  {
    id: 'backend-agent',
    name: 'Backend Agent',
    module: 'Backend',
    tier: 'pro',
    credits: 10,
    description: 'API design, server architecture, and backend services',
    capabilities: ['api', 'backend', 'server', 'rest', 'graphql'],
    model: 'claude-3-5-sonnet',
  },
  {
    id: 'database-agent',
    name: 'Database Agent',
    module: 'Backend',
    tier: 'pro',
    credits: 10,
    description: 'Schema design, queries, and database optimization',
    capabilities: ['database', 'sql', 'nosql', 'schema', 'optimization'],
    model: 'claude-3-5-sonnet',
  },
  {
    id: 'security-agent',
    name: 'Security Agent',
    module: 'Backend',
    tier: 'pro',
    credits: 15,
    description: 'Authentication, encryption, and security best practices',
    capabilities: ['security', 'auth', 'encryption', 'jwt', 'oauth'],
    model: 'claude-3-5-sonnet',
  },
  
  // Module 03: DevOps (Pro)
  {
    id: 'devops-agent',
    name: 'DevOps Agent',
    module: 'DevOps',
    tier: 'pro',
    credits: 15,
    description: 'CI/CD pipelines, Docker, and Kubernetes',
    capabilities: ['devops', 'cicd', 'docker', 'kubernetes', 'pipelines'],
    model: 'claude-3-5-sonnet',
  },
  {
    id: 'infrastructure-agent',
    name: 'Infrastructure Agent',
    module: 'DevOps',
    tier: 'pro',
    credits: 15,
    description: 'Terraform, cloud architecture, and infrastructure as code',
    capabilities: ['infrastructure', 'terraform', 'cloud', 'aws', 'gcp'],
    model: 'claude-3-5-sonnet',
  },
  {
    id: 'monitoring-agent',
    name: 'Monitoring Agent',
    module: 'DevOps',
    tier: 'pro',
    credits: 10,
    description: 'Observability, logging, metrics, and alerting',
    capabilities: ['monitoring', 'logging', 'metrics', 'observability'],
    model: 'claude-3-5-sonnet',
  },
  
  // Module 04: Advanced (Pro)
  {
    id: 'architecture-agent',
    name: 'Architecture Agent',
    module: 'Advanced',
    tier: 'pro',
    credits: 20,
    description: 'System design, patterns, and scalability',
    capabilities: ['architecture', 'patterns', 'scalability', 'microservices'],
    model: 'claude-3-5-sonnet',
  },
  {
    id: 'performance-agent',
    name: 'Performance Agent',
    module: 'Advanced',
    tier: 'pro',
    credits: 15,
    description: 'Optimization, caching, and profiling',
    capabilities: ['performance', 'optimization', 'caching', 'profiling'],
    model: 'claude-3-5-sonnet',
  },
  {
    id: 'testing-agent',
    name: 'Testing Agent',
    module: 'Advanced',
    tier: 'pro',
    credits: 10,
    description: 'Test strategies, TDD, and coverage',
    capabilities: ['testing', 'tdd', 'coverage', 'e2e', 'unit-tests'],
    model: 'claude-3-5-sonnet',
  },
  
  // Module 05: AI (Business)
  {
    id: 'ai-agent',
    name: 'AI Agent',
    module: 'AI',
    tier: 'business',
    credits: 25,
    description: 'ML models, AI integration, and prompt engineering',
    capabilities: ['ai', 'ml', 'llm', 'prompts', 'fine-tuning'],
    model: 'claude-3-opus',
  },
  {
    id: 'data-agent',
    name: 'Data Agent',
    module: 'AI',
    tier: 'business',
    credits: 20,
    description: 'Data pipelines, ETL, and analytics',
    capabilities: ['data', 'etl', 'analytics', 'pipelines', 'warehouse'],
    model: 'claude-3-opus',
  },
  {
    id: 'nlp-agent',
    name: 'NLP Agent',
    module: 'AI',
    tier: 'business',
    credits: 20,
    description: 'Text processing, sentiment analysis, and classification',
    capabilities: ['nlp', 'text', 'sentiment', 'classification', 'ner'],
    model: 'claude-3-opus',
  },
  
  // Module 06: Specialized (Business)
  {
    id: 'blockchain-agent',
    name: 'Blockchain Agent',
    module: 'Specialized',
    tier: 'business',
    credits: 30,
    description: 'Smart contracts, Web3, and crypto development',
    capabilities: ['blockchain', 'web3', 'solidity', 'smart-contracts'],
    model: 'claude-3-opus',
  },
  {
    id: 'embedded-agent',
    name: 'Embedded Agent',
    module: 'Specialized',
    tier: 'business',
    credits: 25,
    description: 'IoT, firmware, and hardware interfaces',
    capabilities: ['embedded', 'iot', 'firmware', 'hardware', 'rust'],
    model: 'claude-3-opus',
  },
  {
    id: 'game-agent',
    name: 'Game Agent',
    module: 'Specialized',
    tier: 'business',
    credits: 25,
    description: 'Game logic, physics, and AI behaviors',
    capabilities: ['game', 'physics', 'unity', 'unreal', 'game-ai'],
    model: 'claude-3-opus',
  },
];

// Helper functions
export const getAgentsByModule = (module: string) => {
  return AGENTS.filter(agent => agent.module === module);
};

export const getAgentsByTier = (tier: 'free' | 'pro' | 'business') => {
  return AGENTS.filter(agent => agent.tier === tier);
};

export const getAgentById = (id: string) => {
  return AGENTS.find(agent => agent.id === id);
};

export const getTotalCredits = () => {
  return AGENTS.reduce((sum, agent) => sum + agent.credits, 0);
};

export default AGENTS;
