import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VIBE_MARKETING_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.VIBE_MARKETING_SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Supabase config missing');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const sources = [
  { name: 'VentureBeat AI', url: 'https://venturebeat.com/category/ai/feed/', category: 'ai-business', priority: 'high' },
  { name: 'OpenAI Blog', url: 'https://openai.com/news/rss.xml', category: 'ai', priority: 'high' },
  { name: 'Dev.to AI', url: 'https://dev.to/feed/tag/ai', category: 'webdev', priority: 'medium' },
  { name: 'MarkTechPost', url: 'https://www.marktechpost.com/feed/', category: 'ai', priority: 'medium' },
  { name: 'Hacker News Show', url: 'https://news.ycombinator.com/showrss', category: 'tech', priority: 'medium' },
  { name: 'Next.js Releases', url: 'https://github.com/vercel/next.js/releases.atom', category: 'javascript', priority: 'high' }
];

async function seed() {
  console.log('🚀 Seeding High-Signal Sources...');
  for (const s of sources) {
    const { data: existing } = await supabase
      .from('content_sources')
      .select('id')
      .eq('url', s.url)
      .maybeSingle();

    if (existing) {
      console.log(`- Skipping ${s.name} (exists)`);
      continue;
    }

    const { error } = await supabase.from('content_sources').insert({
      ...s,
      type: 'rss',
      status: 'active',
      config: { fetch_limit: 20, ai_analysis: true }
    });

    if (error) console.error(`❌ Error seeding ${s.name}:`, error.message);
    else console.log(`✅ Seeded ${s.name}`);
  }
}

seed();
