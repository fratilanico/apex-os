/**
 * GET /api/knowledge/sources — List all ingested sources
 * DELETE /api/knowledge/sources?id=<sourceId> — Remove a source
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';
const hasSupabaseConfig = supabaseUrl.length > 0 && supabaseKey.length > 0;

const supabase = hasSupabaseConfig
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export default async function handler(
  req: { method?: string; query?: Record<string, string> },
  res: { status: (code: number) => { json: (data: unknown) => void } }
) {
  if (req.method === 'GET') {
    // Return empty state if Supabase is not configured or table doesn't exist
    if (!supabase) {
      return res.status(200).json({
        success: true,
        sources: [],
        total: 0,
        message: 'Knowledge base not configured. Use "ingest <url>" to add sources once database is set up.',
      });
    }

    const { data: sources, error } = await supabase
      .from('ingestion_sources')
      .select('*')
      .order('created_at', { ascending: false });

    // If table doesn't exist, return empty state gracefully
    if (error) {
      if (error.message.includes('does not exist') || error.message.includes('schema cache')) {
        return res.status(200).json({
          success: true,
          sources: [],
          total: 0,
          message: 'Knowledge base tables not initialized. Run schema.sql in Supabase to enable.',
        });
      }
      return res.status(500).json({ success: false, error: error.message });
    }

    return res.status(200).json({
      success: true,
      sources: sources || [],
      total: (sources || []).length,
    });
  }

  if (req.method === 'DELETE') {
    if (!supabase) {
      return res.status(400).json({ success: false, error: 'Knowledge base not configured' });
    }

    const sourceId = req.query?.id;
    if (!sourceId) {
      return res.status(400).json({ success: false, error: 'id query param required' });
    }

    // Delete chunks first (cascade should handle this, but explicit is safer)
    await supabase.from('knowledge_chunks').delete().eq('source_id', sourceId);

    const { error } = await supabase.from('ingestion_sources').delete().eq('id', sourceId);
    if (error) {
      if (error.message.includes('does not exist') || error.message.includes('schema cache')) {
        return res.status(400).json({ success: false, error: 'Knowledge base tables not initialized' });
      }
      return res.status(500).json({ success: false, error: error.message });
    }

    return res.status(200).json({ success: true, deleted: sourceId });
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}
