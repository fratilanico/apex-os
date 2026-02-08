/**
 * APEX OS - Automated Guide Generation API
 * 
 * Serverless function to generate teaching guides from content
 * Integrates with Google Vertex AI (Gemini) + Notion API
 * 
 * Flow: Content → Vertex AI Agent → 3 Guides → Notion Database
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { generateGuides } from '../lib/guide-generator/vertex-ai-generator';
import { publishToNotion } from '../lib/guide-generator/notion-publisher';

interface ContentPayload {
  title: string;
  content: string;
  source: string;
  url: string;
  publishedAt?: string;
  contentType?: 'article' | 'video' | 'tutorial' | 'news';
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Only accept POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify authorization (optional - add your own auth)
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.GUIDE_API_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const payload = req.body as ContentPayload;

    // Validate payload
    if (!payload.title || !payload.content || !payload.source) {
      return res.status(400).json({
        error: 'Missing required fields: title, content, source'
      });
    }

    console.log(`[Guide Generator] Processing: ${payload.title}`);

    // Step 1: Generate guides using Vertex AI
    const guides = await generateGuides(payload);

    console.log(`[Guide Generator] Generated 3 guides for: ${payload.title}`);

    // Step 2: Publish to Notion
    const notionPages = await publishToNotion(payload, guides);

    console.log(`[Guide Generator] Published to Notion: ${notionPages.length} pages`);

    // Return success
    return res.status(200).json({
      success: true,
      source: payload.title,
      guides: {
        howTo: notionPages[0]?.id,
        playGuide: notionPages[1]?.id,
        whyThisWorks: notionPages[2]?.id
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('[Guide Generator] Error:', error);
    return res.status(500).json({
      error: 'Failed to generate guides',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
