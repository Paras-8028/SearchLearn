import { getOpenAIClient } from "./openai";

export const EMBEDDING_MODEL = "text-embedding-3-small";
export const EMBEDDING_DIMENSION = 1536;

/**
 * Normalizes input text for optimal embedding generation
 */
function sanitizeText(text: string): string {
  if (!text) return "";
  // Clean whitespace and limit max characters to prevent exceeding context window
  return text.trim().replace(/\s+/g, " ").slice(0, 20000);
}

/**
 * Generates a 1536-dimensional vector embedding for a single text string using text-embedding-3-small
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const clean = sanitizeText(text);
  if (!clean) {
    throw new Error("Cannot generate embedding for empty text");
  }

  const openai = getOpenAIClient();

  const response = await openai.embeddings.create({
    model: EMBEDDING_MODEL,
    input: clean,
  });

  if (!response.data || response.data.length === 0) {
    throw new Error("OpenAI API returned empty embedding data");
  }

  return response.data[0].embedding;
}

/**
 * Generates embeddings in batches for multiple texts
 */
export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  const cleanTexts = texts.map(sanitizeText).filter((t) => t.length > 0);
  if (cleanTexts.length === 0) return [];

  const openai = getOpenAIClient();

  // Process in chunks of 50 to respect API rate limits
  const CHUNK_SIZE = 50;
  const allEmbeddings: number[][] = [];

  for (let i = 0; i < cleanTexts.length; i += CHUNK_SIZE) {
    const chunk = cleanTexts.slice(i, i + CHUNK_SIZE);
    const response = await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      input: chunk,
    });

    for (const item of response.data) {
      allEmbeddings.push(item.embedding);
    }
  }

  return allEmbeddings;
}
