import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getCourseById, getCourseBySlug } from "@/lib/db/repositories/courses";
import { getEnrollment } from "@/lib/db/repositories/enrollments";
import { getCompletedLessonIds, getCourseProgress } from "@/lib/db/repositories/lesson-progress";
import { getLessonsByCourseId } from "@/lib/db/repositories/lessons";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { courseId } = await params;
    let course = await getCourseById(courseId);
    if (!course) {
      course = await getCourseBySlug(courseId);
    }

    if (!course) {
      return NextResponse.json(
        { success: false, error: "Course not found" },
        { status: 404 }
      );
    }

    const enrollment = await getEnrollment(userId, course._id);
    const lessons = await getLessonsByCourseId(course._id);
    const completedLessonIds = await getCompletedLessonIds(userId, course._id);
    const lessonProgresses = await getCourseProgress(userId, course._id);

    const totalLessons = lessons.length;
    const completedCount = completedLessonIds.length;
    const progressPercentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

    return NextResponse.json({
      success: true,
      data: {
        enrollment,
        totalLessons,
        completedCount,
        progressPercentage,
        completedLessonIds,
        lessonProgresses,
      },
    });
  } catch (error) {
    console.error("[GET /api/courses/[courseId]/progress] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch course progress" },
      { status: 500 }
    );
  }
}
