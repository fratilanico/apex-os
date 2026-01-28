/**
 * POST /api/knowledge/query
 * Semantic search across the knowledge base.
 *
 * Body: { query: string, userId?: string, limit?: number, threshold?: number }
 * Returns: { success: boolean, results: Array<{ chunk, source, similarity }> }
 */

import { supabase } from '../../lib/supabase';
import { embed } from './_lib/embedder';

interface QueryRequest {
  query: string;
  userId?: string;
  limit?: number;
  threshold?: number;
}

interface QueryResult {
  chunk_id: string;
  content: string;
  source_id: string;
  source_title?: string;
  source_type?: string;
  similarity: number;
  metadata: Record<string, unknown>;
}

export default async function handler(
  req: { method?: string; body?: QueryRequest },
  res: { status: (code: number) => { json: (data: unknown) => void } }
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { query, limit = 5, threshold = 0.7 } = req.body || {} as QueryRequest;

  if (!query || query.trim().length === 0) {
    return res.status(400).json({ success: false, error: 'query is required' });
  }

  try {
    // 1. Embed the query
    const queryEmbedding = await embed(query);

    // 2. Semantic search via Supabase RPC
    const { data: results, error } = await supabase.rpc('match_knowledge_chunks', {
      query_embedding: queryEmbedding,
      match_threshold: threshold,
      match_count: limit,
    });

    if (error) {
      throw new Error(`Search failed: ${error.message}`);
    }

    // 3. Enrich with source metadata
    const enriched: QueryResult[] = [];
    for (const result of (results || [])) {
      // Fetch source info
      const { data: source } = await supabase
        .from('ingestion_sources')
        .select('title, source_type, source_url')
        .eq('id', result.source_id)
        .single();

      enriched.push({
        chunk_id: result.id,
        content: result.content,
        source_id: result.source_id,
        source_title: source?.title,
        source_type: source?.source_type,
        similarity: Math.round(result.similarity * 100) / 100,
        metadata: result.metadata || {},
      });
    }

    return res.status(200).json({
      success: true,
      results: enriched,
      query,
      total: enriched.length,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Query failed',
    });
  }
}
