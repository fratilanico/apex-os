/**
 * AI Delegation System Type Definitions
 * 
 * Defines how players direct AI agents:
 * - Natural language commands
 * - Agent assignment evaluation
 * - Feedback quality analysis
 * - Orchestration patterns
 */

export type AIAgent =
  | 'claude'
  | 'cursor'
  | 'gemini'
  | 'dexter'
  | 'pixel'
  | 'maestro';

export type TaskType =
  | 'architecture'      // System design, planning
  | 'implementation'    // Writing code, building
  | 'analysis'          // Understanding patterns
  | 'debugging'         // Finding and fixing errors
  | 'design'            // UI/UX, visual
  | 'orchestration';    // Coordinating others

export interface AgentCapability {
  agent: AIAgent;
  strengths: TaskType[];
  weaknesses: TaskType[];
  specialAbility: string;
  speed: 'slow' | 'medium' | 'fast' | 'instant';
  accuracy: 'variable' | 'good' | 'excellent' | 'perfect';
}

export interface DelegationChoice {
  agent: AIAgent;
  task: string;
  taskType: TaskType;
  reasoning?: string;
  timestamp: string;
}

export interface DelegationResult {
  success: boolean;
  feedback: string;
  score: number;
  reasoning: string;
  optimalAgent?: AIAgent;
  consequences?: string[];
}

export interface FeedbackQuality {
  specificity: number;      // 0-100
  actionability: number;    // 0-100
  clarity: number;          // 0-100
  overall: number;          // Average
  suggestions?: string[];
}

export interface PlayerFeedback {
  targetAgent: AIAgent;
  feedbackText: string;
  context: string;
  quality: FeedbackQuality;
  result: 'improved' | 'unchanged' | 'confused';
}

export interface OrchestrationPattern {
  id: string;
  name: string;
  description: string;
  agents: AIAgent[];
  sequence: Array<{
    agent: AIAgent;
    action: string;
    dependsOn?: number[];
  }>;
  useCase: string;
  complexity: 'simple' | 'moderate' | 'complex' | 'expert';
}

export interface DelegationStats {
  totalDelegations: number;
  successfulDelegations: number;
  successRate: number;
  averageFeedbackQuality: number;
  agentUsageCount: Record<AIAgent, number>;
  optimalChoiceCount: number;
  learningProgress: number;
}

export interface DelegationHint {
  situation: string;
  hint: string;
  bestAgent: AIAgent;
  why: string;
}
