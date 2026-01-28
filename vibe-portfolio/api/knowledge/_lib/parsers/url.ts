/**
 * URL parser — scrapes and extracts clean text from web pages.
 */

export interface ParsedSource {
  title: string;
  content: string;
  url: string;
  metadata: Record<string, unknown>;
}

export async function parseURL(url: string): Promise<ParsedSource> {
  // Validate URL
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url.startsWith('http') ? url : `https://${url}`);
  } catch {
    throw new Error(`Invalid URL: ${url}`);
  }

  // Fetch the page
  const response = await fetch(parsedUrl.toString(), {
    headers: {
      'User-Agent': 'APEX Knowledge Ingestor/1.0 (Educational Platform)',
      'Accept': 'text/html',
    },
    redirect: 'follow',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`);
  }

  const html = await response.text();

  // Dynamic import cheerio for HTML parsing
  const cheerio = await import('cheerio');
  const { load } = cheerio;
  const $ = load(html);

  // Extract title
  const title = $('title').first().text().trim() ||
                $('h1').first().text().trim() ||
                parsedUrl.hostname;

  // Remove script, style, nav, footer, header tags
  $('script, style, nav, footer, header, aside, [role="navigation"], [role="banner"]').remove();

  // Extract meaningful text content
  const contentElements = $('main, article, [role="main"], body');
  let content = '';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  contentElements.each((_: number, el: any) => {
    const text = $(el).text();
    if (text && text.trim().length > content.length) {
      content = text;
    }
  });

  // Fallback to body if no main content found
  if (!content || content.trim().length < 100) {
    content = $('body').text();
  }

  // Clean up whitespace
  content = content
    .replace(/\s+/g, ' ')
    .replace(/\n\s*\n/g, '\n\n')
    .trim();

  if (content.length < 50) {
    throw new Error('Insufficient content extracted from URL — page may require JavaScript rendering');
  }

  return {
    title,
    content,
    url: parsedUrl.toString(),
    metadata: {
      hostname: parsedUrl.hostname,
      pathname: parsedUrl.pathname,
      content_length: content.length,
      source_type: 'url',
    },
  };
}
