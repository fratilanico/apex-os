import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  AIAgent,
  TaskType,
  DelegationChoice,
  DelegationResult,
  FeedbackQuality,
  PlayerFeedback,
  DelegationStats,
  AgentCapability,
} from '../types/delegation';

interface DelegationStoreState {
  // State
  delegationHistory: DelegationChoice[];
  feedbackHistory: PlayerFeedback[];
  stats: DelegationStats;
  agentCapabilities: Record<AIAgent, AgentCapability>;
  
  // Actions
  recordDelegation: (choice: DelegationChoice, result: DelegationResult) => void;
  recordFeedback: (feedback: PlayerFeedback) => void;
  evaluateDelegation: (agent: AIAgent, taskType: TaskType) => DelegationResult;
  analyzeFeedback: (feedbackText: string) => FeedbackQuality;
  
  // Queries
  getAgentStats: (agent: AIAgent) => {
    usageCount: number;
    successRate: number;
    optimalUsageRate: number;
  };
  getRecommendedAgent: (taskType: TaskType) => AIAgent;
  getLearningProgress: () => number;
  
  // Data management
  registerAgentCapabilities: (capabilities: AgentCapability[]) => void;
  
  // Reset
  resetStats: () => void;
}

const initialStats: DelegationStats = {
  totalDelegations: 0,
  successfulDelegations: 0,
  successRate: 0,
  averageFeedbackQuality: 0,
  agentUsageCount: {
    claude: 0,
    cursor: 0,
    gemini: 0,
    dexter: 0,
    pixel: 0,
    maestro: 0,
  },
  optimalChoiceCount: 0,
  learningProgress: 0,
};

export const useDelegationStore = create<DelegationStoreState>()(
  persist(
    (set, get) => ({
      // Initial State
      delegationHistory: [],
      feedbackHistory: [],
      stats: initialStats,
      agentCapabilities: {} as Record<AIAgent, AgentCapability>,
      
      // Actions
      recordDelegation: (choice: DelegationChoice, result: DelegationResult) => {
        const { stats, delegationHistory } = get();
        
        // Update history
        set({
          delegationHistory: [...delegationHistory, choice],
        });
        
        // Update stats
        const newStats = {
          ...stats,
          totalDelegations: stats.totalDelegations + 1,
          successfulDelegations: result.success
            ? stats.successfulDelegations + 1
            : stats.successfulDelegations,
          agentUsageCount: {
            ...stats.agentUsageCount,
            [choice.agent]: stats.agentUsageCount[choice.agent] + 1,
          },
          optimalChoiceCount: result.optimalAgent === choice.agent
            ? stats.optimalChoiceCount + 1
            : stats.optimalChoiceCount,
        };
        
        newStats.successRate = newStats.totalDelegations > 0
          ? (newStats.successfulDelegations / newStats.totalDelegations) * 100
          : 0;
        
        // Calculate learning progress (0-100)
        // Based on success rate and optimal choice rate
        const optimalRate = newStats.totalDelegations > 0
          ? (newStats.optimalChoiceCount / newStats.totalDelegations) * 100
          : 0;
        
        newStats.learningProgress = (newStats.successRate + optimalRate) / 2;
        
        set({ stats: newStats });
      },
      
      recordFeedback: (feedback: PlayerFeedback) => {
        const { feedbackHistory, stats } = get();
        
        set({
          feedbackHistory: [...feedbackHistory, feedback],
        });
        
        // Update average feedback quality
        const allQualities = [...feedbackHistory, feedback].map(f => f.quality.overall);
        const avgQuality = allQualities.reduce((a, b) => a + b, 0) / allQualities.length;
        
        set({
          stats: {
            ...stats,
            averageFeedbackQuality: avgQuality,
          },
        });
      },
      
      evaluateDelegation: (agent: AIAgent, taskType: TaskType) => {
        const { agentCapabilities } = get();
        const capability = agentCapabilities[agent];
        
        if (!capability) {
          return {
            success: false,
            feedback: 'Agent not available',
            score: 0,
            reasoning: 'Unknown agent',
          };
        }
        
        // Check if agent is strong in this task type
        const isOptimal = capability.strengths.includes(taskType);
        const isWeak = capability.weaknesses.includes(taskType);
        
        let score = 50; // Base score
        
        if (isOptimal) {
          score += 40;
        } else if (isWeak) {
          score -= 30;
        }
        
        // Add speed modifier
        const speedBonus = { instant: 10, fast: 5, medium: 0, slow: -5 }[capability.speed];
        score += speedBonus;
        
        const success = score >= 60;
        
        return {
          success,
          feedback: isOptimal
            ? `Great choice! ${agent} excels at ${taskType}.`
            : isWeak
            ? `Not ideal. ${agent} struggles with ${taskType}. Consider ${get().getRecommendedAgent(taskType)}.`
            : `Acceptable. ${agent} can handle ${taskType}, but it's not their specialty.`,
          score,
          reasoning: isOptimal
            ? `${agent}'s strengths align perfectly with this task.`
            : isWeak
            ? `This task plays to ${agent}'s weaknesses.`
            : `${agent} is capable but not specialized for this.`,
          optimalAgent: get().getRecommendedAgent(taskType),
        };
      },
      
      analyzeFeedback: (feedbackText: string) => {
        // Simple heuristic analysis
        const text = feedbackText.toLowerCase();
        const words = text.split(/\s+/);
        
        // Specificity: Mentions specific details, numbers, colors, etc.
        const specificWords = ['should', 'must', 'needs', 'requires', 'exactly', 'px', '#', 'rgb', 'margin', 'padding'];
        const specificityCount = specificWords.filter(w => text.includes(w)).length;
        const specificity = Math.min(100, (specificityCount / 3) * 100);
        
        // Actionability: Uses action verbs and clear direction
        const actionVerbs = ['change', 'update', 'fix', 'add', 'remove', 'modify', 'adjust', 'increase', 'decrease'];
        const actionabilityCount = actionVerbs.filter(v => text.includes(v)).length;
        const actionability = Math.min(100, (actionabilityCount / 2) * 100);
        
        // Clarity: Not too short, not too vague
        const isNotVague = !['better', 'good', 'bad', 'wrong', 'fix it', 'looks bad'].some(v => text === v);
        const hasEnoughWords = words.length >= 5;
        const clarity = (isNotVague && hasEnoughWords) ? 80 : 40;
        
        const overall = (specificity + actionability + clarity) / 3;
        
        const suggestions: string[] = [];
        
        if (specificity < 50) {
          suggestions.push('Be more specific. Use exact values, colors, or measurements.');
        }
        if (actionability < 50) {
          suggestions.push('Use clear action verbs. Tell the AI exactly what to change.');
        }
        if (clarity < 50) {
          suggestions.push('Provide more context. Explain the desired outcome.');
        }
        
        return {
          specificity,
          actionability,
          clarity,
          overall,
          suggestions,
        };
      },
      
      // Queries
      getAgentStats: (agent: AIAgent) => {
        const { delegationHistory, stats } = get();
        
        const agentDelegations = delegationHistory.filter(d => d.agent === agent);
        const usageCount = agentDelegations.length;
        
        // Calculate success rate (would need to track results)
        // For now, use overall success rate as approximation
        const successRate = stats.successRate;
        
        // Optimal usage rate
        const optimalUsageRate = usageCount > 0
          ? (agentDelegations.filter(d => d.reasoning).length / usageCount) * 100
          : 0;
        
        return {
          usageCount,
          successRate,
          optimalUsageRate,
        };
      },
      
      getRecommendedAgent: (taskType: TaskType) => {
        const { agentCapabilities } = get();
        
        // Find agents that excel at this task
        const optimalAgents = Object.values(agentCapabilities).filter(
          cap => cap.strengths.includes(taskType)
        );
        
        if (optimalAgents.length === 0) {
          // Default recommendations by task type
          const defaults: Record<TaskType, AIAgent> = {
            architecture: 'claude',
            implementation: 'cursor',
            analysis: 'gemini',
            debugging: 'dexter',
            design: 'pixel',
            orchestration: 'maestro',
          };
          return defaults[taskType] || 'claude';
        }
        
        // Return the first optimal agent (could be randomized or based on availability)
        return optimalAgents[0]?.agent || 'claude';
      },
      
      getLearningProgress: () => {
        return get().stats.learningProgress;
      },
      
      // Data Management
      registerAgentCapabilities: (capabilities: AgentCapability[]) => {
        const capabilityMap = capabilities.reduce((acc, cap) => {
          acc[cap.agent] = cap;
          return acc;
        }, {} as Record<AIAgent, AgentCapability>);
        
        set({ agentCapabilities: capabilityMap });
      },
      
      // Reset
      resetStats: () => {
        set({
          delegationHistory: [],
          feedbackHistory: [],
          stats: initialStats,
        });
      },
    }),
    {
      name: 'apex-delegation-storage',
      version: 1,
      partialize: (state) => ({
        delegationHistory: state.delegationHistory.slice(-100), // Keep last 100
        feedbackHistory: state.feedbackHistory.slice(-50), // Keep last 50
        stats: state.stats,
        // Don't persist agentCapabilities - loaded from content files
      }),
    }
  )
);
