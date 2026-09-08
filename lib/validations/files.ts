import path from "path";
import type { DocumentFileType } from "@/types/document";

export const MAX_DOCUMENT_SIZE_MB =
  Number(process.env.MAX_DOCUMENT_SIZE_MB) || 10;
export const MAX_FILE_SIZE_BYTES = MAX_DOCUMENT_SIZE_MB * 1024 * 1024;

export const ALLOWED_EXTENSIONS: Record<string, DocumentFileType> = {
  ".pdf": "pdf",
  ".txt": "txt",
  ".md": "md",
};

export const ALLOWED_MIME_TYPES: Record<string, DocumentFileType> = {
  "application/pdf": "pdf",
  "text/plain": "txt",
  "text/markdown": "md",
  "text/x-markdown": "md",
  "application/octet-stream": "txt", // common fallback for raw text files
};

export interface FileValidationResult {
  valid: boolean;
  error?: string;
  fileType?: DocumentFileType;
  sanitizedFileName?: string;
}

/**
 * Sanitizes filename to prevent directory traversal and special character injection
 */
export function sanitizeFileName(originalName: string): string {
  const base = path.basename(originalName);
  // Strip control characters, quotes, null bytes, backslashes
  return base
    .replace(/[\x00-\x1f\x80-\x9f]/g, "")
    .replace(/[\/\\:*?"<>|]/g, "_")
    .replace(/\.\.+/g, ".")
    .trim();
}

/**
 * Centralized validator for uploaded learning documents
 */
export function validateUploadedFile(
  file: File | { name: string; size: number; type?: string }
): FileValidationResult {
  if (!file || typeof file.size !== "number") {
    return { valid: false, error: "No document file provided or invalid file object." };
  }

  // 1. Check for empty files
  if (file.size === 0) {
    return { valid: false, error: "Uploaded file is empty (0 bytes)." };
  }

  // 2. Check maximum allowed file size
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File size exceeds the limit of ${MAX_DOCUMENT_SIZE_MB}MB.`,
    };
  }

  // 3. Validate extension
  const originalName = file.name || "";
  const ext = path.extname(originalName).toLowerCase();
  const fileTypeFromExt = ALLOWED_EXTENSIONS[ext];

  if (!fileTypeFromExt) {
    return {
      valid: false,
      error: "Unsupported file type. Allowed formats: PDF (.pdf), TXT (.txt), Markdown (.md).",
    };
  }

  // 4. Validate MIME type if provided
  if (file.type) {
    const mimeNormalized = file.type.toLowerCase().split(";")[0].trim();
    // Allow if known mime matches or if generic text/octet
    const mimeValid =
      Boolean(ALLOWED_MIME_TYPES[mimeNormalized]) ||
      mimeNormalized.startsWith("text/");

    if (!mimeValid) {
      return {
        valid: false,
        error: `Invalid file MIME type: ${file.type}. Expected a document (PDF, TXT, or Markdown).`,
      };
    }
  }

  const sanitizedFileName = sanitizeFileName(originalName);

  return {
    valid: true,
    fileType: fileTypeFromExt,
    sanitizedFileName,
  };
}
