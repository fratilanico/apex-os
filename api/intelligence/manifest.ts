import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from '@/lib/supabase';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { id } = req.body;
  if (!id) return res.status(400).json({ error: 'ID required' });

  // Update status to manifested and ensure it's active
  const { data, error } = await supabase
    .from('frontier_intelligence')
    .update({ 
      status: 'manifested',
      is_active: true,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });

  // Return the data so the UI can create the Matrix node
  return res.status(200).json({ 
    success: true, 
    item: data,
    nodeProposal: {
      id: `intel-${data.id.slice(0, 8)}`,
      label: data.title,
      type: 'AGENT_LOGIC',
      status: 'discovered',
      progress: 0,
      category: data.category
    }
  });
}
