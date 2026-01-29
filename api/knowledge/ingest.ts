/**
 * POST /api/knowledge/ingest
 * Main ingestion endpoint — accepts a source and processes it into knowledge chunks.
 *
 * Body: { type: 'url'|'pdf'|'youtube'|'github'|'notion'|'markdown', source: string, userId?: string }
 * Returns: { success: boolean, sourceId: string, chunkCount: number, title: string }
 */

import { createClient } from '@supabase/supabase-js';

// Use service role key for admin writes (bypasses RLS)
const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || ''
);
import { chunkText } from './_lib/chunker';
import { generateEmbeddings } from './_lib/embedder';
import { parseURL } from './_lib/parsers/url';
import { parseMarkdown } from './_lib/parsers/markdown';
import { parseYouTube } from './_lib/parsers/youtube';
import { parseGitHub } from './_lib/parsers/github';
import { parseNotion } from './_lib/parsers/notion';

interface IngestRequest {
  type: 'url' | 'pdf' | 'youtube' | 'github' | 'notion' | 'markdown';
  source: string;
  userId?: string;
}

interface IngestResponse {
  success: boolean;
  sourceId?: string;
  chunkCount?: number;
  title?: string;
  error?: string;
}

export default async function handler(
  req: { method?: string; body?: IngestRequest },
  res: { status: (code: number) => { json: (data: IngestResponse) => void } }
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { type, source, userId } = req.body || {} as IngestRequest;

  if (!type || !source) {
    return res.status(400).json({ success: false, error: 'type and source are required' });
  }

  // Create source record
  const { data: sourceRecord, error: sourceError } = await supabase
    .from('ingestion_sources')
    .insert({
      user_id: userId || 'anonymous',
      source_type: type,
      source_url: source,
      status: 'processing',
    })
    .select()
    .single();

  if (sourceError || !sourceRecord) {
    return res.status(500).json({ success: false, error: 'Failed to create source record' });
  }

  try {
    // 1. Parse source based on type
    let parsed;
    switch (type) {
      case 'url':
        parsed = await parseURL(source);
        break;
      case 'youtube':
        parsed = await parseYouTube(source);
        break;
      case 'github':
        parsed = await parseGitHub(source);
        break;
      case 'notion':
        parsed = await parseNotion(source);
        break;
      case 'markdown':
        parsed = await parseMarkdown(source);
        break;
      case 'pdf':
        throw new Error('PDF parsing requires file upload — use multipart endpoint');
      default:
        throw new Error(`Unsupported source type: ${type}`);
    }

    // 2. Chunk the content
    const chunks = chunkText(parsed.content, {
      source_id: sourceRecord.id,
      source_type: type,
      title: parsed.title,
      url: parsed.url,
    });

    // 3. Generate embeddings for all chunks
    const chunkTexts = chunks.map(c => c.content);
    const embeddings = await generateEmbeddings(chunkTexts);

    // 4. Store chunks + embeddings in Supabase
    const chunkRecords = chunks.map((chunk, i) => ({
      source_id: sourceRecord.id,
      content: chunk.content,
      embedding: embeddings[i]?.embedding ?? [],
      metadata: chunk.metadata,
      chunk_index: chunk.index,
    }));

    const { error: chunkError } = await supabase
      .from('knowledge_chunks')
      .insert(chunkRecords);

    if (chunkError) {
      throw new Error(`Failed to store chunks: ${chunkError.message}`);
    }

    // 5. Update source status
    await supabase
      .from('ingestion_sources')
      .update({
        status: 'completed',
        title: parsed.title,
        chunk_count: chunks.length,
      })
      .eq('id', sourceRecord.id);

    return res.status(200).json({
      success: true,
      sourceId: sourceRecord.id,
      chunkCount: chunks.length,
      title: parsed.title,
    });

  } catch (error) {
    // Update source to failed
    await supabase
      .from('ingestion_sources')
      .update({
        status: 'failed',
        error_message: error instanceof Error ? error.message : 'Unknown error',
      })
      .eq('id', sourceRecord.id);

    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Ingestion failed',
    });
  }
}
