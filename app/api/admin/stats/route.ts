import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/require-user";

export async function GET() {
  try {
    const user = await requireAdmin();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Forbidden: Administrator role required." },
        { status: 403 }
      );
    }

    const { getAdminDashboardSummary } = await import("@/lib/db/repositories/admin");
    const summary = await getAdminDashboardSummary();

    return NextResponse.json({
      success: true,
      data: summary,
    });
  } catch (error) {
    console.error("[GET /api/admin/stats] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch platform statistics" },
      { status: 500 }
    );
  }
}
