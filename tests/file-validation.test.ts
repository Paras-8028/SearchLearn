import { describe, it, expect } from "vitest";
import {
  validateUploadedFile,
  sanitizeFileName,
  MAX_FILE_SIZE_BYTES,
} from "@/lib/validations/files";

describe("File Upload Security Validation", () => {
  it("approves valid PDF documents", () => {
    const file = {
      name: "intro-to-machine-learning.pdf",
      size: 1024 * 500, // 500 KB
      type: "application/pdf",
    };

    const res = validateUploadedFile(file);
    expect(res.valid).toBe(true);
    expect(res.fileType).toBe("pdf");
  });

  it("approves valid Markdown and TXT files", () => {
    const mdFile = {
      name: "notes.md",
      size: 2048,
      type: "text/markdown",
    };
    expect(validateUploadedFile(mdFile).valid).toBe(true);

    const txtFile = {
      name: "syllabus.txt",
      size: 4096,
      type: "text/plain",
    };
    expect(validateUploadedFile(txtFile).valid).toBe(true);
  });

  it("rejects unsupported extensions like .exe, .js, or .sh", () => {
    const malicious = {
      name: "exploit.exe",
      size: 1024,
      type: "application/x-msdownload",
    };
    const res = validateUploadedFile(malicious);
    expect(res.valid).toBe(false);
    expect(res.error).toContain("Unsupported file type");
  });

  it("rejects empty files (0 bytes)", () => {
    const emptyFile = {
      name: "blank.txt",
      size: 0,
      type: "text/plain",
    };
    const res = validateUploadedFile(emptyFile);
    expect(res.valid).toBe(false);
    expect(res.error).toContain("empty");
  });

  it("rejects files exceeding maximum size limit", () => {
    const hugeFile = {
      name: "huge.pdf",
      size: MAX_FILE_SIZE_BYTES + 1024,
      type: "application/pdf",
    };
    const res = validateUploadedFile(hugeFile);
    expect(res.valid).toBe(false);
    expect(res.error).toContain("exceeds the limit");
  });

  it("sanitizes filenames preventing path traversal", () => {
    expect(sanitizeFileName("../../../etc/passwd")).toBe("passwd");
    expect(sanitizeFileName("..\\..\\windows\\system32\\config.sys")).toBe("config.sys");
    expect(sanitizeFileName("test<file>:name?.pdf")).toBe("test_file__name_.pdf");
  });
});
