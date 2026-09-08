import { NextResponse } from "next/server";
import { requireUser, canManageCourse } from "@/lib/auth/require-user";
import {
  getModuleById,
  updateModule,
  deleteModuleCascade,
} from "@/lib/db/repositories/modules";
import { UpdateModuleSchema } from "@/lib/validations/module";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ moduleId: string }> }
) {
  try {
    const { moduleId } = await params;
    const mod = await getModuleById(moduleId);

    if (!mod) {
      return NextResponse.json(
        { success: false, error: "Module not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: mod,
    });
  } catch (error) {
    console.error("[GET /api/modules/[moduleId]] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch module" },
      { status: 500 }
    );
  }
}

export async function PATCH(
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
          error: "Forbidden: You do not have permission to edit this module.",
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validation = UpdateModuleSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: validation.error.issues[0]?.message || "Invalid input",
        },
        { status: 400 }
      );
    }

    const updated = await updateModule(moduleId, validation.data);

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    console.error("[PATCH /api/modules/[moduleId]] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update module" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
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
          error: "Forbidden: You do not have permission to delete this module.",
        },
        { status: 403 }
      );
    }

    const success = await deleteModuleCascade(moduleId);
    if (!success) {
      return NextResponse.json(
        { success: false, error: "Failed to delete module" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Module deleted successfully",
    });
  } catch (error) {
    console.error("[DELETE /api/modules/[moduleId]] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete module" },
      { status: 500 }
    );
  }
}
