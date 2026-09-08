/**
 * Content validation utilities for SearchLearn AI Processing Pipeline
 */

export interface ContentValidationResult {
  valid: boolean;
  error?: string;
  sanitizedLength: number;
}

export function validateContent(
  content: string,
  minLength = 10,
  maxLength = 500000
): ContentValidationResult {
  if (!content || typeof content !== "string") {
    return {
      valid: false,
      error: "Content must be a non-empty string",
      sanitizedLength: 0,
    };
  }

  const trimmed = content.trim();
  const length = trimmed.length;

  if (length < minLength) {
    return {
      valid: false,
      error: `Content is too short (minimum ${minLength} characters required)`,
      sanitizedLength: length,
    };
  }

  if (length > maxLength) {
    return {
      valid: false,
      error: `Content exceeds maximum allowed limit of ${maxLength} characters`,
      sanitizedLength: length,
    };
  }

  return {
    valid: true,
    sanitizedLength: length,
  };
}
