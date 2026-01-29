/**
 * PDF Parser - extracts text from PDF files
 * Uses pdf-parse library (already in package.json)
 */

import pdf from 'pdf-parse';

interface ParsedPDF {
  title: string;
  content: string;
  url: string;
  metadata: {
    pages: number;
    info?: Record<string, unknown>;
  };
}

/**
 * Parse PDF from base64 encoded data or Buffer
 */
export async function parsePDF(data: Buffer | string, filename?: string): Promise<ParsedPDF> {
  // Convert base64 string to Buffer if needed
  const buffer = typeof data === 'string'
    ? Buffer.from(data, 'base64')
    : data;

  const result = await pdf(buffer);

  // Extract title from metadata or filename
  const title = result.info?.Title || filename || 'Untitled PDF';

  return {
    title,
    content: result.text,
    url: `pdf://${filename || 'uploaded'}`,
    metadata: {
      pages: result.numpages,
      info: result.info
    }
  };
}

/**
 * Parse PDF from URL
 */
export async function parsePDFFromURL(url: string): Promise<ParsedPDF> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch PDF: ${response.status}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Extract filename from URL
  const filename = url.split('/').pop() || 'document.pdf';

  return parsePDF(buffer, filename);
}
