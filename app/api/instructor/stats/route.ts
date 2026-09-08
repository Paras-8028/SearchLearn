import { NextResponse } from "next/server";
import { requireInstructorOrAdmin } from "@/lib/auth/require-user";
import { getInstructorStats } from "@/lib/db/repositories/courses";

export async function GET() {
  try {
    const user = await requireInstructorOrAdmin();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Forbidden: Instructor or Admin role required." },
        { status: 403 }
      );
    }

    const stats = await getInstructorStats(user.clerkId);

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("[GET /api/instructor/stats] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch instructor statistics" },
      { status: 500 }
    );
  }
}
