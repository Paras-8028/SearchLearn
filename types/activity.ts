import type { ObjectId } from "mongodb";

export type PlatformActivityType =
  | "USER_REGISTERED"
  | "USER_SIGNED_IN"
  | "USER_ROLE_CHANGED"
  | "COURSE_CREATED"
  | "COURSE_UPDATED"
  | "COURSE_PUBLISHED"
  | "COURSE_UNPUBLISHED"
  | "COURSE_DELETED"
  | "COURSE_ENROLLED"
  | "COURSE_COMPLETED"
  | "LESSON_STARTED"
  | "LESSON_COMPLETED"
  | "SEARCH_PERFORMED"
  | "SEARCH_NO_RESULTS"
  | "SEARCH_RESULT_CLICKED"
  | "AI_REQUEST"
  | "AI_REQUEST_COMPLETED"
  | "AI_REQUEST_FAILED"
  | "DOCUMENT_UPLOADED"
  | "DOCUMENT_PROCESSED"
  | "DOCUMENT_PROCESSING_FAILED"
  | "DOCUMENT_REPROCESSED"
  | "DOCUMENT_DELETED"
  | "CONTENT_REINDEXED";

export type ActivityCategory =
  | "LEARNING"
  | "SEARCH"
  | "AI"
  | "COURSE"
  | "DOCUMENT"
  | "USER"
  | "ADMIN";

export interface PlatformActivity {
  _id?: ObjectId;
  type: PlatformActivityType | string;
  eventType?: PlatformActivityType | string;
  category?: ActivityCategory | string;
  userId?: string;
  userEmail?: string;
  userName?: string;
  entityType?: "user" | "course" | "module" | "lesson" | "document" | "search_index" | string;
  entityId?: string;
  message: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

export interface PlatformActivityDTO {
  _id: string;
  type: string;
  eventType: string;
  category: string;
  userId?: string;
  userEmail?: string;
  userName?: string;
  entityType?: string;
  entityId?: string;
  message: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export type ActivityLog = PlatformActivity;
export type ActivityLogDTO = PlatformActivityDTO;
