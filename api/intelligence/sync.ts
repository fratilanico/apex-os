import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from '../../lib/supabase';
import { callGemini } from '../_lib/gemini';
import { callPerplexity } from '../_lib/perplexity';

const SCOUT_RESEARCH_PROMPT = `Search the web for the top 5 emerging AI coding tools, libraries, architectural patterns, or frontier model updates released or trending in the last 7 days. 
Focus on technologies relevant to high-velocity development (Vibe Coding), Next.js, AI Agents, and sovereign infrastructure. 
Return a high-fidelity summary including technical impact and implementation details.`;

const SYNC_SYSTEM_PROMPT = `You are the APEX Frontier Scout. Your role is to analyze research data and extract high-signal tool updates into modular "Atomic Intelligence" units.

Your goal is to identify emerging technologies, new model releases, or architectural shifts that should be added to the APEX curriculum.

For each item, generate:
1. Title: The exact tool/concept name.
2. Category: One of (Frontend, Backend, AI, Infra, Mobile, Security).
3. Description: Why this matters for a Developer (1-2 sentences).
4. Logic: Specific technical instruction for an AI agent on how to use or reason about this tool.
5. Tags: 3-4 taxonomy tags (e.g., "Vector DB", "Edge Computing", "LLM").

Respond ONLY with a JSON array of objects.`;

const SYNC_USER_PROMPT_TEMPLATE = (content: string) => `Analyze this research data and extract the top 5 most impactful updates into Atomic Modules:

${content}

Return exactly 5 items in this JSON format:
[
  {
    "title": "...",
    "category": "...",
    "description": "...",
    "logic": "...",
    "tags": ["...", "..."],
    "source_url": "..."
  }
]`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 1. Research via Perplexity (The Brain)
    const researchData = await callPerplexity(
      "You are a Senior Frontier Scout. Provide deep technical research on emerging AI and dev trends.",
      SCOUT_RESEARCH_PROMPT
    );
    
    // 2. Draft via Gemini (The Architect)
    const draftedJson = await callGemini(
      SYNC_SYSTEM_PROMPT,
      SYNC_USER_PROMPT_TEMPLATE(researchData),
      { jsonMode: true, temperature: 0.2 }
    );

    const drafts = JSON.parse(draftedJson);

    // 3. Filter duplicates and save to Supabase
    const savedItems = [];
    for (const draft of drafts) {
      const { data: existing } = await supabase
        .from('frontier_intelligence')
        .select('id')
        .eq('title', draft.title)
        .maybeSingle();

      if (!existing) {
        const { data: inserted, error } = await supabase
          .from('frontier_intelligence')
          .insert({
            title: draft.title,
            description: draft.description,
            logic: draft.logic,
            source_url: draft.source_url || 'https://perplexity.ai',
            category: draft.category,
            tags: draft.tags,
            is_active: false,
            status: 'draft'
          })
          .select()
          .single();

        if (inserted) savedItems.push(inserted);
        if (error) console.error(`Error inserting ${draft.title}:`, error);
      }
    }

    return res.status(200).json({
      success: true,
      processed: drafts.length,
      new_items: savedItems.length,
      items: savedItems,
      research_summary: researchData.slice(0, 500) + '...'
    });

  } catch (error: any) {
    console.error('Sync Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Synchronization failed'
    });
  }
}
