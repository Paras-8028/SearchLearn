import { ObjectId } from "mongodb";
import clientPromise from "@/lib/db/mongodb";
import { getSearchDocumentsWithEmbeddings } from "@/lib/db/repositories/search";
import { generateEmbedding } from "@/lib/ai/embeddings";
import { cosineSimilarity } from "./cosine-similarity";
import type { SearchResult, SearchContentType, SearchDocument } from "@/types/search";

const DATABASE_NAME = "searchlearn";
const SEARCH_DOCUMENTS_COLLECTION = "searchDocuments";
const VECTOR_INDEX_NAME = "search_vector_index";

/**
 * Performs semantic vector search with MongoDB Atlas Vector Search and in-memory cosine fallback
 */
export async function semanticSearch(options: {
  query: string;
  contentTypes?: SearchContentType[];
  courseId?: string;
  limit?: number;
  minScore?: number;
}): Promise<SearchResult[]> {
  const { query, contentTypes, courseId, limit = 20, minScore = 0.4 } = options;

  if (!query || !query.trim()) return [];

  // Generate query embedding
  const queryEmbedding = await generateEmbedding(query);

  const client = await clientPromise;
  const collection = client
    .db(DATABASE_NAME)
    .collection<SearchDocument>(SEARCH_DOCUMENTS_COLLECTION);

  // 1. Try MongoDB Atlas $vectorSearch aggregation pipeline
  try {
    const vectorPipeline: Record<string, unknown>[] = [
      {
        $vectorSearch: {
          index: VECTOR_INDEX_NAME,
          path: "embedding",
          queryVector: queryEmbedding,
          numCandidates: limit * 10,
          limit: limit * 2,
        },
      },
      {
        $addFields: {
          score: { $meta: "vectorSearchScore" },
        },
      },
    ];

    // Optional filter in pipeline
    if (courseId && courseId !== "all" && ObjectId.isValid(courseId)) {
      vectorPipeline.push({
        $match: {
          $or: [{ courseId: new ObjectId(courseId) }, { sourceId: new ObjectId(courseId) }],
        },
      });
    }

    const atlasResults = await collection.aggregate(vectorPipeline).toArray();

    if (atlasResults.length > 0) {
      return atlasResults.map((doc) =>
        mapDocToSearchResult(
          doc as unknown as SearchDocument,
          Number((doc as Record<string, unknown>).score) || 0
        )
      );
    }
  } catch {
    // Atlas Vector Search not configured on cluster yet or running locally - proceed to fallback
  }

  // 2. In-Memory Cosine Similarity Fallback
  const allDocs = await getSearchDocumentsWithEmbeddings();

  const scoredDocs = allDocs
    .map((doc) => {
      if (!doc.embedding || doc.embedding.length === 0) return null;

      // Filter by courseId
      if (courseId && courseId !== "all") {
        if (doc.courseId !== courseId && doc.sourceId !== courseId) {
          return null;
        }
      }

      // Filter by contentTypes
      if (contentTypes && contentTypes.length > 0) {
        if (
          !contentTypes.includes(doc.sourceType as SearchContentType) &&
          !contentTypes.includes(doc.metadata.contentType as SearchContentType)
        ) {
          return null;
        }
      }

      const score = cosineSimilarity(queryEmbedding, doc.embedding);
      return { doc, score };
    })
    .filter(
      (item): item is { doc: (typeof allDocs)[0]; score: number } =>
        item !== null && item.score >= minScore
    )
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scoredDocs.map(({ doc, score }) =>
    mapDocToSearchResult(doc as unknown as SearchDocument, score)
  );
}

function mapDocToSearchResult(
  doc: SearchDocument,
  rawScore: number
): SearchResult {
  let contentType: SearchContentType = "lesson";
  if (doc.sourceType === "course") {
    contentType = "course";
  } else if (doc.sourceType === "module") {
    contentType = "module";
  } else if (doc.metadata?.contentType) {
    contentType = doc.metadata.contentType as SearchContentType;
  }

  const sourceId = doc.sourceId ? doc.sourceId.toString() : doc._id?.toString() || "";
  const courseId = doc.courseId ? doc.courseId.toString() : undefined;
  const lessonId = doc.lessonId ? doc.lessonId.toString() : undefined;
  const moduleId = doc.moduleId ? doc.moduleId.toString() : undefined;

  let href = `/courses/${courseId || sourceId}`;
  if (doc.sourceType === "lesson" || lessonId) {
    href = `/learn/${lessonId || sourceId}`;
  }

  return {
    id: sourceId,
    sourceType: doc.sourceType,
    contentType,
    title: doc.title,
    description:
      doc.content && doc.content.length > 200
        ? `${doc.content.substring(0, 197)}...`
        : doc.content || doc.title,
    content: doc.content,
    courseId,
    moduleId,
    lessonId,
    courseTitle: doc.metadata?.courseTitle,
    moduleTitle: doc.metadata?.moduleTitle,
    score: Math.min(1, Math.max(0, rawScore)),
    href,
    metadata: {
      category: doc.metadata?.category,
      level: doc.metadata?.level,
      duration: doc.metadata?.duration,
      contentType: doc.metadata?.contentType,
    },
  };
}
