import { NextResponse } from "next/server";
import {
  getCourseById,
  getCourseBySlug,
  updateCourse,
  deleteCourseCascade,
} from "@/lib/db/repositories/courses";
import { getModulesByCourseId } from "@/lib/db/repositories/modules";
import { getLessonsByModuleId } from "@/lib/db/repositories/lessons";
import { requireUser, canManageCourse } from "@/lib/auth/require-user";
import { UpdateCourseSchema } from "@/lib/validations/course";
import { processLearningContent } from "@/lib/ai/content/processor";
import { deleteSearchDocumentsBySourceId } from "@/lib/db/repositories/search";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
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

    const modules = await getModulesByCourseId(course._id);
    const modulesWithLessons = await Promise.all(
      modules.map(async (mod) => {
        const lessons = await getLessonsByModuleId(mod._id);
        return {
          ...mod,
          lessons,
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: {
        ...course,
        modules: modulesWithLessons,
      },
    });
  } catch (error) {
    console.error("[GET /api/courses/[courseId]] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch course details" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const user = await requireUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { courseId } = await params;
    const canManage = await canManageCourse(courseId, user);
    if (!canManage) {
      return NextResponse.json(
        {
          success: false,
          error: "Forbidden: You do not have permission to manage this course.",
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validationResult = UpdateCourseSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: validationResult.error.issues[0]?.message || "Invalid input",
        },
        { status: 400 }
      );
    }

    const updated = await updateCourse(courseId, validationResult.data);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Course not found" },
        { status: 404 }
      );
    }

    // Update search index
    if (updated.published) {
      processLearningContent({
        sourceId: updated._id,
        sourceType: "course",
        title: updated.title,
        content: updated.description,
        courseId: updated._id,
        metadata: {
          category: updated.category,
          level: updated.level,
        },
      }).catch((err) =>
        console.error("[PATCH /api/courses/[courseId]] Search indexing failed:", err)
      );
    } else {
      // If unpublished, delete search documents for course
      deleteSearchDocumentsBySourceId(updated._id).catch((err) =>
        console.error("[PATCH /api/courses/[courseId]] Search delete failed:", err)
      );
    }

    if (validationResult.data.published !== undefined) {
      const { logPlatformActivity } = await import("@/lib/db/repositories/platform-activities");
      await logPlatformActivity({
        type: updated.published ? "COURSE_PUBLISHED" : "COURSE_UNPUBLISHED",
        userId: user.clerkId,
        userName: `${user.firstName || ""} ${user.lastName || ""}`.trim() || undefined,
        entityType: "course",
        entityId: updated._id,
        message: `Course "${updated.title}" was ${updated.published ? "published" : "moved to drafts"}.`,
      });
    }

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    console.error("[PATCH /api/courses/[courseId]] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update course" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const user = await requireUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { courseId } = await params;
    const canManage = await canManageCourse(courseId, user);
    if (!canManage) {
      return NextResponse.json(
        {
          success: false,
          error: "Forbidden: You do not have permission to delete this course.",
        },
        { status: 403 }
      );
    }

    const courseToDelete = await getCourseById(courseId);

    const success = await deleteCourseCascade(courseId);
    if (!success) {
      return NextResponse.json(
        { success: false, error: "Course not found or could not be deleted" },
        { status: 404 }
      );
    }

    const { logPlatformActivity } = await import("@/lib/db/repositories/platform-activities");
    await logPlatformActivity({
      type: "COURSE_DELETED",
      userId: user.clerkId,
      userName: `${user.firstName || ""} ${user.lastName || ""}`.trim() || undefined,
      entityType: "course",
      entityId: courseId,
      message: `Course "${courseToDelete?.title || courseId}" permanently deleted with cascading child cleanup.`,
    });

    return NextResponse.json({
      success: true,
      message: "Course and related content deleted successfully.",
    });
  } catch (error) {
    console.error("[DELETE /api/courses/[courseId]] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete course" },
      { status: 500 }
    );
  }
}

