import type { ObjectId } from "mongodb";

export type CourseLevel = "beginner" | "intermediate" | "advanced";

export interface Course {
  _id?: ObjectId;
  title: string;
  slug: string;
  description: string;
  thumbnail?: string;
  instructorId: string;
  category?: string;
  level?: CourseLevel;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CourseDTO {
  _id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail?: string;
  instructorId: string;
  category?: string;
  level?: CourseLevel;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}
