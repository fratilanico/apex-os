/**
 * RLM Learner — Updates procedural memory based on interaction outcomes.
 */

import { supabase } from '../supabase';
import type { AgentId } from '../agents/types';
import { calculateSuccessScore, InteractionOutcome } from './tracker';

const localLearnings = new Map<string, number>();

function getLearningKey(agentId: AgentId, taskType: string): string {
  return `${agentId}:${taskType}`;
}

export async function recordLearning(outcome: InteractionOutcome): Promise<void> {
  const score = calculateSuccessScore(outcome);
  const taskType = outcome.questId || 'general';
  const key = getLearningKey(outcome.agentUsed, taskType);

  // Update local cache (exponential moving average)
  const currentAvg = localLearnings.get(key) || 0.5;
  localLearnings.set(key, (currentAvg + score) / 2);

  // Persist to Supabase (fire-and-forget)
  try {
    await supabase
      .from('agent_learnings')
      .upsert({
        prompt_hash: outcome.promptHash,
        agent_id: outcome.agentUsed,
        task_type: taskType,
        success_score: score,
        sample_count: 1,
        avg_score: score,
        tags: outcome.questId ? [outcome.questId] : [],
      }, { onConflict: 'prompt_hash,agent_id,task_type' });
  } catch (err) {
    // Non-fatal — RLM degrades gracefully
  }
}

export function getAgentScores(taskType: string): Partial<Record<AgentId, number>> {
  const scores: Partial<Record<AgentId, number>> = {};
  const agents: AgentId[] = ['sovereign', 'architect', 'builder', 'scout'];
  for (const agent of agents) {
    const score = localLearnings.get(getLearningKey(agent, taskType));
    if (score !== undefined) scores[agent] = score;
  }
  return scores;
}

export async function initializeLearnings(): Promise<void> {
  try {
    const { data } = await supabase
      .from('agent_learnings')
      .select('agent_id, task_type, avg_score')
      .order('avg_score', { ascending: false })
      .limit(100);

    for (const learning of data || []) {
      const agentId = learning.agent_id as string | undefined;
      const taskType = learning.task_type as string | undefined;
      const avgScore = learning.avg_score as number | undefined;
      if (agentId && taskType && avgScore !== undefined) {
        localLearnings.set(getLearningKey(agentId as AgentId, taskType), avgScore);
      }
    }
  } catch {
    // Non-fatal
  }
}

export function getLearningStats(): {
  totalLearnings: number;
  bestAgent: { agentId: string; avgScore: number } | null;
} {
  const stats = { totalLearnings: localLearnings.size, bestAgent: null as { agentId: string; avgScore: number } | null };
  const agentAverages = new Map<string, { total: number; count: number }>();

  localLearnings.forEach((score, key) => {
    const parts = key.split(':');
    const agentId = parts[0] ?? 'unknown';
    const current = agentAverages.get(agentId) || { total: 0, count: 0 };
    agentAverages.set(agentId, { total: current.total + score, count: current.count + 1 });
  });

  agentAverages.forEach((data, agentId) => {
    const avg = data.total / data.count;
    if (!stats.bestAgent || avg > stats.bestAgent.avgScore) {
      stats.bestAgent = { agentId, avgScore: Math.round(avg * 100) / 100 };
    }
  });

  return stats;
}
