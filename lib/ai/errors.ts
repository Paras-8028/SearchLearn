/**
 * Centralized error handler and response sanitizer for AI services
 */

export interface SafeAiError {
  status: number;
  message: string;
  code: string;
}

export function sanitizeAiError(error: unknown, feature: string): SafeAiError {
  const errorString = error instanceof Error ? error.message : String(error);
  const lower = errorString.toLowerCase();

  console.error(`[AI Error - ${feature}]:`, error);

  if (lower.includes("rate limit") || lower.includes("429")) {
    return {
      status: 429,
      message: "AI request rate limit reached. Please wait a moment before trying again.",
      code: "RATE_LIMIT_EXCEEDED",
    };
  }

  if (lower.includes("api key") || lower.includes("unauthorized") || lower.includes("401")) {
    return {
      status: 503,
      message: "AI services are currently unconfigured or unavailable. Please contact the administrator.",
      code: "AI_CONFIG_ERROR",
    };
  }

  if (lower.includes("timeout") || lower.includes("timed out") || lower.includes("econnreset")) {
    return {
      status: 504,
      message: "AI request timed out. The learning content may be extensive. Please try again.",
      code: "AI_TIMEOUT",
    };
  }

  if (lower.includes("context length") || lower.includes("maximum context")) {
    return {
      status: 413,
      message: "The content is too extensive for the AI model to process in a single request.",
      code: "CONTEXT_LENGTH_EXCEEDED",
    };
  }

  return {
    status: 500,
    message: "An error occurred while communicating with the AI learning service.",
    code: "AI_INTERNAL_ERROR",
  };
}
