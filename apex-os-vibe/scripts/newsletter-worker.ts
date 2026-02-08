import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import axios from 'axios';
dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VIBE_MARKETING_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.VIBE_MARKETING_SUPABASE_SERVICE_KEY;
const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY || !PERPLEXITY_API_KEY) {
  console.error('Environment variables missing (Supabase or Perplexity)');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function processHighSignalContent() {
  console.log('🤖 APEX OS Content Worker - Running...');

  // 1. Fetch High-Priority Sources
  const { data: sources, error: sourceError } = await supabase
    .from('content_sources')
    .select('*')
    .eq('status', 'active');

  if (sourceError) throw sourceError;

  for (const source of sources) {
    console.log(`📡 Ingesting: ${source.name}`);
    
    // Trigger Ingestion
    try {
      const ingestResponse = await axios.post('http://localhost:3000/api/content/rss/ingest', {
        source_id: source.id,
        url: source.url
      });
      console.log(`✅ Ingested ${ingestResponse.data.results.inserted} new items from ${source.name}`);
    } catch (e: any) {
      console.error(`❌ Ingestion failed for ${source.name}:`, e.message);
    }
  }

  // 2. Process New Items with Perplexity (Sovereign Narrative)
  const { data: newItems, error: itemError } = await supabase
    .from('content_items')
    .select('*')
    .eq('status', 'new')
    .limit(10); // Batch process

  if (itemError) throw itemError;

  for (const item of newItems) {
    console.log(`🧠 Orchestrating Narrative for: ${item.title}`);

    try {
      const response = await axios.post('https://api.perplexity.ai/chat/completions', {
        model: 'sonar-pro',
        messages: [
          { 
            role: 'system', 
            content: 'You are an APEX OS Sovereign Analyst. Analyze the following news item. Provide a summary in high-conviction "Sovereign Mandate" style. Highlight the technical arbitrage and the competitive moat implications. Return JSON.' 
          },
          { 
            role: 'user', 
            content: `Analyze this: ${item.title}\n\n${item.content}` 
          }
        ],
        response_format: { 
          type: 'json_schema', 
          json_schema: {
            name: 'sovereign_analysis',
            schema: {
              type: 'object',
              properties: {
                summary: { type: 'string' },
                arbitrage: { type: 'string' },
                moat_score: { type: 'number' },
                is_newsletter_worthy: { type: 'boolean' }
              },
              required: ['summary', 'arbitrage', 'moat_score', 'is_newsletter_worthy']
            }
          }
        }
      }, {
        headers: { 'Authorization': `Bearer ${PERPLEXITY_API_KEY}` }
      });

      const analysis = JSON.parse(response.data.choices[0].message.content);

      // 3. Update Item with Analysis
      await supabase.from('content_items').update({
        raw_data: { ...item.raw_data, sovereign_analysis: analysis },
        status: analysis.is_newsletter_worthy ? 'curated' : 'scored',
        ai_score: analysis.moat_score * 10
      }).eq('id', item.id);

      console.log(`✨ Curated: ${item.title} (Score: ${analysis.moat_score * 10})`);
    } catch (e: any) {
      console.error(`❌ Analysis failed for ${item.title}:`, e.message);
    }
  }
}

// Run every 4 hours
setInterval(processHighSignalContent, 4 * 60 * 60 * 1000);
processHighSignalContent();
