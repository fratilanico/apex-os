/**
 * APEX OS - Notion Publisher
 * 
 * Publishes generated guides to Notion Content Library database
 */

import { Client } from '@notionhq/client';
import type { GeneratedGuides } from './vertex-ai-generator';

interface ContentPayload {
  title: string;
  content: string;
  source: string;
  url: string;
  publishedAt?: string;
  contentType?: string;
}

// Initialize Notion client
const notion = new Client({
  auth: process.env.NOTION_TOKEN
});

const DATABASE_ID = process.env.NOTION_CONTENT_LIBRARY_ID || '';

export async function publishToNotion(
  payload: ContentPayload,
  guides: GeneratedGuides
): Promise<Array<{ id: string; url: string }>> {
  
  if (!DATABASE_ID) {
    throw new Error('NOTION_CONTENT_LIBRARY_ID not configured');
  }

  const guideTypes = [
    { name: 'How-To Guide', content: guides.howTo, emoji: '🛠️' },
    { name: 'Play Guide', content: guides.playGuide, emoji: '🎮' },
    { name: 'Why This Works', content: guides.whyThisWorks, emoji: '🧠' }
  ];

  const createdPages: Array<{ id: string; url: string }> = [];

  for (const guide of guideTypes) {
    try {
      const page = await notion.pages.create({
        parent: { database_id: DATABASE_ID },
        icon: { 
          type: 'emoji' as const,
          emoji: guide.emoji as any
        },
        properties: {
          'Title': {
            title: [{ 
              text: { content: `${guide.name}: ${payload.title}` }
            }]
          },
          'Source': { 
            select: { name: payload.source }
          },
          'Source URL': { 
            url: payload.url 
          },
          'Content Type': { 
            select: { name: guide.name }
          },
          'Status': { 
            select: { name: 'Review Needed' }
          },
          'Tags': {
            multi_select: guides.suggestedTags.map(tag => ({ name: tag }))
          },
          'Date Ingested': { 
            date: { start: new Date().toISOString().split('T')[0] }
          },
          'Quality Score': {
            number: null // To be filled by human review
          }
        },
        children: convertMarkdownToNotionBlocks(guide.content)
      });

      createdPages.push({
        id: page.id,
        url: `https://notion.so/${page.id.replace(/-/g, '')}`
      });

      console.log(`[Notion] Published ${guide.name}: notion.so/${page.id}`);

    } catch (error) {
      console.error(`[Notion] Failed to publish ${guide.name}:`, error);
      throw error;
    }
  }

  return createdPages;
}

/**
 * Convert markdown to Notion blocks
 * Supports: headings, paragraphs, code blocks, lists
 */
function convertMarkdownToNotionBlocks(markdown: string): any[] {
  const lines = markdown.split('\n');
  const blocks: any[] = [];
  let codeBlock: string[] = [];
  let inCodeBlock = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Code blocks
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        // End code block
        blocks.push({
          object: 'block',
          type: 'code',
          code: {
            rich_text: [{ text: { content: codeBlock.join('\n') }}],
            language: 'javascript'
          }
        });
        codeBlock = [];
        inCodeBlock = false;
      } else {
        // Start code block
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlock.push(line);
      continue;
    }

    // Headings
    if (line.startsWith('### ')) {
      blocks.push({
        object: 'block',
        type: 'heading_3',
        heading_3: { 
          rich_text: [{ text: { content: line.replace('### ', '') }}]
        }
      });
      continue;
    }

    if (line.startsWith('## ')) {
      blocks.push({
        object: 'block',
        type: 'heading_2',
        heading_2: { 
          rich_text: [{ text: { content: line.replace('## ', '') }}]
        }
      });
      continue;
    }

    if (line.startsWith('# ')) {
      blocks.push({
        object: 'block',
        type: 'heading_1',
        heading_1: { 
          rich_text: [{ text: { content: line.replace('# ', '') }}]
        }
      });
      continue;
    }

    // Bullet lists
    if (line.startsWith('- ')) {
      blocks.push({
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: [{ text: { content: line.replace('- ', '') }}]
        }
      });
      continue;
    }

    // Numbered lists
    if (/^\d+\.\s/.test(line)) {
      blocks.push({
        object: 'block',
        type: 'numbered_list_item',
        numbered_list_item: {
          rich_text: [{ text: { content: line.replace(/^\d+\.\s/, '') }}]
        }
      });
      continue;
    }

    // Paragraphs (skip empty lines)
    if (line.trim() !== '') {
      blocks.push({
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [{ text: { content: line }}]
        }
      });
    }
  }

  return blocks;
}
