import { ObjectId } from "mongodb";
import { cleanLearningContent } from "./normalize";
import { validateContent } from "./validate";
import { chunkText } from "./chunk";
import { generateEmbedding } from "@/lib/ai/embeddings";
import { isOpenAIConfigured } from "@/lib/ai/openai";
import {
  upsertSearchDocument,
  deleteSearchDocumentsBySourceId,
} from "@/lib/db/repositories/search";
import type {
  ProcessContentInput,
  ProcessedContentResult,
  ContentChunk,
} from "@/types/content";
import type { SearchSourceType } from "@/types/search";

/**
 * Processes learning content through normalization, chunking, embedding generation,
 * and updates the search index in MongoDB.
 */
export async function processLearningContent(
  input: ProcessContentInput
): Promise<ProcessedContentResult> {
  const {
    sourceId,
    sourceType,
    title,
    content,
    courseId,
    moduleId,
    lessonId,
    metadata = {},
  } = input;

  // 1. Validate Input
  const validation = validateContent(content, 5);
  if (!validation.valid) {
    console.warn(
      `[processLearningContent] Validation warning for ${sourceType} (${sourceId}): ${validation.error}`
    );
  }

  // 2. Clean and Normalize
  const normalized = cleanLearningContent(content || title);

  // 3. Split into manageable, overlapping chunks
  const chunks: ContentChunk[] = chunkText(normalized, {
    chunkSize: 1200,
    overlap: 200,
  });

  // Ensure at least one chunk exists even for minimal content
  if (chunks.length === 0) {
    chunks.push({
      index: 0,
      text: normalized || title,
      startPosition: 0,
      endPosition: (normalized || title).length,
    });
  }

  // 4. Remove previous chunks for this source to ensure zero duplicates
  try {
    await deleteSearchDocumentsBySourceId(sourceId);
  } catch (err) {
    console.warn(`[processLearningContent] Error clearing old chunks for ${sourceId}:`, err);
  }

  // 5. Generate embeddings and store each chunk in searchDocuments
  const hasAI = isOpenAIConfigured();
  let embeddingsGenerated = 0;

  for (const chunk of chunks) {
    // Construct contextual search text for optimal semantic retrieval
    const contextPrefixParts: string[] = [
      `Title: ${title}`,
      `Type: ${sourceType}`,
    ];

    if (metadata.courseTitle) {
      contextPrefixParts.push(`Course: ${metadata.courseTitle}`);
    }
    if (metadata.moduleTitle) {
      contextPrefixParts.push(`Module: ${metadata.moduleTitle}`);
    }

    const searchableText = `${contextPrefixParts.join(" • ")}\n\n${chunk.text}`;

    let embedding: number[] | undefined;
    if (hasAI) {
      try {
        embedding = await generateEmbedding(searchableText);
        embeddingsGenerated++;
      } catch (err) {
        console.warn(
          `[processLearningContent] Failed to generate embedding for ${sourceId} chunk ${chunk.index}:`,
          err
        );
      }
    }

    await upsertSearchDocument({
      sourceType: (sourceType === "lesson_description" ? "lesson" : sourceType) as SearchSourceType,
      sourceId: new ObjectId(sourceId),
      courseId: courseId ? new ObjectId(courseId) : undefined,
      moduleId: moduleId ? new ObjectId(moduleId) : undefined,
      lessonId: lessonId ? new ObjectId(lessonId) : undefined,
      chunkIndex: chunk.index,
      title: chunks.length > 1 ? `${title} (Part ${chunk.index + 1})` : title,
      content: chunk.text,
      searchableText,
      metadata: {
        courseTitle: metadata.courseTitle as string | undefined,
        moduleTitle: metadata.moduleTitle as string | undefined,
        category: metadata.category as string | undefined,
        level: metadata.level as string | undefined,
        contentType: (metadata.contentType as string) || sourceType,
        duration: metadata.duration as number | undefined,
        fileName: metadata.fileName as string | undefined,
        fileType: metadata.fileType as string | undefined,
      },
      embedding,
    });
  }

  return {
    sourceId,
    sourceType,
    title,
    chunksCount: chunks.length,
    chunks,
    embeddingsGenerated,
  };
}
