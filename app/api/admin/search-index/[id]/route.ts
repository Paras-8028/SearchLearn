import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/require-user";
import { deleteSearchDocumentsBySourceId } from "@/lib/db/repositories/search";
import { logPlatformActivity } from "@/lib/db/repositories/platform-activities";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Forbidden: Administrator role required" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const deletedCount = await deleteSearchDocumentsBySourceId(id);

    await logPlatformActivity({
      type: "CONTENT_REINDEXED",
      userId: admin.clerkId,
      userName: `${admin.firstName || ""} ${admin.lastName || ""}`.trim() || undefined,
      entityType: "search_index",
      entityId: id,
      message: `Deleted ${deletedCount} search index chunks for source ID ${id}.`,
      metadata: { deletedCount },
    });

    return NextResponse.json({
      success: true,
      message: `Deleted ${deletedCount} index entries.`,
      deletedCount,
    });
  } catch (error) {
    console.error("[DELETE /api/admin/search-index/[id]] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete search index entry" },
      { status: 500 }
    );
  }
}
