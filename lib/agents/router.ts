/**
 * Multi-agent task router with RLM-informed decisions.
 */

import { AGENTS, AgentId, TaskType, type RoutingDecision } from './types';

export type { RoutingDecision };

interface RoutingContext {
  taskType?: TaskType;
  query: string;
  contextLength?: number;
  userSkillLevel?: number;
  requiresRealtime?: boolean;
  requiresReasoning?: boolean;
  requiresCode?: boolean;
  pastSuccessData?: Record<string, number>;
}

const TASK_KEYWORDS: Record<TaskType, string[]> = {
  'code-generation': ['write', 'create', 'build', 'implement', 'code', 'function', 'component', 'class', 'api', 'generate'],
  'explanation': ['explain', 'why', 'how does', 'what is', 'understand', 'teach', 'learn', 'concept', 'difference'],
  'search': ['find', 'latest', 'current', 'news', 'trend', 'search', 'who invented', 'when did', 'where is'],
  'debugging': ['fix', 'bug', 'error', 'broken', 'debug', 'crash', 'issue', 'problem', 'not working', 'fails'],
  'quest-completion': ['solve', 'submit', 'complete', 'challenge', 'quest', 'mission'],
  'knowledge-recall': ['recall', 'remember', 'from my notes', 'in my knowledge', 'sources', 'what did i'],
  'strategy': ['plan', 'strategy', 'architecture', 'design', 'approach', 'roadmap', 'structure'],
  'assessment': ['test me', 'quiz', 'assess', 'how well', 'skill check', 'evaluate'],
};

const TASK_AGENT_MAP: Record<TaskType, AgentId[]> = {
  'code-generation': ['builder', 'sovereign'],
  'explanation': ['architect', 'sovereign'],
  'search': ['scout', 'sovereign'],
  'debugging': ['builder', 'architect'],
  'quest-completion': ['builder', 'sovereign'],
  'knowledge-recall': ['sovereign', 'architect'],
  'strategy': ['architect', 'sovereign'],
  'assessment': ['architect', 'sovereign'],
};

function classifyTask(query: string): { taskType: TaskType; confidence: number } {
  const lower = query.toLowerCase();
  let bestMatch: TaskType = 'knowledge-recall';
  let bestScore = 0;

  for (const [taskType, keywords] of Object.entries(TASK_KEYWORDS)) {
    const matchCount = keywords.filter(kw => lower.includes(kw)).length;
    const score = matchCount / keywords.length;
    if (score > bestScore) {
      bestScore = score;
      bestMatch = taskType as TaskType;
    }
  }

  return { taskType: bestMatch, confidence: Math.max(bestScore * 3, 0.4) };
}

export function routeTask(context: RoutingContext): RoutingDecision {
  const { taskType, confidence: classConf } = classifyTask(context.query);
  const resolvedType = context.taskType || taskType;
  const preferredAgents = TASK_AGENT_MAP[resolvedType] || ['sovereign'];

  const scores: Array<{ agentId: AgentId; score: number }> = preferredAgents.map(agentId => {
    let score = 0.5;

    if (context.pastSuccessData?.[agentId]) {
      score += context.pastSuccessData[agentId] * 0.3;
    }
    if (context.contextLength && context.contextLength > AGENTS[agentId].contextWindow) {
      score -= 0.5;
    }
    if (context.requiresRealtime && agentId === 'scout') score += 0.3;
    if (context.requiresReasoning && agentId === 'architect') score += 0.2;
    if (context.requiresCode && agentId === 'builder') score += 0.3;
    if (classConf > 0.7) score -= AGENTS[agentId].costPer1KTokens * 0.1;

    return { agentId, score };
  });

  scores.sort((a, b) => b.score - a.score);

  const best = scores[0] ?? { agentId: 'sovereign' as AgentId, score: 0.5 };

  return {
    agentId: best.agentId,
    confidence: Math.min(best.score, 1.0),
    reasoning: `Task: "${resolvedType}" (conf: ${classConf.toFixed(2)}). Agent: "${best.agentId}" (score: ${best.score.toFixed(2)}).${context.pastSuccessData ? ' RLM-informed.' : ''}`,
    fallbackAgentId: scores[1]?.agentId,
  };
}

export function getAgentSystemPrompt(agentId: AgentId, additionalContext?: string): string {
  let prompt = AGENTS[agentId].systemPrompt;
  if (additionalContext) prompt += `\n\nContext:\n${additionalContext}`;
  return prompt;
}

export function getAgentInfo(agentId: AgentId) {
  return {
    name: AGENTS[agentId].name,
    model: AGENTS[agentId].model,
    description: AGENTS[agentId].description,
    color: ({ sovereign: 'cyan', architect: 'purple', builder: 'emerald', scout: 'amber' } as Record<string, string>)[agentId],
  };
}
