/**
 * Text chunking with overlap for optimal embedding retrieval.
 * Target: ~512 tokens per chunk with 10% overlap.
 */

const CHUNK_SIZE = 512;       // tokens (approximate as ~4 chars/token)
const CHUNK_OVERLAP = 50;     // tokens of overlap between chunks
const CHARS_PER_TOKEN = 4;    // rough approximation

interface Chunk {
  content: string;
  index: number;
  metadata: Record<string, unknown>;
}

/**
 * Split text into overlapping chunks optimized for embedding.
 * Respects paragraph boundaries when possible.
 */
export function chunkText(
  text: string,
  sourceMetadata: Record<string, unknown> = {}
): Chunk[] {
  const chunks: Chunk[] = [];
  const targetChars = CHUNK_SIZE * CHARS_PER_TOKEN;
  const overlapChars = CHUNK_OVERLAP * CHARS_PER_TOKEN;

  // Split into paragraphs first for natural boundaries
  const paragraphs = text
    .split(/\n\s*\n/)
    .map(p => p.trim())
    .filter(p => p.length > 0);

  let currentChunk = '';
  let chunkIndex = 0;

  for (const paragraph of paragraphs) {
    // If adding this paragraph stays within chunk size
    if ((currentChunk + '\n\n' + paragraph).length <= targetChars) {
      currentChunk += (currentChunk ? '\n\n' : '') + paragraph;
      continue;
    }

    // Current chunk is full — save it
    if (currentChunk.length > 0) {
      chunks.push({
        content: currentChunk,
        index: chunkIndex++,
        metadata: { ...sourceMetadata, paragraph_count: currentChunk.split(/\n\s*\n/).length }
      });

      // Create overlap: take last ~overlapChars of current chunk
      const overlap = currentChunk.slice(-overlapChars);
      currentChunk = overlap + '\n\n' + paragraph;
    } else {
      // Single paragraph larger than chunk size — split by sentences
      const sentences = paragraph.match(/[^.!?]+[.!?]+/g) || [paragraph];
      let sentenceChunk = '';

      for (const sentence of sentences) {
        if ((sentenceChunk + ' ' + sentence).length > targetChars) {
          if (sentenceChunk.length > 0) {
            chunks.push({
              content: sentenceChunk.trim(),
              index: chunkIndex++,
              metadata: sourceMetadata
            });
            sentenceChunk = sentence;
          } else {
            // Single sentence too long — just include it
            chunks.push({
              content: sentence.trim(),
              index: chunkIndex++,
              metadata: sourceMetadata
            });
          }
        } else {
          sentenceChunk += (sentenceChunk ? ' ' : '') + sentence;
        }
      }

      currentChunk = sentenceChunk;
    }
  }

  // Don't forget the last chunk
  if (currentChunk.trim().length > 0) {
    chunks.push({
      content: currentChunk.trim(),
      index: chunkIndex,
      metadata: sourceMetadata
    });
  }

  return chunks;
}

/**
 * Estimate token count (rough: ~4 chars per token)
 */
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / CHARS_PER_TOKEN);
}
