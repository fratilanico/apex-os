import type { VercelRequest, VercelResponse } from '@vercel/node';
import { hasSupabaseServerConfig, supabaseServer } from '../lib/supabaseServer';
import { callGemini } from '../lib/server/gemini';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!hasSupabaseServerConfig) {
    return res.status(500).json({ error: 'Supabase server config missing' });
  }

  if (req.method === 'GET') {
    const action = typeof req.query.action === 'string' ? req.query.action : 'summary';
    if (action !== 'summary') {
      return res.status(400).json({ error: 'Unknown action' });
    }

    const [{ data: profiles, error: profilesError }, { data: events, error: eventsError }] = await Promise.all([
      supabaseServer.from('user_profiles').select('user_id, learning_style, speed, engagement_score, completion_rate, pain_points, dropoff_points').limit(50),
      supabaseServer.from('user_events').select('event_type').limit(500),
    ]);

    if (profilesError || eventsError) {
      return res.status(500).json({ error: profilesError?.message || eventsError?.message });
    }

    const eventCounts = (events ?? []).reduce<Record<string, number>>((acc, event) => {
      acc[event.event_type] = (acc[event.event_type] ?? 0) + 1;
      return acc;
    }, {});

    return res.status(200).json({
      profiles: profiles ?? [],
      eventCounts,
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const action = req.body?.action;

  if (action === 'event') {
    const { userId, eventType, payload } = req.body || {};
    if (!userId || !eventType) {
      return res.status(400).json({ error: 'userId and eventType are required' });
    }

    const { error } = await supabaseServer
      .from('user_events')
      .insert({
        user_id: userId,
        event_type: eventType,
        payload: payload ?? {},
      });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ success: true });
  }

  if (action === 'profile') {
    const { userId } = req.body || {};
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const { data: events, error: eventsError } = await supabaseServer
      .from('user_events')
      .select('event_type,payload,created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(200);

    if (eventsError) {
      return res.status(500).json({ error: eventsError.message });
    }

    const prompt = `You are an analytics classifier. Summarize user behavior into a JSON profile.
Return JSON ONLY with keys:
learning_style, speed, pain_points (array), engagement_score (0-100), module_affinity (object), completion_rate (0-1), dropoff_points (array), summary.

Events:\n${JSON.stringify(events ?? [])}`;

    let text = '';
    try {
      text = await callGemini('Return JSON only.', prompt, { jsonMode: true, temperature: 0.2, maxTokens: 1200 });
    } catch (error) {
      console.error('Analytics profile generation failed', error);
      return res.status(500).json({ error: 'Profile generation failed', detail: String(error) });
    }

    let parsed: any;
    try {
      parsed = JSON.parse(text);
    } catch (err) {
      console.error('Analytics profile JSON parse failed', err, text);
      return res.status(500).json({ error: 'Profile JSON parse failed', raw: text });
    }

    const { error: upsertError } = await supabaseServer
      .from('user_profiles')
      .upsert({
        user_id: userId,
        learning_style: parsed.learning_style ?? null,
        speed: parsed.speed ?? null,
        pain_points: parsed.pain_points ?? [],
        engagement_score: parsed.engagement_score ?? 0,
        module_affinity: parsed.module_affinity ?? {},
        completion_rate: parsed.completion_rate ?? 0,
        dropoff_points: parsed.dropoff_points ?? [],
        last_summary: parsed.summary ?? null,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });

    if (upsertError) {
      return res.status(500).json({ error: upsertError.message });
    }

    return res.status(200).json({ success: true, profile: parsed });
  }

  return res.status(400).json({ error: 'Unknown action' });
}
