import type { ContentChunk } from "@/types/content";

export interface ChunkOptions {
  chunkSize?: number;
  overlap?: number;
}

const DEFAULT_CHUNK_SIZE = 1200;
const DEFAULT_OVERLAP = 200;

/**
 * Splits text into logical sentences while preserving punctuation
 */
function splitIntoSentences(text: string): string[] {
  // Regex splitting on sentence boundaries (.!?) followed by space or newline
  const rawSentences = text.split(/(?<=[.!?])\s+/);
  return rawSentences.map((s) => s.trim()).filter((s) => s.length > 0);
}

/**
 * Paragraph-aware text chunking with configurable overlap and sentence preservation
 */
export function chunkText(
  text: string,
  options: ChunkOptions = {}
): ContentChunk[] {
  const chunkSize = options.chunkSize || DEFAULT_CHUNK_SIZE;
  const overlap = Math.min(options.overlap || DEFAULT_OVERLAP, Math.floor(chunkSize / 2));

  if (!text || !text.trim()) {
    return [];
  }

  const normalized = text.trim();

  // If text is already smaller than or equal to chunkSize, return as single chunk
  if (normalized.length <= chunkSize) {
    return [
      {
        index: 0,
        text: normalized,
        startPosition: 0,
        endPosition: normalized.length,
      },
    ];
  }

  // 1. Break down into paragraphs first
  const paragraphs = normalized.split(/\n\n+/).filter((p) => p.trim().length > 0);

  // 2. Break large paragraphs into sentences
  const atomicBlocks: string[] = [];
  for (const paragraph of paragraphs) {
    if (paragraph.length <= chunkSize) {
      atomicBlocks.push(paragraph);
    } else {
      const sentences = splitIntoSentences(paragraph);
      for (const sentence of sentences) {
        if (sentence.length <= chunkSize) {
          atomicBlocks.push(sentence);
        } else {
          // Extremely long sentence without punctuation, split by words
          const words = sentence.split(/\s+/);
          let currentWordChunk = "";
          for (const word of words) {
            if ((currentWordChunk + " " + word).length > chunkSize && currentWordChunk.length > 0) {
              atomicBlocks.push(currentWordChunk.trim());
              currentWordChunk = word;
            } else {
              currentWordChunk = currentWordChunk ? `${currentWordChunk} ${word}` : word;
            }
          }
          if (currentWordChunk.trim().length > 0) {
            atomicBlocks.push(currentWordChunk.trim());
          }
        }
      }
    }
  }

  // 3. Assemble atomic blocks into overlapping chunks
  const chunks: ContentChunk[] = [];
  let currentChunkText = "";
  let chunkIndex = 0;
  let runningPosition = 0;

  for (let i = 0; i < atomicBlocks.length; i++) {
    const block = atomicBlocks[i];
    const candidate = currentChunkText ? `${currentChunkText}\n\n${block}` : block;

    if (candidate.length <= chunkSize) {
      currentChunkText = candidate;
    } else {
      if (currentChunkText.length > 0) {
        const startPos = runningPosition;
        const endPos = startPos + currentChunkText.length;
        chunks.push({
          index: chunkIndex++,
          text: currentChunkText,
          startPosition: startPos,
          endPosition: endPos,
        });

        // Compute overlap string from the end of current chunk
        let overlapText = "";
        if (overlap > 0 && currentChunkText.length > overlap) {
          const tail = currentChunkText.slice(-overlap);
          // Try to snap to the beginning of a word
          const firstSpace = tail.indexOf(" ");
          overlapText = firstSpace !== -1 ? tail.slice(firstSpace + 1) : tail;
        }

        runningPosition = endPos - overlapText.length;
        currentChunkText = overlapText ? `${overlapText}\n\n${block}` : block;
      } else {
        currentChunkText = block;
      }
    }
  }

  // Flush remaining text
  if (currentChunkText.trim().length > 0) {
    chunks.push({
      index: chunkIndex,
      text: currentChunkText.trim(),
      startPosition: runningPosition,
      endPosition: runningPosition + currentChunkText.trim().length,
    });
  }

  return chunks;
}
