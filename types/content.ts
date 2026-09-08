export type LearningContentType =
  | "course"
  | "lesson"
  | "lesson_description"
  | "note"
  | "document"
  | "transcript";

export interface ContentChunk {
  index: number;
  text: string;
  startPosition?: number;
  endPosition?: number;
}

export interface ProcessContentInput {
  sourceType: LearningContentType;
  sourceId: string;
  courseId?: string;
  moduleId?: string;
  lessonId?: string;
  title: string;
  content: string;
  metadata?: Record<string, unknown>;
}

export interface ProcessedContentResult {
  sourceId: string;
  sourceType: LearningContentType;
  title: string;
  chunksCount: number;
  chunks: ContentChunk[];
  embeddingsGenerated: number;
}
