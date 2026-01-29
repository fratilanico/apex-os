import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseServer } from '../../lib/supabaseServer.js';

interface TerminalSessionPayload {
  userId: string;
  mode: string;
  messages: Array<{ role: string; content: string }>;
  lastActiveAt?: number;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    const userId = typeof req.query.userId === 'string' ? req.query.userId : '';
    const mode = typeof req.query.mode === 'string' ? req.query.mode : '';

    if (!userId || !mode) {
      return res.status(400).json({ error: 'userId and mode are required' });
    }

    const { data, error } = await supabaseServer
      .from('terminal_sessions')
      .select('user_id, mode, messages, last_active_at')
      .eq('user_id', userId)
      .eq('mode', mode)
      .maybeSingle();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ session: data ?? null });
  }

  if (req.method === 'POST') {
    const payload = req.body as TerminalSessionPayload;

    if (!payload?.userId || !payload?.mode || !Array.isArray(payload.messages)) {
      return res.status(400).json({ error: 'Invalid payload' });
    }

    const { error } = await supabaseServer
      .from('terminal_sessions')
      .upsert({
        user_id: payload.userId,
        mode: payload.mode,
        messages: payload.messages,
        last_active_at: payload.lastActiveAt ? new Date(payload.lastActiveAt).toISOString() : new Date().toISOString(),
      }, { onConflict: 'user_id,mode' });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
