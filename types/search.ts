import type { ObjectId } from "mongodb";

export type SearchContentType =
  | "course"
  | "module"
  | "lesson"
  | "document"
  | "video"
  | "article"
  | "quiz"
  | "note"
  | "transcript";

export type SearchSourceType =
  | "course"
  | "module"
  | "lesson"
  | "document"
  | "note"
  | "transcript";

export type RelevanceLabel = "Highly Relevant" | "Relevant" | "Related";

export interface SearchResult {
  id: string;
  sourceType: SearchSourceType;
  contentType: SearchContentType;
  title: string;
  description?: string;
  content?: string;
  courseId?: string;
  moduleId?: string;
  lessonId?: string;
  courseTitle?: string;
  moduleTitle?: string;
  score?: number;
  relevanceLabel?: RelevanceLabel;
  chunkIndex?: number;
  href: string;
  metadata?: {
    category?: string;
    level?: string;
    duration?: number;
    contentType?: string;
    fileName?: string;
    fileType?: string;
  };
}

export interface SearchDocument {
  _id?: ObjectId;
  sourceType: SearchSourceType;
  sourceId: ObjectId;
  courseId?: ObjectId;
  moduleId?: ObjectId;
  lessonId?: ObjectId;
  chunkIndex?: number;
  title: string;
  content: string;
  searchableText: string;
  metadata: {
    courseTitle?: string;
    moduleTitle?: string;
    category?: string;
    level?: string;
    contentType?: string;
    duration?: number;
    slug?: string;
    fileName?: string;
    fileType?: string;
  };
  embedding?: number[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SearchDocumentDTO {
  _id: string;
  sourceType: SearchSourceType;
  sourceId: string;
  courseId?: string;
  moduleId?: string;
  lessonId?: string;
  chunkIndex?: number;
  title: string;
  content: string;
  searchableText: string;
  metadata: {
    courseTitle?: string;
    moduleTitle?: string;
    category?: string;
    level?: string;
    contentType?: string;
    duration?: number;
    slug?: string;
    fileName?: string;
    fileType?: string;
  };
  embedding?: number[];
  createdAt: string;
  updatedAt: string;
}

export interface SearchOptions {
  query: string;
  contentTypes?: SearchContentType[];
  courseId?: string;
  limit?: number;
  minScore?: number;
}
