import { NextResponse } from "next/server";
import { requireUser, canManageCourse } from "@/lib/auth/require-user";
import {
  getLessonById,
  updateLesson,
  deleteLessonCascade,
} from "@/lib/db/repositories/lessons";
import { UpdateLessonSchema } from "@/lib/validations/lesson";
import { processLearningContent } from "@/lib/ai/content/processor";
import { deleteSearchDocumentsBySourceId } from "@/lib/db/repositories/search";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const { lessonId } = await params;
    const lesson = await getLessonById(lessonId);

    if (!lesson) {
      return NextResponse.json(
        { success: false, error: "Lesson not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: lesson,
    });
  } catch (error) {
    console.error("[GET /api/lessons/[lessonId]] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch lesson" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const user = await requireUser();
    if (!user) {
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

    const canManage = await canManageCourse(lesson.courseId, user);
    if (!canManage) {
      return NextResponse.json(
        {
          success: false,
          error: "Forbidden: You do not have permission to edit this lesson.",
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validation = UpdateLessonSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: validation.error.issues[0]?.message || "Invalid input",
        },
        { status: 400 }
      );
    }

    const updated = await updateLesson(lessonId, validation.data);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Failed to update lesson" },
        { status: 500 }
      );
    }

    // Automatic Search Indexing Sync (Non-blocking)
    if (updated.published) {
      processLearningContent({
        sourceId: updated._id,
        sourceType: "lesson",
        title: updated.title,
        content: updated.content || updated.description || updated.title,
        courseId: updated.courseId,
        moduleId: updated.moduleId,
        lessonId: updated._id,
        metadata: {
          contentType: updated.contentType,
          duration: updated.duration,
        },
      }).catch((err) =>
        console.error("[PATCH /api/lessons/[lessonId]] Search indexing error:", err)
      );
    } else {
      deleteSearchDocumentsBySourceId(updated._id).catch((err) =>
        console.error("[PATCH /api/lessons/[lessonId]] Search delete error:", err)
      );
    }

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    console.error("[PATCH /api/lessons/[lessonId]] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update lesson" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const user = await requireUser();
    if (!user) {
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

    const canManage = await canManageCourse(lesson.courseId, user);
    if (!canManage) {
      return NextResponse.json(
        {
          success: false,
          error: "Forbidden: You do not have permission to delete this lesson.",
        },
        { status: 403 }
      );
    }

    const success = await deleteLessonCascade(lessonId);
    if (!success) {
      return NextResponse.json(
        { success: false, error: "Failed to delete lesson" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Lesson deleted successfully",
    });
  } catch (error) {
    console.error("[DELETE /api/lessons/[lessonId]] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete lesson" },
      { status: 500 }
    );
  }
}
