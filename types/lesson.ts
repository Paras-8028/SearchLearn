import type { ObjectId } from "mongodb";

export type LessonContentType = "video" | "article" | "document" | "quiz";

export interface Lesson {
  _id?: ObjectId;
  courseId: ObjectId;
  moduleId: ObjectId;
  title: string;
  description?: string;
  contentType: LessonContentType;
  content?: string;
  videoUrl?: string;
  duration?: number;
  order: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface LessonInput {
  courseId: ObjectId | string;
  moduleId: ObjectId | string;
  title: string;
  description?: string;
  contentType: LessonContentType;
  content?: string;
  videoUrl?: string;
  duration?: number;
  order: number;
  published?: boolean;
}

export interface LessonDTO {
  _id: string;
  courseId: string;
  moduleId: string;
  title: string;
  description?: string;
  contentType: LessonContentType;
  content?: string;
  videoUrl?: string;
  duration?: number;
  order: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}
