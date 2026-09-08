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
import { validateUploadedFile } from "@/lib/validations/files";
import {
  checkRateLimit,
  RATE_LIMIT_PRESETS,
  getClientIdentifier,
} from "@/lib/security/rate-limit";
import {
  successResponse,
  unauthorizedResponse,
  validationErrorResponse,
  rateLimitedResponse,
  serverErrorResponse,
  errorResponse,
} from "@/lib/api/response";

export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return unauthorizedResponse();
    }

    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get("courseId") || undefined;

    const docs = await getDocuments({ userId, courseId });
    return successResponse(docs);
  } catch (error) {
    console.error("[GET /api/documents] Error:", error);
    return serverErrorResponse(error, "Failed to fetch learning documents");
  }
}

export async function POST(request: Request) {
  const startTime = Date.now();
  let currentUserId = "";

  try {
    const { userId } = await auth();
    if (!userId) {
      return unauthorizedResponse();
    }
    currentUserId = userId;

    // Rate limit check
    const clientId = getClientIdentifier(request, userId);
    const rateCheck = checkRateLimit(clientId, RATE_LIMIT_PRESETS.DOCUMENT_UPLOAD);
    if (!rateCheck.allowed) {
      return rateLimitedResponse(
        "Rate limit exceeded. Please wait a moment before uploading more documents.",
        rateCheck.retryAfterSeconds
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const titleInput = formData.get("title") as string | null;
    const description = (formData.get("description") as string | null) || undefined;
    const courseId = (formData.get("courseId") as string | null) || undefined;

    if (!file) {
      return validationErrorResponse("No document file provided");
    }

    // Centralized file security validation
    const fileValidation = validateUploadedFile(file);
    if (!fileValidation.valid || !fileValidation.fileType) {
      return validationErrorResponse(
        fileValidation.error || "Invalid document file"
      );
    }

    const { fileType, sanitizedFileName } = fileValidation;
    const originalName = sanitizedFileName || file.name;
    const ext = path.extname(originalName).toLowerCase();
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

      return successResponse(updated, 201);
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

      return errorResponse(
        `Document saved but processing failed: ${errorMsg}`,
        "DOCUMENT_PROCESSING_FAILED",
        500,
        { document: documentRecord }
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

    return serverErrorResponse(error, errorMsg);
  }
}
