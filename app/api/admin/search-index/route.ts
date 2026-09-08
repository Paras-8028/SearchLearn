import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/require-user";
import {
  getSearchIndexStats,
  getGroupedSearchSources,
} from "@/lib/db/repositories/search";
import { getCourses } from "@/lib/db/repositories/courses";
import { getLessonsByCourseId, getLessonById } from "@/lib/db/repositories/lessons";
import { getDocuments, getDocumentById } from "@/lib/db/repositories/documents";
import { processLearningContent } from "@/lib/ai/content/processor";
import { logPlatformActivity } from "@/lib/db/repositories/platform-activities";

export async function GET() {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Forbidden: Administrator role required" },
        { status: 403 }
      );
    }

    const [stats, sources] = await Promise.all([
      getSearchIndexStats(),
      getGroupedSearchSources(100),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        stats,
        sources,
      },
    });
  } catch (error) {
    console.error("[GET /api/admin/search-index] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch search index stats" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Forbidden: Administrator role required" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { action, sourceId, sourceType } = body as {
      action: "reindex_all" | "reindex_source";
      sourceId?: string;
      sourceType?: "course" | "lesson" | "document";
    };

    if (action === "reindex_source" && sourceId && sourceType) {
      let reindexedTitle = "";

      if (sourceType === "course") {
        const courses = await getCourses({ publishedOnly: false });
        const course = courses.find((c) => c._id === sourceId);
        if (course) {
          reindexedTitle = course.title;
          await processLearningContent({
            sourceId: course._id,
            sourceType: "course",
            title: course.title,
            content: course.description,
            courseId: course._id,
            metadata: {
              category: course.category,
              level: course.level,
            },
          });
        }
      } else if (sourceType === "lesson") {
        const lesson = await getLessonById(sourceId);
        if (lesson) {
          reindexedTitle = lesson.title;
          await processLearningContent({
            sourceId: lesson._id,
            sourceType: "lesson",
            title: lesson.title,
            content: lesson.content || lesson.description || lesson.title,
            courseId: lesson.courseId,
            moduleId: lesson.moduleId,
            lessonId: lesson._id,
            metadata: {
              contentType: lesson.contentType,
              duration: lesson.duration,
            },
          });
        }
      } else if (sourceType === "document") {
        const doc = await getDocumentById(sourceId);
        if (doc) {
          reindexedTitle = doc.title;
          await processLearningContent({
            sourceId: doc._id,
            sourceType: "document",
            title: doc.title,
            content: doc.extractedText || doc.description || doc.title,
            courseId: doc.courseId,
            metadata: {
              fileName: doc.fileName,
              fileType: doc.fileType,
              uploadedBy: doc.uploadedBy,
            },
          });
        }
      }

      await logPlatformActivity({
        type: "CONTENT_REINDEXED",
        userId: admin.clerkId,
        userName: `${admin.firstName || ""} ${admin.lastName || ""}`.trim() || undefined,
        entityType: "search_index",
        entityId: sourceId,
        message: `Reindexed search content for ${sourceType}: "${reindexedTitle}"`,
      });

      return NextResponse.json({
        success: true,
        message: `Successfully reindexed ${sourceType} "${reindexedTitle}"`,
      });
    }

    if (action === "reindex_all") {
      // Reindex all published courses, lessons, and completed documents
      let count = 0;

      const courses = await getCourses({ publishedOnly: true });
      for (const course of courses) {
        await processLearningContent({
          sourceId: course._id,
          sourceType: "course",
          title: course.title,
          content: course.description,
          courseId: course._id,
          metadata: {
            category: course.category,
            level: course.level,
          },
        }).catch((err) => console.warn(`Reindexing course ${course._id} failed:`, err));
        count++;

        const lessons = await getLessonsByCourseId(course._id);
        for (const lesson of lessons) {
          if (lesson.published) {
            await processLearningContent({
              sourceId: lesson._id,
              sourceType: "lesson",
              title: lesson.title,
              content: lesson.content || lesson.description || lesson.title,
              courseId: lesson.courseId,
              moduleId: lesson.moduleId,
              lessonId: lesson._id,
              metadata: {
                courseTitle: course.title,
                contentType: lesson.contentType,
                duration: lesson.duration,
              },
            }).catch((err) => console.warn(`Reindexing lesson ${lesson._id} failed:`, err));
            count++;
          }
        }
      }

      const docs = await getDocuments();
      for (const doc of docs) {
        if (doc.processingStatus === "completed") {
          await processLearningContent({
            sourceId: doc._id,
            sourceType: "document",
            title: doc.title,
            content: doc.extractedText || doc.description || doc.title,
            courseId: doc.courseId,
            metadata: {
              fileName: doc.fileName,
              fileType: doc.fileType,
              uploadedBy: doc.uploadedBy,
            },
          }).catch((err) => console.warn(`Reindexing document ${doc._id} failed:`, err));
          count++;
        }
      }

      await logPlatformActivity({
        type: "CONTENT_REINDEXED",
        userId: admin.clerkId,
        userName: `${admin.firstName || ""} ${admin.lastName || ""}`.trim() || undefined,
        entityType: "search_index",
        message: `Bulk platform reindex completed: processed ${count} content entities into vector searchDocuments.`,
        metadata: { entitiesProcessed: count },
      });

      return NextResponse.json({
        success: true,
        message: `Bulk reindexing completed for ${count} content items.`,
        count,
      });
    }

    return NextResponse.json(
      { success: false, error: "Invalid action or parameters" },
      { status: 400 }
    );
  } catch (error) {
    console.error("[POST /api/admin/search-index] Error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Reindexing failed" },
      { status: 500 }
    );
  }
}
