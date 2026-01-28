import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || '';

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.warn('[Supabase] Missing SUPABASE_URL or SUPABASE_KEY — knowledge features disabled');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Type definitions for our schema
export interface KnowledgeChunk {
  id: string;
  source_id: string;
  content: string;
  embedding: number[];
  metadata: Record<string, unknown>;
  chunk_index: number;
  created_at: string;
}

export interface IngestionSource {
  id: string;
  user_id?: string;
  source_type: 'url' | 'pdf' | 'youtube' | 'github' | 'notion' | 'markdown';
  source_url?: string;
  title?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  chunk_count: number;
  error_message?: string;
  created_at: string;
}

export interface KnowledgeEdge {
  id: string;
  source_chunk_id: string;
  target_chunk_id: string;
  relationship_type: 'similar' | 'references' | 'extends' | 'contradicts';
  strength: number;
}

export interface AgentLearning {
  id: string;
  prompt_hash: string;
  agent_id: string;
  task_type: string;
  success_score: number;
  sample_count: number;
  avg_score: number;
  tags: string[];
}

export interface UserSession {
  id: string;
  user_id: string;
  quest_id?: string;
  agent_used?: string;
  started_at: string;
  completed_at?: string;
  xp_earned: number;
  gold_earned: number;
  retry_count: number;
  error_occurred: boolean;
  abandoned: boolean;
  metadata: Record<string, unknown>;
}
