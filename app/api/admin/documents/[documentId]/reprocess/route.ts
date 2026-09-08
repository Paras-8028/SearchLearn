import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/require-user";
import { getDocumentById, updateDocumentStatus } from "@/lib/db/repositories/documents";
import { processLearningContent } from "@/lib/ai/content/processor";
import { logPlatformActivity } from "@/lib/db/repositories/platform-activities";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ documentId: string }> }
) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Forbidden: Administrator role required" },
        { status: 403 }
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

    // Set status to processing
    await updateDocumentStatus(documentId, "processing");

    try {
      // Content processing pipeline: normalize, chunk, embedding, searchDocuments upsert
      const result = await processLearningContent({
        sourceId: doc._id,
        sourceType: "document",
        title: doc.title,
        content: doc.extractedText || doc.description || doc.title,
        courseId: doc.courseId,
        metadata: {
          fileName: doc.fileName,
          fileType: doc.fileType,
          uploadedBy: doc.uploadedBy,
        },
      });

      const updated = await updateDocumentStatus(documentId, "completed");

      // Log platform activity
      await logPlatformActivity({
        type: "DOCUMENT_REPROCESSED",
        userId: admin.clerkId,
        userName: `${admin.firstName || ""} ${admin.lastName || ""}`.trim() || undefined,
        entityType: "document",
        entityId: doc._id,
        message: `Document "${doc.title}" reprocessed: generated ${result.chunksCount} chunks and ${result.embeddingsGenerated} embeddings.`,
        metadata: {
          chunksCount: result.chunksCount,
          embeddingsGenerated: result.embeddingsGenerated,
        },
      });

      return NextResponse.json({
        success: true,
        data: updated,
        chunksCount: result.chunksCount,
        embeddingsCount: result.embeddingsGenerated,
      });
    } catch (procErr) {
      const errorMsg = procErr instanceof Error ? procErr.message : "Processing failed";
      await updateDocumentStatus(documentId, "failed", { processingError: errorMsg });
      throw procErr;
    }
  } catch (error) {
    console.error("[POST /api/admin/documents/[documentId]/reprocess] Error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Reprocessing failed" },
      { status: 500 }
    );
  }
}
