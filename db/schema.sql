-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA public;

-- Knowledge chunks (vector store for ingested content)
CREATE TABLE IF NOT EXISTS public.knowledge_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID REFERENCES public.ingestion_sources(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  embedding vector(1536) NOT NULL,  -- OpenAI text-embedding-3-small dimension
  metadata JSONB DEFAULT '{}',
  chunk_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ingestion sources (track what has been ingested)
CREATE TABLE IF NOT EXISTS public.ingestion_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT,  -- optional user scoping
  source_type TEXT NOT NULL CHECK (source_type IN ('url', 'pdf', 'youtube', 'github', 'notion', 'markdown')),
  source_url TEXT,
  title TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  chunk_count INTEGER DEFAULT 0,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Knowledge graph edges (relationships between chunks)
CREATE TABLE IF NOT EXISTS public.knowledge_edges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_chunk_id UUID REFERENCES public.knowledge_chunks(id) ON DELETE CASCADE,
  target_chunk_id UUID REFERENCES public.knowledge_chunks(id) ON DELETE CASCADE,
  relationship_type TEXT DEFAULT 'similar' CHECK (relationship_type IN ('similar', 'references', 'extends', 'contradicts')),
  strength FLOAT DEFAULT 0.0 CHECK (strength BETWEEN 0 AND 1),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(source_chunk_id, target_chunk_id)
);

-- User sessions (episodic memory)
CREATE TABLE IF NOT EXISTS public.user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  quest_id TEXT,
  agent_used TEXT,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  xp_earned INTEGER DEFAULT 0,
  gold_earned INTEGER DEFAULT 0,
  retry_count INTEGER DEFAULT 0,
  error_occurred BOOLEAN DEFAULT FALSE,
  abandoned BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}'
);

-- Agent learnings (procedural memory for RLM)
CREATE TABLE IF NOT EXISTS public.agent_learnings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt_hash TEXT NOT NULL,
  agent_id TEXT NOT NULL,
  task_type TEXT NOT NULL,
  success_score FLOAT DEFAULT 0.0,
  sample_count INTEGER DEFAULT 1,
  avg_score FLOAT DEFAULT 0.0,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(prompt_hash, agent_id, task_type)
);

-- Similarity search function
CREATE OR REPLACE FUNCTION public.match_knowledge_chunks(
  query_embedding vector(1536),
  match_threshold FLOAT DEFAULT 0.75,
  match_count INTEGER DEFAULT 10
)
RETURNS TABLE (
  id UUID,
  content TEXT,
  source_id UUID,
  metadata JSONB,
  similarity FLOAT
)
AS $$
  SELECT
    kc.id,
    kc.content,
    kc.source_id,
    kc.metadata,
    1 - (kc.embedding <=> query_embedding) AS similarity
  FROM public.knowledge_chunks kc
  WHERE 1 - (kc.embedding <=> query_embedding) > match_threshold
  ORDER BY kc.embedding <=> query_embedding
  LIMIT match_count;
$$ LANGUAGE SQL IMMUTABLE;

-- Index for fast vector search
CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_embedding
  ON public.knowledge_chunks USING hnsw (embedding vector_cosine_ops);

-- Index for user sessions
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id
  ON public.user_sessions(user_id);

-- Index for agent learnings
CREATE INDEX IF NOT EXISTS idx_agent_learnings_task_type
  ON public.agent_learnings(task_type);
