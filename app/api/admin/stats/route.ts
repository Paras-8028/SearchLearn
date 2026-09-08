import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/require-user";
import { getAdminPlatformStats } from "@/lib/db/repositories/courses";

export async function GET() {
  try {
    const user = await requireAdmin();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Forbidden: Administrator role required." },
        { status: 403 }
      );
    }

    const stats = await getAdminPlatformStats();

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("[GET /api/admin/stats] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch platform statistics" },
      { status: 500 }
    );
  }
}
