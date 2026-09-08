import clientPromise from "@/lib/db/mongodb";
import { logger } from "@/lib/logger/logger";

export async function createDatabaseIndexes() {
  try {
    const client = await clientPromise;
    const db = client.db("searchlearn");

    logger.info("database", "Starting MongoDB index verification & creation...");

    // Users indexes
    await db.collection("users").createIndex({ clerkId: 1 }, { unique: true });
    await db.collection("users").createIndex({ email: 1 });
    await db.collection("users").createIndex({ role: 1 });
    await db.collection("users").createIndex({ createdAt: -1 });

    // Courses indexes
    await db.collection("courses").createIndex({ slug: 1 }, { unique: true });
    await db.collection("courses").createIndex({ instructorId: 1 });
    await db.collection("courses").createIndex({ published: 1 });
    await db.collection("courses").createIndex({ createdAt: -1 });

    // Modules indexes
    await db.collection("modules").createIndex({ courseId: 1 });
    await db.collection("modules").createIndex({ courseId: 1, order: 1 });

    // Lessons indexes
    await db.collection("lessons").createIndex({ courseId: 1 });
    await db.collection("lessons").createIndex({ moduleId: 1 });
    await db.collection("lessons").createIndex({ moduleId: 1, order: 1 });

    // Enrollments indexes
    await db.collection("enrollments").createIndex(
      { userId: 1, courseId: 1 },
      { unique: true }
    );
    await db.collection("enrollments").createIndex({ userId: 1 });
    await db.collection("enrollments").createIndex({ courseId: 1 });
    await db.collection("enrollments").createIndex({ enrolledAt: -1 });
    await db.collection("enrollments").createIndex({ completed: 1 });

    // Lesson progress indexes
    await db.collection("lessonProgress").createIndex(
      { userId: 1, lessonId: 1 },
      { unique: true }
    );
    await db.collection("lessonProgress").createIndex({ userId: 1, courseId: 1 });
    await db.collection("lessonProgress").createIndex({ completed: 1 });

    // Search Documents indexes
    try {
      await db.collection("searchDocuments").dropIndex("sourceId_1");
    } catch {
      // Legacy index may not exist
    }

    await db.collection("searchDocuments").createIndex(
      { sourceId: 1, chunkIndex: 1 },
      { unique: true }
    );
    await db.collection("searchDocuments").createIndex({ sourceType: 1 });
    await db.collection("searchDocuments").createIndex({ courseId: 1 });
    await db.collection("searchDocuments").createIndex({ moduleId: 1 });
    await db.collection("searchDocuments").createIndex({ lessonId: 1 });

    // Search History indexes
    await db.collection("searchHistory").createIndex({ userId: 1, createdAt: -1 });
    await db.collection("searchHistory").createIndex({ createdAt: -1 });
    await db.collection("searchHistory").createIndex({ query: 1 });

    // Learning Documents indexes
    await db.collection("learning_documents").createIndex({ uploadedBy: 1 });
    await db.collection("learning_documents").createIndex({ courseId: 1 });
    await db.collection("learning_documents").createIndex({ processingStatus: 1 });
    await db.collection("learning_documents").createIndex({ createdAt: -1 });

    // AI Request Logs indexes
    await db.collection("aiRequestLogs").createIndex({ userId: 1, createdAt: -1 });
    await db.collection("aiRequestLogs").createIndex({ feature: 1 });
    await db.collection("aiRequestLogs").createIndex({ createdAt: -1 });
    await db.collection("aiRequestLogs").createIndex({ success: 1 });

    // Platform Activities indexes
    await db.collection("platformActivities").createIndex({ createdAt: -1 });
    await db.collection("platformActivities").createIndex({ userId: 1, createdAt: -1 });
    await db.collection("platformActivities").createIndex({ type: 1 });
    await db.collection("platformActivities").createIndex({ category: 1, createdAt: -1 });

    // Search Clicks indexes
    await db.collection("searchClicks").createIndex({ clickedAt: -1 });
    await db.collection("searchClicks").createIndex({ searchQuery: 1 });
    await db.collection("searchClicks").createIndex({ userId: 1 });

    logger.info("database", "All MongoDB indexes verified and created successfully.");
    return { success: true };
  } catch (error) {
    logger.error("database", "Failed to create database indexes", error);
    throw error;
  }
}