import { NextResponse } from "next/server";
import { requireUser, canManageCourse } from "@/lib/auth/require-user";
import { getModuleById } from "@/lib/db/repositories/modules";
import { createLesson, reorderLessons } from "@/lib/db/repositories/lessons";
import { CreateLessonSchema } from "@/lib/validations/lesson";
import { processLearningContent } from "@/lib/ai/content/processor";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ moduleId: string }> }
) {
  try {
    const user = await requireUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { moduleId } = await params;
    const mod = await getModuleById(moduleId);
    if (!mod) {
      return NextResponse.json(
        { success: false, error: "Module not found" },
        { status: 404 }
      );
    }

    const canManage = await canManageCourse(mod.courseId, user);
    if (!canManage) {
      return NextResponse.json(
        {
          success: false,
          error: "Forbidden: You do not have permission to add lessons to this course.",
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validation = CreateLessonSchema.safeParse({
      ...body,
      courseId: mod.courseId,
      moduleId,
    });

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: validation.error.issues[0]?.message || "Invalid input",
        },
        { status: 400 }
      );
    }

    const lesson = await createLesson(validation.data);

    // Background AI semantic search indexing (non-blocking)
    if (lesson.published) {
      processLearningContent({
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
      }).catch((err) =>
        console.error("[POST /api/modules/[moduleId]/lessons] Background indexing error:", err)
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: lesson,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/modules/[moduleId]/lessons] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create lesson" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ moduleId: string }> }
) {
  try {
    const user = await requireUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { moduleId } = await params;
    const mod = await getModuleById(moduleId);
    if (!mod) {
      return NextResponse.json(
        { success: false, error: "Module not found" },
        { status: 404 }
      );
    }

    const canManage = await canManageCourse(mod.courseId, user);
    if (!canManage) {
      return NextResponse.json(
        {
          success: false,
          error: "Forbidden: You do not have permission to reorder lessons in this course.",
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { lessonIds } = body;

    if (!Array.isArray(lessonIds)) {
      return NextResponse.json(
        { success: false, error: "lessonIds must be an array of strings" },
        { status: 400 }
      );
    }

    await reorderLessons(moduleId, lessonIds);

    return NextResponse.json({
      success: true,
      message: "Lessons reordered successfully",
    });
  } catch (error) {
    console.error("[PUT /api/modules/[moduleId]/lessons] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to reorder lessons" },
      { status: 500 }
    );
  }
}
