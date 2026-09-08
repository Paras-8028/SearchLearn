import { NextResponse } from "next/server";
import { requireUser, canManageCourse } from "@/lib/auth/require-user";
import { createModule, reorderModules } from "@/lib/db/repositories/modules";
import { CreateModuleSchema } from "@/lib/validations/module";

export async function POST(
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
    const validation = CreateModuleSchema.safeParse({
      ...body,
      courseId,
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

    const moduleDoc = await createModule(validation.data);

    return NextResponse.json(
      {
        success: true,
        data: moduleDoc,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/courses/[courseId]/modules] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create module" },
      { status: 500 }
    );
  }
}

export async function PUT(
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
    const { moduleIds } = body;

    if (!Array.isArray(moduleIds)) {
      return NextResponse.json(
        { success: false, error: "moduleIds must be an array of strings" },
        { status: 400 }
      );
    }

    await reorderModules(courseId, moduleIds);

    return NextResponse.json({
      success: true,
      message: "Modules reordered successfully",
    });
  } catch (error) {
    console.error("[PUT /api/courses/[courseId]/modules] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to reorder modules" },
      { status: 500 }
    );
  }
}
