import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getLessonById, getLessonsByCourseId } from "@/lib/db/repositories/lessons";
import { upsertLessonProgress, getCompletedLessonIds } from "@/lib/db/repositories/lesson-progress";
import { createEnrollment, updateEnrollmentProgress } from "@/lib/db/repositories/enrollments";
import { logActivity } from "@/lib/analytics/log-activity";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { lessonId } = await params;
    const lesson = await getLessonById(lessonId);

    if (!lesson) {
      return NextResponse.json(
        { success: false, error: "Lesson not found" },
        { status: 404 }
      );
    }

    let body: { completed?: boolean; progress?: number } = {};
    try {
      body = await request.json();
    } catch {
      body = { completed: true };
    }

    const completed = body.completed ?? true;
    const progress = body.progress ?? (completed ? 100 : 0);

    // Upsert lesson progress
    const lessonProgress = await upsertLessonProgress({
      userId,
      courseId: lesson.courseId,
      moduleId: lesson.moduleId,
      lessonId: lesson._id,
      completed,
      progress,
    });

    // Ensure enrollment exists
    await createEnrollment(userId, lesson.courseId);

    // Recalculate course progress
    const allCourseLessons = await getLessonsByCourseId(lesson.courseId);
    const completedLessonIds = await getCompletedLessonIds(userId, lesson.courseId);

    const totalLessons = allCourseLessons.length;
    const completedCount = completedLessonIds.length;
    const progressPercentage =
      totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

    const enrollment = await updateEnrollmentProgress(
      userId,
      lesson.courseId,
      progressPercentage,
      lesson._id
    );

    // Record activity log
    if (completed) {
      logActivity({
        userId,
        eventType: "LESSON_COMPLETED",
        category: "LEARNING",
        entityType: "lesson",
        entityId: lesson._id,
        metadata: {
          lessonTitle: lesson.title,
          courseId: lesson.courseId,
        },
      }).catch(() => {});

      if (progressPercentage === 100) {
        logActivity({
          userId,
          eventType: "COURSE_COMPLETED",
          category: "LEARNING",
          entityType: "course",
          entityId: lesson.courseId,
          metadata: {
            courseId: lesson.courseId,
          },
        }).catch(() => {});
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        lessonProgress,
        enrollment,
        completedCount,
        totalLessons,
        progressPercentage,
      },
    });
  } catch (error) {
    console.error("[POST /api/lessons/[lessonId]/progress] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update lesson progress" },
      { status: 500 }
    );
  }
}
