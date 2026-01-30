/**
 * Markdown/text parser — direct text ingestion.
 */

import { ParsedSource } from './url';

export async function parseMarkdown(text: string, title?: string): Promise<ParsedSource> {
  if (!text || text.trim().length === 0) {
    throw new Error('Empty content provided');
  }

  // Extract title from markdown H1 if not provided
  const extractedTitle = title || 
    text.match(/^#\s+(.+)$/m)?.[1]?.trim() || 
    'Untitled Document';

  // Strip markdown syntax for plain text extraction
  const plainText = text
    .replace(/```[\s\S]*?```/g, '')        // Remove code blocks (keep content)
    .replace(/`[^`]+`/g, '$&')             // Keep inline code as-is
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1') // Image alt text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')  // Link text only
    .replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, '$1') // Bold/italic text
    .replace(/~~([^~]+)~~/g, '$1')         // Strikethrough text
    .trim();

  return {
    title: extractedTitle,
    content: plainText,
    url: '',
    metadata: {
      original_length: text.length,
      plain_length: plainText.length,
      source_type: 'markdown',
      has_code_blocks: /```/.test(text),
      heading_count: (text.match(/^#{1,6}\s/gm) || []).length,
    },
  };
}
