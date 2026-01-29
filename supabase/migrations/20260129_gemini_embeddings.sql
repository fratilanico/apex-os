-- Migration: Switch from OpenAI (1536) to Gemini (768) embeddings

-- 1. Drop existing index (required before altering column)
DROP INDEX IF EXISTS idx_knowledge_chunks_embedding;

-- 2. Alter the embedding column dimension
ALTER TABLE public.knowledge_chunks
  ALTER COLUMN embedding TYPE vector(768);

-- 3. Update the similarity search function
CREATE OR REPLACE FUNCTION public.match_knowledge_chunks(
  query_embedding vector(768),
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

-- 4. Recreate the HNSW index for fast vector search
CREATE INDEX idx_knowledge_chunks_embedding
  ON public.knowledge_chunks USING hnsw (embedding vector_cosine_ops);
