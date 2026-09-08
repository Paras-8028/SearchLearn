import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import fs from "fs/promises";
import {
  getDocumentById,
  deleteDocument,
} from "@/lib/db/repositories/documents";
import { deleteSearchDocumentsBySourceId } from "@/lib/db/repositories/search";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ documentId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { documentId } = await params;
    const doc = await getDocumentById(documentId);

    if (!doc) {
      return NextResponse.json(
        { success: false, error: "Document not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: doc,
    });
  } catch (error) {
    console.error("[GET /api/documents/[documentId]] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch document" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ documentId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { documentId } = await params;
    const doc = await getDocumentById(documentId);

    if (!doc) {
      return NextResponse.json(
        { success: false, error: "Document not found" },
        { status: 404 }
      );
    }

    const { getCurrentSearchLearnUser } = await import("@/lib/auth/current-user");
    const currentUser = await getCurrentSearchLearnUser();

    // Authorization check: owner or admin
    const isAdmin = currentUser?.role === "admin";
    if (doc.uploadedBy !== userId && !isAdmin) {
      return NextResponse.json(
        { success: false, error: "Forbidden: You cannot delete this document" },
        { status: 403 }
      );
    }

    // Delete local storage file if exists
    if (doc.storagePath) {
      try {
        await fs.unlink(doc.storagePath);
      } catch {
        // File may already be absent
      }
    }

    // Remove from search index
    await deleteSearchDocumentsBySourceId(documentId);

    // Delete DB record
    await deleteDocument(documentId);

    return NextResponse.json({
      success: true,
      message: "Document deleted successfully",
    });
  } catch (error) {
    console.error("[DELETE /api/documents/[documentId]] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete document" },
      { status: 500 }
    );
  }
}
