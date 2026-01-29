/**
 * GET /api/knowledge/sources — List all ingested sources
 * DELETE /api/knowledge/sources?id=<sourceId> — Remove a source
 */

import { supabase } from '@/lib/supabase';

export default async function handler(
  req: { method?: string; query?: Record<string, string> },
  res: { status: (code: number) => { json: (data: unknown) => void } }
) {
  if (req.method === 'GET') {
    const { data: sources, error } = await supabase
      .from('ingestion_sources')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ success: false, error: error.message });
    }

    return res.status(200).json({
      success: true,
      sources: sources || [],
      total: (sources || []).length,
    });
  }

  if (req.method === 'DELETE') {
    const sourceId = req.query?.id;
    if (!sourceId) {
      return res.status(400).json({ success: false, error: 'id query param required' });
    }

    // Delete chunks first (cascade should handle this, but explicit is safer)
    await supabase.from('knowledge_chunks').delete().eq('source_id', sourceId);
    
    const { error } = await supabase.from('ingestion_sources').delete().eq('id', sourceId);
    if (error) {
      return res.status(500).json({ success: false, error: error.message });
    }

    return res.status(200).json({ success: true, deleted: sourceId });
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}
