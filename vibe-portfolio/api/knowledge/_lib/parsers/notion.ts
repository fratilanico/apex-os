/**
 * Notion page parser.
 * Extracts content from Notion pages via the Notion API.
 */

import { ParsedSource } from './url';

const NOTION_TOKEN = process.env.NOTION_TOKEN || '';

interface NotionBlock {
  id: string;
  type: string;
  [key: string]: unknown;
}

interface NotionPage {
  id: string;
  properties: Record<string, { title?: Array<{ plain_text: string }> }>;
}

function getNotionHeaders(): Record<string, string> {
  return {
    'Authorization': `Bearer ${NOTION_TOKEN}`,
    'Notion-Version': '2022-06-28',
    'Content-Type': 'application/json',
  };
}

/**
 * Extract plain text from a Notion block
 */
function extractBlockText(block: NotionBlock): string {
  const type = block.type;
  const blockData = block[type] as Record<string, unknown>;

  if (!blockData) return '';

  // Handle rich text blocks
  if (blockData.rich_text && Array.isArray(blockData.rich_text)) {
    return (blockData.rich_text as Array<{ plain_text: string }>)
      .map(rt => rt.plain_text)
      .join('');
  }

  // Handle title (for heading_1, heading_2, heading_3)
  if (blockData.text && Array.isArray(blockData.text)) {
    return (blockData.text as Array<{ plain_text: string }>)
      .map(t => t.plain_text)
      .join('');
  }

  return '';
}

export async function parseNotion(pageId: string): Promise<ParsedSource> {
  if (!NOTION_TOKEN) {
    throw new Error('NOTION_TOKEN is required for Notion integration');
  }

  // Clean page ID (remove dashes, handle full URLs)
  const cleanId = pageId.replace(/https?:\/\/[^/]+\//, '').replace(/-/g, '').slice(0, 32);

  // Fetch page metadata
  const pageResponse = await fetch(`https://api.notion.com/v1/pages/${cleanId}`, {
    headers: getNotionHeaders(),
  });

  if (!pageResponse.ok) {
    const error = await pageResponse.text();
    throw new Error(`Notion page fetch failed: ${pageResponse.status} — ${error}`);
  }

  const page: NotionPage = await pageResponse.json();

  // Extract title
  const titleProperty = Object.values(page.properties).find(p => p.title);
  const title = titleProperty?.title?.[0]?.plain_text || 'Untitled Notion Page';

  // Fetch page blocks (content)
  const blocksResponse = await fetch(
    `https://api.notion.com/v1/blocks/${cleanId}/children?page_size=100`,
    { headers: getNotionHeaders() }
  );

  if (!blocksResponse.ok) {
    throw new Error('Failed to fetch Notion page content');
  }

  const blocksData = await blocksResponse.json();
  const blocks: NotionBlock[] = blocksData.results;

  // Extract text from blocks
  const textParts: string[] = [];
  for (const block of blocks) {
    const text = extractBlockText(block);
    if (text) {
      // Add heading markers
      if (block.type.startsWith('heading_')) {
        const level = parseInt(block.type.slice(-1));
        textParts.push(`${'#'.repeat(level)} ${text}`);
      } else if (block.type === 'bulleted_list_item') {
        textParts.push(`• ${text}`);
      } else if (block.type === 'numbered_list_item') {
        textParts.push(`1. ${text}`);
      } else {
        textParts.push(text);
      }
    }
  }

  const content = textParts.join('\n');

  if (content.length < 20) {
    throw new Error('Insufficient content in Notion page');
  }

  return {
    title,
    content,
    url: `https://www.notion.so/${cleanId}`,
    metadata: {
      page_id: cleanId,
      block_count: blocks.length,
      source_type: 'notion',
    },
  };
}
