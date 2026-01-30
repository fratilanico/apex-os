import type { VercelRequest, VercelResponse } from '@vercel/node';
import { hasSupabaseServerConfig, supabaseServer } from '../../lib/supabaseServer.js';
import type { Module } from '../../types/curriculum';

const ADMIN_PASSWORD = process.env.ADMIN_DASH_PASSWORD ?? '';

// Fallback modules when database table doesn't exist
const FALLBACK_MODULES: Module[] = [
  {
    id: 'mod-01',
    number: '01',
    title: 'The Environment',
    subtitle: 'Setting up your AI development stack',
    duration: '2 hours',
    objective: 'Configure Cursor, API keys, and understand context windows',
    icon: 'terminal',
    sections: [],
    keyTakeaways: ['Install Cursor IDE', 'Configure API keys', 'Understand token limits'],
  },
  {
    id: 'mod-02',
    number: '02',
    title: 'Prompt Engineering',
    subtitle: 'From chatting to specifying',
    duration: '3 hours',
    objective: 'Write prompts that result in production-grade code',
    icon: 'code',
    sections: [],
    keyTakeaways: ['Specification-driven prompts', 'Context injection', 'Iterative refinement'],
  },
  {
    id: 'mod-03',
    number: '03',
    title: 'Agent Orchestration',
    subtitle: 'Multi-agent systems',
    duration: '4 hours',
    objective: 'Build loops that make agents work together',
    icon: 'cpu',
    sections: [],
    keyTakeaways: ['Agent routing', 'Task decomposition', 'Verification loops'],
  },
];

const sanitizeModule = (module: Module, index: number) => ({
  id: module.id,
  number: module.number,
  title: module.title,
  subtitle: module.subtitle,
  duration: module.duration,
  objective: module.objective,
  icon: module.icon,
  sections: module.sections,
  key_takeaways: module.keyTakeaways ?? [],
  sort_order: index,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    // Return fallback data if Supabase is not configured
    if (!hasSupabaseServerConfig) {
      console.warn('Supabase not configured - returning fallback curriculum modules');
      return res.status(200).json({ modules: FALLBACK_MODULES, source: 'fallback' });
    }

    const { data, error } = await supabaseServer
      .from('curriculum_modules')
      .select('*')
      .order('sort_order', { ascending: true });

    // If table doesn't exist or other error, return fallback data
    if (error) {
      console.warn('Supabase error loading curriculum modules, using fallback:', error.message);
      return res.status(200).json({ modules: FALLBACK_MODULES, source: 'fallback' });
    }

    // If no data in table, return fallback
    if (!data || data.length === 0) {
      return res.status(200).json({ modules: FALLBACK_MODULES, source: 'fallback' });
    }

    const modules = data.map((row) => ({
      id: row.id,
      number: row.number,
      title: row.title,
      subtitle: row.subtitle,
      duration: row.duration,
      objective: row.objective,
      icon: row.icon,
      sections: row.sections ?? [],
      keyTakeaways: row.key_takeaways ?? [],
    }));

    return res.status(200).json({ modules, source: 'database' });
  }

  if (req.method === 'POST') {
    if (!hasSupabaseServerConfig) {
      console.error('Supabase server config missing for curriculum modules');
      return res.status(500).json({ error: 'Supabase server config missing' });
    }

    const { adminPassword, modules } = req.body || {};

    if (!ADMIN_PASSWORD || adminPassword !== ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!Array.isArray(modules)) {
      return res.status(400).json({ error: 'Modules array is required' });
    }

    const payload = modules.map((module: Module, index: number) => sanitizeModule(module, index));

    const { error } = await supabaseServer
      .from('curriculum_modules')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
