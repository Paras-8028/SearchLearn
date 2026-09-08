import type { ObjectId } from "mongodb";

export interface LessonProgress {
  _id?: ObjectId;
  userId: string;
  courseId: ObjectId;
  moduleId: ObjectId;
  lessonId: ObjectId;
  completed: boolean;
  progress: number;
  lastAccessedAt: Date;
  completedAt?: Date;
}

export interface LessonProgressDTO {
  _id: string;
  userId: string;
  courseId: string;
  moduleId: string;
  lessonId: string;
  completed: boolean;
  progress: number;
  lastAccessedAt: string;
  completedAt?: string;
}
