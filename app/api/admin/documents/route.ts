import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/require-user";
import { getDocuments } from "@/lib/db/repositories/documents";

export async function GET(request: Request) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Forbidden: Administrator role required" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get("courseId") || undefined;
    const userId = searchParams.get("userId") || undefined;

    const documents = await getDocuments({ courseId, userId });

    return NextResponse.json({
      success: true,
      data: documents,
    });
  } catch (error) {
    console.error("[GET /api/admin/documents] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch documents" },
      { status: 500 }
    );
  }
}
