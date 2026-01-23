import Parser from 'rss-parser';
import crypto from 'crypto';
import { DigestData, DigestItem, Source } from './types';
import { KEYWORD_BOOSTS } from './constants';

const parser = new Parser({
  timeout: 5000,
});

function generateId(url: string): string {
  return crypto.createHash('sha256').update(url).digest('hex');
}

function calculateScore(item: any, source: Source): number {
  let score = 0;
  const text = `${item.title} ${item.contentSnippet || ''}`.toLowerCase();

  // 1. Recency Boost (items from last 24h get max boost)
  const now = new Date().getTime();
  const pubDate = item.pubDate ? new Date(item.pubDate).getTime() : now;
  const hoursOld = (now - pubDate) / (1000 * 60 * 60);
  
  if (hoursOld < 24) score += 20;
  else if (hoursOld < 48) score += 10;
  
  // 2. Source Weight
  score += (source.weight * 10);

  // 3. Keyword Boosts
  Object.entries(KEYWORD_BOOSTS).forEach(([keyword, boost]) => {
    if (text.includes(keyword)) score += boost;
  });

  return Math.round(score);
}

export async function processFeeds(sources: Source[], windowStart: Date): Promise<DigestItem[]> {
  const items: DigestItem[] = [];
  const seenUrls = new Set<string>();

  const activeSources = sources.filter(s => s.active);

  const results = await Promise.allSettled(
    activeSources.map(async (source) => {
      try {
        const feed = await parser.parseURL(source.feed_url);
        
        const validItems = feed.items.filter(item => {
          const pubDate = item.pubDate ? new Date(item.pubDate) : new Date();
          return pubDate >= windowStart;
        });

        return validItems.map(feedItem => {
          const url = feedItem.link || '';
          
          // Dedupe by URL immediately
          if (seenUrls.has(url)) return null;
          seenUrls.add(url);

          const digestItem: DigestItem = {
            id: generateId(url),
            title: feedItem.title || 'Untitled',
            url: url,
            source_id: source.id,
            source_name: source.name,
            published_at: feedItem.pubDate || new Date().toISOString(),
            topics: [source.topic],
            tags: [], // Could implement tag extraction here
            summary_hint: (feedItem.contentSnippet || feedItem.content || '').substring(0, 200) + '...',
            score: calculateScore(feedItem, source),
            status: 'new',
            image: null // Parser might extract image from enclosure/content
          };
          return digestItem;
        }).filter(Boolean) as DigestItem[];

      } catch (err) {
        console.error(`Failed to parse ${source.name}:`, err);
        return [];
      }
    })
  );

  results.forEach(result => {
    if (result.status === 'fulfilled') {
      items.push(...result.value);
    }
  });

  // Sort by score desc, then date desc
  return items.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return new Date(b.published_at!).getTime() - new Date(a.published_at!).getTime();
  });
}
