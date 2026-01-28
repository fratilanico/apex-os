/**
 * YouTube transcript parser.
 * Extracts transcripts from YouTube video URLs.
 */

import { ParsedSource } from './url';

interface TranscriptSegment {
  text: string;
  start: number;
  duration: number;
}

/**
 * Extract video ID from various YouTube URL formats
 */
export function extractVideoId(url: string): string {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) return match[1];
  }

  // If it's just a video ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url;

  throw new Error('Could not extract YouTube video ID from URL');
}

/**
 * Fetch transcript from YouTube (via innertube API).
 * Note: This uses YouTube's internal API — may break if Google changes it.
 * For production, consider using a dedicated service like Supereface or AssemblyAI.
 */
export async function parseYouTube(url: string): Promise<ParsedSource> {
  const videoId = extractVideoId(url);

  // Try fetching transcript via YouTube's internal endpoint
  const transcriptUrl = `https://youtubetranscript.com/?v=${videoId}`;
  
  let content: string;
  let title = `YouTube Video ${videoId}`;

  try {
    // Fetch video page for title
    const videoResponse = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
      headers: { 'User-Agent': 'APEX Knowledge Ingestor/1.0' }
    });
    const videoHtml = await videoResponse.text();
    const titleMatch = videoHtml.match(/<title>([^<]+)<\/title>/);
    if (titleMatch && titleMatch[1]) {
      title = titleMatch[1].replace(' - YouTube', '').trim();
    }

    // Fetch transcript
    const transcriptResponse = await fetch(transcriptUrl, {
      headers: { 'User-Agent': 'APEX Knowledge Ingestor/1.0' }
    });

    if (!transcriptResponse.ok) {
      throw new Error(`Transcript fetch failed: ${transcriptResponse.status}`);
    }

    const transcriptHtml = await transcriptResponse.text();
    
    // Parse transcript XML from the response
    const { load } = await import('cheerio');
    const $ = load(transcriptHtml, { xmlMode: true });
    
    const segments: TranscriptSegment[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    $('transcript segment').each((_: number, el: any) => {
      segments.push({
        text: $(el).text().trim(),
        start: parseFloat($(el).attr('start') || '0'),
        duration: parseFloat($(el).attr('dur') || '0'),
      });
    });

    // If XML parsing didn't work, try plain text extraction
    if (segments.length === 0) {
      const plainText = $('body').text().trim();
      if (plainText.length > 50) {
        content = plainText;
      } else {
        throw new Error('No transcript available for this video');
      }
    } else {
      // Format with timestamps
      content = segments
        .map(seg => {
          const minutes = Math.floor(seg.start / 60);
          const seconds = Math.floor(seg.start % 60).toString().padStart(2, '0');
          return `[${minutes}:${seconds}] ${seg.text}`;
        })
        .join('\n');
    }
  } catch (error) {
    throw new Error(`YouTube transcript extraction failed: ${error instanceof Error ? error.message : 'Unknown error'}. The video may not have captions enabled.`);
  }

  return {
    title,
    content,
    url: `https://www.youtube.com/watch?v=${videoId}`,
    metadata: {
      video_id: videoId,
      source_type: 'youtube',
      content_length: content.length,
    },
  };
}
