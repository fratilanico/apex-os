/**
 * Generate embeddings using Google Gemini text-embedding-004.
 * Returns 768-dimensional vectors.
 */

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const EMBEDDING_MODEL = 'text-embedding-004';
const BATCH_SIZE = 100;

interface EmbeddingResult {
  text: string;
  embedding: number[];
  index: number;
}

export async function generateEmbeddings(texts: string[]): Promise<EmbeddingResult[]> {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is required for embedding generation');
  }

  if (texts.length === 0) return [];

  const results: EmbeddingResult[] = [];

  // Process in batches
  for (let i = 0; i < texts.length; i += BATCH_SIZE) {
    const batch = texts.slice(i, i + BATCH_SIZE);

    // Gemini batch embedding endpoint
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${EMBEDDING_MODEL}:batchEmbedContents?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requests: batch.map((text) => ({
            model: `models/${EMBEDDING_MODEL}`,
            content: { parts: [{ text }] },
          })),
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Gemini embedding failed: ${response.status} — ${error}`);
    }

    const data = await response.json();

    // Gemini returns { embeddings: [{ values: number[] }] }
    const embeddings = data.embeddings as Array<{ values: number[] }>;

    for (let j = 0; j < embeddings.length; j++) {
      results.push({
        text: batch[j] as string,
        embedding: embeddings[j]?.values ?? [],
        index: i + j,
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
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is required for embedding generation');
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${EMBEDDING_MODEL}:embedContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: `models/${EMBEDDING_MODEL}`,
        content: { parts: [{ text }] },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Gemini embedding failed: ${response.status} — ${error}`);
  }

  const data = await response.json();
  return data.embedding?.values ?? [];
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
