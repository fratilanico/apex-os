/**
 * RLM Retriever — Fetches relevant memories for routing decisions.
 */

import { supabase } from '@/lib/supabase';
import type { AgentId } from '../agents/types';
import { getAgentScores } from './learner';

export interface RelevantMemory {
  type: 'knowledge' | 'strategy' | 'episodic';
  content: string;
  relevance: number;
  agentId?: AgentId;
  metadata: Record<string, unknown>;
}

export async function retrieveMemories(
  queryEmbedding: number[],
  taskType: string,
  limit: number = 5
): Promise<RelevantMemory[]> {
  const memories: RelevantMemory[] = [];

  // Knowledge retrieval
  try {
    const { data: chunks } = await supabase.rpc('match_knowledge_chunks', {
      query_embedding: queryEmbedding,
      match_threshold: 0.7,
      match_count: Math.ceil(limit * 0.6),
    });
    for (const chunk of chunks || []) {
      memories.push({
        type: 'knowledge',
        content: chunk.content,
        relevance: chunk.similarity,
        metadata: { source_id: chunk.source_id, ...chunk.metadata },
      });
    }
  } catch {
    // Degrade gracefully
  }

  // Strategy retrieval
  try {
    const { data: learnings } = await supabase
      .from('agent_learnings')
      .select('agent_id, task_type, avg_score, prompt_hash, tags')
      .eq('task_type', taskType)
      .order('avg_score', { ascending: false })
      .limit(Math.ceil(limit * 0.3));

    for (const learning of learnings || []) {
      memories.push({
        type: 'strategy',
        content: `Agent "${learning.agent_id}" scored ${learning.avg_score.toFixed(2)} on "${learning.task_type}"`,
        relevance: learning.avg_score,
        agentId: learning.agent_id as AgentId,
        metadata: { prompt_hash: learning.prompt_hash, tags: learning.tags },
      });
    }
  } catch {
    // Degrade gracefully
  }

  // Episodic retrieval
  try {
    const { data: sessions } = await supabase
      .from('user_sessions')
      .select('quest_id, agent_used, xp_earned, retry_count, completed_at')
      .eq('quest_id', taskType)
      .order('completed_at', { ascending: false })
      .limit(Math.ceil(limit * 0.1));

    for (const session of sessions || []) {
      if (session.completed_at) {
        memories.push({
          type: 'episodic',
          content: `Completed "${session.quest_id}" using ${session.agent_used}, earned ${session.xp_earned} XP`,
          relevance: 0.5,
          agentId: session.agent_used as AgentId,
          metadata: { quest_id: session.quest_id },
        });
      }
    }
  } catch {
    // Degrade gracefully
  }

  memories.sort((a, b) => b.relevance - a.relevance);
  return memories.slice(0, limit);
}

export function getRoutingMemory(taskType: string): Partial<Record<AgentId, number>> {
  return getAgentScores(taskType);
}

export function formatMemoriesAsContext(memories: RelevantMemory[]): string {
  if (memories.length === 0) return '';
  let context = '=== RETRIEVED CONTEXT ===\n\n';

  const knowledge = memories.filter(m => m.type === 'knowledge');
  const strategy = memories.filter(m => m.type === 'strategy');
  const episodic = memories.filter(m => m.type === 'episodic');

  if (knowledge.length > 0) {
    context += '--- Knowledge Base ---\n';
    knowledge.forEach((m, i) => { context += `[${i + 1}] (${m.relevance.toFixed(2)})\n${m.content}\n\n`; });
  }
  if (strategy.length > 0) {
    context += '--- Past Strategies ---\n';
    strategy.forEach(m => { context += `• ${m.content}\n`; });
    context += '\n';
  }
  if (episodic.length > 0) {
    context += '--- Your History ---\n';
    episodic.forEach(m => { context += `• ${m.content}\n`; });
    context += '\n';
  }

  context += '=== END CONTEXT ===\n';
  return context;
}
