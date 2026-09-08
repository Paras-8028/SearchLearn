import type { ObjectId } from "mongodb";

export interface CourseModule {
  _id?: ObjectId;
  courseId: ObjectId;
  title: string;
  description?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CourseModuleInput {
  courseId: ObjectId | string;
  title: string;
  description?: string;
  order: number;
}

export interface CourseModuleDTO {
  _id: string;
  courseId: string;
  title: string;
  description?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}
