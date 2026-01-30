/**
 * Generate embeddings using OpenAI text-embedding-3-small.
 * Returns 1536-dimensional vectors.
 */

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
const EMBEDDING_MODEL = 'text-embedding-3-small';
const BATCH_SIZE = 100; // OpenAI allows up to 100 inputs per request

interface EmbeddingResult {
  text: string;
  embedding: number[];
  index: number;
}

export async function generateEmbeddings(texts: string[]): Promise<EmbeddingResult[]> {
  if (!OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is required for embedding generation');
  }

  if (texts.length === 0) return [];

  const results: EmbeddingResult[] = [];

  // Process in batches
  for (let i = 0; i < texts.length; i += BATCH_SIZE) {
    const batch = texts.slice(i, i + BATCH_SIZE);

    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: batch,
        model: EMBEDDING_MODEL,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI embedding failed: ${response.status} — ${error}`);
    }

    const data = await response.json();

    for (const item of (data.data as Array<{ index: number; embedding: number[] }>)) {
      results.push({
        text: batch[item.index] as string,
        embedding: item.embedding,
        index: i + item.index,
      });
    }
  }

  // Sort by original index
  results.sort((a, b) => a.index - b.index);
  return results;
}

/**
 * Generate a single embedding (convenience wrapper)
 */
export async function embed(text: string): Promise<number[]> {
  const results = await generateEmbeddings([text]);
  if (results.length === 0) throw new Error('Embedding generation returned no results');
  const first = results[0];
  if (!first) throw new Error('Embedding generation returned no results');
  return first.embedding;
}

/**
 * Calculate cosine similarity between two vectors
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) throw new Error('Vectors must have same dimension');

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    const ai = a[i] ?? 0;
    const bi = b[i] ?? 0;
    dotProduct += ai * bi;
    normA += ai * ai;
    normB += bi * bi;
  }

  const magnitude = Math.sqrt(normA) * Math.sqrt(normB);
  return magnitude === 0 ? 0 : dotProduct / magnitude;
}
