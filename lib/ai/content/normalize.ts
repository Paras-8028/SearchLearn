/**
 * Content normalization utilities for SmartLearn AI Processing Pipeline
 */

/**
 * Normalizes text while preserving paragraph boundaries and semantic structure
 */
export function normalizeText(text: string): string {
  if (!text) return "";

  return text
    // Replace carriage returns with standard linefeeds
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    // Replace non-breaking spaces and tabs with regular spaces
    .replace(/[\u00A0\u2000-\u200B\t]/g, " ")
    // Remove control characters (except newline)
    .replace(/[\x00-\x09\x0B-\x1F\x7F]/g, "")
    // Trim each line
    .split("\n")
    .map((line) => line.trim().replace(/ +/g, " "))
    .join("\n")
    // Condense 3 or more consecutive line breaks into 2 (paragraphs)
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * Cleans learning content by removing HTML markup if present and normalizing spacing
 */
export function cleanLearningContent(content: string): string {
  if (!content) return "";

  let cleaned = content;

  // Strip basic HTML tags if the text came from a rich text editor
  if (/<[a-z][\s\S]*>/i.test(cleaned)) {
    cleaned = cleaned
      .replace(/<br\s*[\/]?>/gi, "\n")
      .replace(/<\/p>/gi, "\n\n")
      .replace(/<\/h[1-6]>/gi, "\n\n")
      .replace(/<\/li>/gi, "\n")
      .replace(/<[^>]+>/g, "");
  }

  return normalizeText(cleaned);
}
