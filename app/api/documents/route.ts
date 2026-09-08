import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import fs from "fs/promises";
import path from "path";
import {
  createDocument,
  getDocuments,
  updateDocumentStatus,
} from "@/lib/db/repositories/documents";
import { extractDocumentText } from "@/lib/documents/extract-text";
import { processLearningContent } from "@/lib/ai/content/processor";
import { logAiRequest } from "@/lib/db/repositories/ai-request-logs";
import { checkRateLimit } from "@/lib/ai/rate-limit";
import type { DocumentFileType } from "@/types/document";

const MAX_FILE_SIZE =
  (Number(process.env.MAX_DOCUMENT_SIZE_MB) || 10) * 1024 * 1024; // 10MB default

const ALLOWED_EXTENSIONS: Record<string, DocumentFileType> = {
  ".pdf": "pdf",
  ".txt": "txt",
  ".md": "md",
};

export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get("courseId") || undefined;

    const docs = await getDocuments({ userId, courseId });

    return NextResponse.json({
      success: true,
      data: docs,
    });
  } catch (error) {
    console.error("[GET /api/documents] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch learning documents" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const startTime = Date.now();
  let currentUserId = "";

  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    currentUserId = userId;

    // Rate limit check
    const rateCheck = await checkRateLimit(userId);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Rate limit exceeded. Please wait a moment before uploading more documents.",
        },
        { status: 429 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const titleInput = formData.get("title") as string | null;
    const description = (formData.get("description") as string | null) || undefined;
    const courseId = (formData.get("courseId") as string | null) || undefined;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No document file provided" },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: `File size exceeds limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
        },
        { status: 400 }
      );
    }

    const originalName = file.name;
    const ext = path.extname(originalName).toLowerCase();
    const fileType = ALLOWED_EXTENSIONS[ext];

    if (!fileType) {
      return NextResponse.json(
        {
          success: false,
          error: "Unsupported file type. Only PDF (.pdf), TXT (.txt), and Markdown (.md) are supported.",
        },
        { status: 400 }
      );
    }

    const title = titleInput?.trim() || path.basename(originalName, ext);

    // Save file locally to uploads/documents/
    const uploadDir = path.join(process.cwd(), "uploads", "documents");
    await fs.mkdir(uploadDir, { recursive: true });

    const safeFileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
    const storagePath = path.join(uploadDir, safeFileName);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.writeFile(storagePath, buffer);

    // Create database document record
    const documentRecord = await createDocument({
      title,
      description,
      courseId,
      uploadedBy: userId,
      fileName: originalName,
      fileType,
      fileSize: file.size,
      storagePath,
    });

    // Extract text from file buffer
    let extractedText = "";
    try {
      await updateDocumentStatus(documentRecord._id, "processing");

      const extraction = await extractDocumentText(buffer, fileType);
      extractedText = extraction.text;

      // Run content processing pipeline (chunking + embedding + search indexing)
      await processLearningContent({
        sourceType: "document",
        sourceId: documentRecord._id,
        courseId,
        title,
        content: extractedText,
        metadata: {
          fileName: originalName,
          fileType,
          fileSize: file.size,
          description,
        },
      });

      const updated = await updateDocumentStatus(documentRecord._id, "completed", {
        extractedText,
      });

      await logAiRequest({
        userId,
        feature: "document_process",
        success: true,
        durationMs: Date.now() - startTime,
      });

      return NextResponse.json(
        {
          success: true,
          data: updated,
        },
        { status: 201 }
      );
    } catch (procErr: unknown) {
      const errorMsg =
        procErr instanceof Error ? procErr.message : "Failed during text extraction or indexing";

      await updateDocumentStatus(documentRecord._id, "failed", {
        processingError: errorMsg,
      });

      await logAiRequest({
        userId,
        feature: "document_process",
        success: false,
        error: errorMsg,
        durationMs: Date.now() - startTime,
      });

      return NextResponse.json(
        {
          success: false,
          error: `Document saved but processing failed: ${errorMsg}`,
          data: documentRecord,
        },
        { status: 500 }
      );
    }
  } catch (error: unknown) {
    console.error("[POST /api/documents] Error:", error);
    const errorMsg = error instanceof Error ? error.message : "Internal server error";

    if (currentUserId) {
      await logAiRequest({
        userId: currentUserId,
        feature: "document_process",
        success: false,
        error: errorMsg,
        durationMs: Date.now() - startTime,
      });
    }

    return NextResponse.json(
      { success: false, error: errorMsg },
      { status: 500 }
    );
  }
}
