import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/require-user";
import { getAllUsers } from "@/lib/db/repositories/users";
import { isValidUserRole } from "@/lib/auth/roles";
import type { UserRole } from "@/types/user";

export async function GET(request: Request) {
  try {
    const user = await requireAdmin();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Forbidden: Administrator role required." },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || undefined;
    const roleParam = searchParams.get("role") || undefined;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    const role: UserRole | "all" =
      roleParam && isValidUserRole(roleParam) ? roleParam : "all";

    const result = await getAllUsers({
      search,
      role,
      page,
      limit,
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("[GET /api/admin/users] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
