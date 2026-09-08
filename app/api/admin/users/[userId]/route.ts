import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { requireAdmin } from "@/lib/auth/require-user";
import {
  findUserById,
  updateUserRole,
  countAdmins,
  serializeUser,
} from "@/lib/db/repositories/users";
import { isValidUserRole } from "@/lib/auth/roles";
import type { UserRole } from "@/types/user";

import { logPlatformActivity } from "@/lib/db/repositories/platform-activities";
import { getUserDetailSummary } from "@/lib/db/repositories/admin";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const adminUser = await requireAdmin();
    if (!adminUser) {
      return NextResponse.json(
        { success: false, error: "Forbidden: Administrator role required." },
        { status: 403 }
      );
    }

    const { userId } = await params;
    const detail = await getUserDetailSummary(userId);

    if (!detail) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: detail,
    });
  } catch (error) {
    console.error("[GET /api/admin/users/[userId]] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch user details" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const adminUser = await requireAdmin();
    if (!adminUser) {
      return NextResponse.json(
        { success: false, error: "Forbidden: Administrator role required." },
        { status: 403 }
      );
    }

    const { userId } = await params;
    const targetUser = await findUserById(userId);

    if (!targetUser) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { role } = body as { role: UserRole };

    if (!role || !isValidUserRole(role)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid role specified. Must be 'student', 'instructor', or 'admin'.",
        },
        { status: 400 }
      );
    }

    // Security Guard: Prevent demoting the last remaining admin
    if (targetUser.role === "admin" && role !== "admin") {
      const adminCount = await countAdmins();
      if (adminCount <= 1) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Cannot demote the last remaining platform administrator. Please appoint another administrator first.",
          },
          { status: 400 }
        );
      }
    }

    const oldRole = targetUser.role;

    // 1. Authoritative MongoDB Update
    await updateUserRole(targetUser.clerkId, role);
    targetUser.role = role;

    // 2. Best-effort Clerk publicMetadata sync
    try {
      const client = await clerkClient();
      await client.users.updateUserMetadata(targetUser.clerkId, {
        publicMetadata: { role },
      });
    } catch (clerkErr) {
      console.warn(
        `[PATCH /api/admin/users/${userId}] Clerk metadata sync warning:`,
        clerkErr
      );
    }

    // 3. Log platform activity
    await logPlatformActivity({
      type: "USER_ROLE_CHANGED",
      userId: targetUser.clerkId,
      userEmail: targetUser.email || undefined,
      userName: `${targetUser.firstName || ""} ${targetUser.lastName || ""}`.trim() || undefined,
      entityType: "user",
      entityId: targetUser.clerkId,
      message: `Role changed from ${oldRole} to ${role} by administrator ${adminUser.email}`,
      metadata: {
        adminId: adminUser.clerkId,
        previousRole: oldRole,
        newRole: role,
      },
    });

    return NextResponse.json({
      success: true,
      data: serializeUser(targetUser),
    });
  } catch (error) {
    console.error("[PATCH /api/admin/users/[userId]] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update user role" },
      { status: 500 }
    );
  }
}
