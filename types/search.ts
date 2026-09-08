import type { ObjectId } from "mongodb";

export type SearchContentType =
  | "course"
  | "module"
  | "lesson"
  | "document"
  | "video"
  | "article";

export type RelevanceLabel = "Highly Relevant" | "Relevant" | "Related";

export interface SearchResult {
  id: string;
  sourceType: "course" | "module" | "lesson";
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
  href: string;
  metadata?: {
    category?: string;
    level?: string;
    duration?: number;
    contentType?: string;
  };
}

export interface SearchDocument {
  _id?: ObjectId;
  sourceType: "course" | "module" | "lesson";
  sourceId: ObjectId;
  courseId?: ObjectId;
  moduleId?: ObjectId;
  lessonId?: ObjectId;
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
  };
  embedding?: number[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SearchDocumentDTO {
  _id: string;
  sourceType: "course" | "module" | "lesson";
  sourceId: string;
  courseId?: string;
  moduleId?: string;
  lessonId?: string;
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
