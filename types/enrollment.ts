import type { ObjectId } from "mongodb";
import type { CourseDTO } from "./course";

export interface Enrollment {
  _id?: ObjectId;
  userId: string;
  courseId: ObjectId;
  enrolledAt: Date;
  completedAt?: Date;
  lastLessonId?: ObjectId;
  progressPercentage: number;
}

export interface EnrollmentDTO {
  _id: string;
  userId: string;
  courseId: string;
  enrolledAt: string;
  completedAt?: string;
  lastLessonId?: string;
  progressPercentage: number;
}

export interface EnrollmentWithCourseDTO extends EnrollmentDTO {
  course?: CourseDTO;
  completedLessonsCount?: number;
  totalLessonsCount?: number;
}
