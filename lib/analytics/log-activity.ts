import { createActivity } from "@/lib/db/repositories/activity";
import type { PlatformActivityType, ActivityCategory } from "@/types/activity";
import { logger } from "@/lib/logger/logger";

export interface LogActivityParams {
  userId?: string;
  userEmail?: string;
  userName?: string;
  eventType: PlatformActivityType | string;
  category: ActivityCategory | string;
  entityType?: string;
  entityId?: string;
  message?: string;
  metadata?: Record<string, unknown>;
}

function generateDefaultMessage(params: LogActivityParams): string {
  const actor = params.userName || params.userEmail || (params.userId ? `User ${params.userId.slice(-6)}` : "System");

  switch (params.eventType) {
    case "COURSE_ENROLLED":
      return `${actor} enrolled in ${params.metadata?.courseTitle || "a course"}`;
    case "COURSE_COMPLETED":
      return `${actor} completed course ${params.metadata?.courseTitle || ""}`;
    case "LESSON_STARTED":
      return `${actor} started lesson ${params.metadata?.lessonTitle || ""}`;
    case "LESSON_COMPLETED":
      return `${actor} completed lesson ${params.metadata?.lessonTitle || ""}`;
    case "SEARCH_PERFORMED":
      return `${actor} searched for "${params.metadata?.query || ""}"`;
    case "SEARCH_NO_RESULTS":
      return `Search query returned 0 results: "${params.metadata?.query || ""}"`;
    case "SEARCH_RESULT_CLICKED":
      return `${actor} clicked search result for "${params.metadata?.query || ""}"`;
    case "COURSE_CREATED":
      return `${actor} created new course "${params.metadata?.courseTitle || ""}"`;
    case "COURSE_UPDATED":
      return `${actor} updated course "${params.metadata?.courseTitle || ""}"`;
    case "COURSE_DELETED":
      return `${actor} deleted course "${params.metadata?.courseTitle || ""}"`;
    case "DOCUMENT_UPLOADED":
      return `${actor} uploaded document "${params.metadata?.fileName || ""}"`;
    case "DOCUMENT_PROCESSED":
      return `Document "${params.metadata?.fileName || ""}" processed successfully`;
    case "DOCUMENT_PROCESSING_FAILED":
      return `Document processing failed for "${params.metadata?.fileName || ""}"`;
    case "AI_REQUEST":
    case "AI_REQUEST_COMPLETED":
      return `AI generated ${params.metadata?.feature || "response"} for ${actor}`;
    case "AI_REQUEST_FAILED":
      return `AI request failed for ${params.metadata?.feature || "operation"}`;
    case "USER_REGISTERED":
      return `New user account registered: ${actor}`;
    case "USER_SIGNED_IN":
      return `${actor} signed in to SmartLearn`;
    default:
      return `${actor} performed ${params.eventType}`;
  }
}

export async function logActivity(params: LogActivityParams): Promise<void> {
  try {
    const message = params.message || generateDefaultMessage(params);

    await createActivity({
      type: params.eventType,
      eventType: params.eventType,
      category: params.category,
      userId: params.userId,
      userEmail: params.userEmail,
      userName: params.userName,
      entityType: params.entityType,
      entityId: params.entityId,
      message,
      metadata: params.metadata,
    });
  } catch (err) {
    // Non-blocking fallback: never crash callers due to telemetry logging
    logger.warn("system", "Failed to log platform activity safely", {
      eventType: params.eventType,
    }, err instanceof Error ? err : undefined);
  }
}
