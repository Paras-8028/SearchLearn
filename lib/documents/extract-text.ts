import { PDFParse } from "pdf-parse";
import { cleanLearningContent } from "@/lib/ai/content/normalize";
import type { DocumentFileType } from "@/types/document";

export interface ExtractedDocumentResult {
  text: string;
  pageCount?: number;
  metadata?: Record<string, unknown>;
}

/**
 * Extracts plain text from TXT, Markdown, or PDF document buffers
 */
export async function extractDocumentText(
  buffer: Buffer,
  fileType: DocumentFileType
): Promise<ExtractedDocumentResult> {
  if (!buffer || buffer.length === 0) {
    throw new Error("Cannot extract text from an empty file buffer");
  }

  if (fileType === "txt" || fileType === "md") {
    const rawText = buffer.toString("utf-8");
    const cleaned = cleanLearningContent(rawText);
    return {
      text: cleaned,
      pageCount: 1,
    };
  }

  if (fileType === "pdf") {
    let parser: PDFParse | null = null;
    try {
      parser = new PDFParse({ data: buffer });
      const textResult = await parser.getText();
      const cleaned = cleanLearningContent(textResult.text || "");

      if (!cleaned || cleaned.trim().length === 0) {
        throw new Error(
          "No readable text could be extracted from this PDF. It may contain only scanned images or be password protected."
        );
      }

      return {
        text: cleaned,
        pageCount: textResult.total,
      };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Failed to parse PDF document";
      throw new Error(`PDF text extraction error: ${errorMsg}`);
    } finally {
      if (parser) {
        try {
          await parser.destroy();
        } catch {
          // ignore destroy errors
        }
      }
    }
  }

  throw new Error(`Unsupported document file type: ${fileType}`);
}
