import { ObjectId, Filter } from "mongodb";
import clientPromise from "@/lib/db/mongodb";
import type { SearchDocument, SearchDocumentDTO, SearchResult, SearchContentType } from "@/types/search";

const DATABASE_NAME = "searchlearn";
const SEARCH_DOCUMENTS_COLLECTION = "searchDocuments";

async function getSearchDocumentsCollection() {
  const client = await clientPromise;
  return client.db(DATABASE_NAME).collection<SearchDocument>(SEARCH_DOCUMENTS_COLLECTION);
}

export function serializeSearchDocument(doc: SearchDocument): SearchDocumentDTO {
  return {
    ...doc,
    _id: doc._id ? doc._id.toString() : "",
    sourceId: doc.sourceId.toString(),
    courseId: doc.courseId ? doc.courseId.toString() : undefined,
    moduleId: doc.moduleId ? doc.moduleId.toString() : undefined,
    lessonId: doc.lessonId ? doc.lessonId.toString() : undefined,
    createdAt: doc.createdAt ? doc.createdAt.toISOString() : new Date().toISOString(),
    updatedAt: doc.updatedAt ? doc.updatedAt.toISOString() : new Date().toISOString(),
  };
}

export async function upsertSearchDocument(
  data: Omit<SearchDocument, "_id" | "createdAt" | "updatedAt">
): Promise<SearchDocumentDTO> {
  const collection = await getSearchDocumentsCollection();
  const now = new Date();

  const sourceId = typeof data.sourceId === "string" ? new ObjectId(data.sourceId) : data.sourceId;
  const courseId = data.courseId
    ? typeof data.courseId === "string"
      ? new ObjectId(data.courseId)
      : data.courseId
    : undefined;
  const moduleId = data.moduleId
    ? typeof data.moduleId === "string"
      ? new ObjectId(data.moduleId)
      : data.moduleId
    : undefined;
  const lessonId = data.lessonId
    ? typeof data.lessonId === "string"
      ? new ObjectId(data.lessonId)
      : data.lessonId
    : undefined;

  const docToUpsert: Partial<SearchDocument> = {
    sourceType: data.sourceType,
    sourceId,
    courseId,
    moduleId,
    lessonId,
    chunkIndex: data.chunkIndex ?? 0,
    title: data.title,
    content: data.content,
    searchableText: data.searchableText,
    metadata: data.metadata,
    updatedAt: now,
  };

  if (data.embedding && data.embedding.length > 0) {
    docToUpsert.embedding = data.embedding;
  }

  const chunkIndex = data.chunkIndex ?? 0;
  const result = await collection.findOneAndUpdate(
    { sourceId, chunkIndex },
    {
      $set: docToUpsert,
      $setOnInsert: { createdAt: now },
    },
    { upsert: true, returnDocument: "after" }
  );

  if (!result) {
    throw new Error("Failed to upsert search document");
  }

  return serializeSearchDocument(result);
}

export async function getSearchDocumentBySourceId(
  sourceId: string
): Promise<SearchDocumentDTO | null> {
  if (!ObjectId.isValid(sourceId)) return null;

  const collection = await getSearchDocumentsCollection();
  const doc = await collection.findOne({ sourceId: new ObjectId(sourceId) });
  if (!doc) return null;

  return serializeSearchDocument(doc);
}

export async function getSearchDocumentsBySourceId(
  sourceId: string
): Promise<SearchDocumentDTO[]> {
  if (!ObjectId.isValid(sourceId)) return [];

  const collection = await getSearchDocumentsCollection();
  const docs = await collection
    .find({ sourceId: new ObjectId(sourceId) })
    .sort({ chunkIndex: 1 })
    .toArray();

  return docs.map(serializeSearchDocument);
}

export async function deleteSearchDocumentsBySourceId(sourceId: string | ObjectId): Promise<number> {
  const idStr = String(sourceId);
  if (!ObjectId.isValid(idStr)) return 0;

  const collection = await getSearchDocumentsCollection();
  const result = await collection.deleteMany({ sourceId: new ObjectId(idStr) });
  return result.deletedCount;
}

export async function deleteSearchDocumentBySourceId(sourceId: string | ObjectId): Promise<boolean> {
  const count = await deleteSearchDocumentsBySourceId(sourceId);
  return count > 0;
}

export async function deleteSearchDocumentsByCourseId(courseId: string): Promise<number> {
  if (!ObjectId.isValid(courseId)) return 0;

  const collection = await getSearchDocumentsCollection();
  const result = await collection.deleteMany({
    $or: [{ sourceId: new ObjectId(courseId) }, { courseId: new ObjectId(courseId) }],
  });
  return result.deletedCount;
}

export async function getAllSearchDocuments(): Promise<SearchDocumentDTO[]> {
  const collection = await getSearchDocumentsCollection();
  const docs = await collection.find({}).toArray();
  return docs.map(serializeSearchDocument);
}

export async function getSearchDocumentsWithEmbeddings(): Promise<SearchDocumentDTO[]> {
  const collection = await getSearchDocumentsCollection();
  const docs = await collection
    .find({ embedding: { $exists: true, $ne: [] } })
    .toArray();
  return docs.map(serializeSearchDocument);
}

export async function getSearchDocumentsWithoutEmbeddings(): Promise<SearchDocumentDTO[]> {
  const collection = await getSearchDocumentsCollection();
  const docs = await collection
    .find({
      $or: [{ embedding: { $exists: false } }, { embedding: { $size: 0 } }],
    })
    .toArray();
  return docs.map(serializeSearchDocument);
}

export async function searchDocumentsByKeyword(options: {
  query: string;
  contentTypes?: SearchContentType[];
  courseId?: string;
  limit?: number;
}): Promise<SearchResult[]> {
  const collection = await getSearchDocumentsCollection();
  const { query, contentTypes, courseId, limit = 20 } = options;

  if (!query || !query.trim()) return [];

  const filter: Filter<SearchDocument> = {};

  if (courseId && courseId !== "all" && ObjectId.isValid(courseId)) {
    filter.$or = [{ courseId: new ObjectId(courseId) }, { sourceId: new ObjectId(courseId) }];
  }

  if (contentTypes && contentTypes.length > 0) {
    const validSourceTypes = contentTypes.filter(
      (t): t is "course" | "module" | "lesson" =>
        t === "course" || t === "module" || t === "lesson"
    );
    if (validSourceTypes.length > 0) {
      filter.sourceType = { $in: validSourceTypes };
    }
  }

  // Regex term matching across title, searchableText, and metadata
  const cleanTerms = query
    .trim()
    .split(/\s+/)
    .filter((t) => t.length > 0)
    .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));

  const regexConditions = cleanTerms.map((term) => ({
    $or: [
      { title: { $regex: term, $options: "i" } },
      { searchableText: { $regex: term, $options: "i" } },
      { "metadata.courseTitle": { $regex: term, $options: "i" } },
      { "metadata.moduleTitle": { $regex: term, $options: "i" } },
      { "metadata.category": { $regex: term, $options: "i" } },
    ],
  }));

  if (regexConditions.length > 0) {
    if (filter.$or) {
      filter.$and = [{ $or: filter.$or }, { $or: regexConditions }];
      delete filter.$or;
    } else {
      filter.$or = regexConditions;
    }
  }

  const docs = await collection.find(filter).limit(limit * 2).toArray();

  const results: SearchResult[] = docs.map((doc) => {
    let contentType: SearchContentType = "lesson";
    if (doc.sourceType === "course") {
      contentType = "course";
    } else if (doc.sourceType === "module") {
      contentType = "module";
    } else if (doc.metadata.contentType) {
      contentType = doc.metadata.contentType as SearchContentType;
    }

    let href = `/courses/${doc.courseId || doc.sourceId}`;
    if (doc.sourceType === "lesson" || doc.lessonId) {
      href = `/learn/${doc.lessonId || doc.sourceId}`;
    }

    // Basic keyword relevance scoring
    const lowerTitle = doc.title.toLowerCase();
    const lowerQuery = query.toLowerCase();
    let score = 0.5;

    if (lowerTitle === lowerQuery) {
      score = 1.0;
    } else if (lowerTitle.includes(lowerQuery)) {
      score = 0.85;
    } else {
      const matchCount = cleanTerms.filter((term) =>
        lowerTitle.includes(term.toLowerCase())
      ).length;
      score = Math.min(0.8, 0.4 + (matchCount / (cleanTerms.length || 1)) * 0.4);
    }

    return {
      id: doc.sourceId.toString(),
      sourceType: doc.sourceType,
      contentType,
      title: doc.title,
      description: doc.content.length > 200 ? `${doc.content.substring(0, 197)}...` : doc.content,
      content: doc.content,
      courseId: doc.courseId ? doc.courseId.toString() : undefined,
      moduleId: doc.moduleId ? doc.moduleId.toString() : undefined,
      lessonId: doc.lessonId ? doc.lessonId.toString() : undefined,
      courseTitle: doc.metadata.courseTitle,
      moduleTitle: doc.metadata.moduleTitle,
      score,
      href,
      metadata: {
        category: doc.metadata.category,
        level: doc.metadata.level,
        duration: doc.metadata.duration,
        contentType: doc.metadata.contentType,
      },
    };
  });

  return results;
}

export interface GroupedSearchSource {
  sourceId: string;
  sourceType: string;
  title: string;
  courseTitle?: string;
  chunkCount: number;
  hasEmbedding: boolean;
  lastUpdated: string;
}

export async function getSearchIndexStats(): Promise<{
  totalDocuments: number;
  totalChunks: number;
  withEmbeddings: number;
  withoutEmbeddings: number;
  byType: Record<string, number>;
}> {
  const collection = await getSearchDocumentsCollection();
  const totalChunks = await collection.countDocuments({});
  const withEmbeddings = await collection.countDocuments({
    embedding: { $exists: true, $ne: [] },
  });
  const withoutEmbeddings = totalChunks - withEmbeddings;

  const distinctSources = await collection.distinct("sourceId");
  const totalDocuments = distinctSources.length;

  const typeAgg = await collection.aggregate<{ _id: string; count: number }>([
    { $group: { _id: "$sourceType", count: { $sum: 1 } } },
  ]).toArray();

  const byType: Record<string, number> = {};
  for (const t of typeAgg) {
    byType[t._id || "unknown"] = t.count;
  }

  return {
    totalDocuments,
    totalChunks,
    withEmbeddings,
    withoutEmbeddings,
    byType,
  };
}

export async function getGroupedSearchSources(limit = 100): Promise<GroupedSearchSource[]> {
  const collection = await getSearchDocumentsCollection();
  const groups = await collection.aggregate<{
    _id: ObjectId;
    sourceType: string;
    title: string;
    courseTitle?: string;
    chunkCount: number;
    hasEmbedding: boolean;
    lastUpdated: Date;
  }>([
    {
      $group: {
        _id: "$sourceId",
        sourceType: { $first: "$sourceType" },
        title: { $first: "$title" },
        courseTitle: { $first: "$metadata.courseTitle" },
        chunkCount: { $sum: 1 },
        hasEmbedding: {
          $max: {
            $cond: [
              {
                $and: [
                  { $ne: ["$embedding", null] },
                  { $gt: [{ $size: { $ifNull: ["$embedding", []] } }, 0] },
                ],
              },
              true,
              false,
            ],
          },
        },
        lastUpdated: { $max: "$updatedAt" },
      },
    },
    { $sort: { lastUpdated: -1 } },
    { $limit: limit },
  ]).toArray();

  return groups.map((g) => ({
    sourceId: g._id.toString(),
    sourceType: g.sourceType || "lesson",
    title: g.title ? g.title.replace(/ \(Part \d+\)$/, "") : "Untitled Content",
    courseTitle: g.courseTitle,
    chunkCount: g.chunkCount,
    hasEmbedding: Boolean(g.hasEmbedding),
    lastUpdated: g.lastUpdated ? g.lastUpdated.toISOString() : new Date().toISOString(),
  }));
}

