import type { LogLevel, ErrorCategory, LogMetadata, LogEntry } from "./types";

const SENSITIVE_KEY_PATTERNS = [
  /pass(word)?/i,
  /secret/i,
  /token/i,
  /key/i,
  /auth(orization)?/i,
  /cookie/i,
  /cert/i,
  /credential/i,
];

const SENSITIVE_STRING_PATTERNS = [
  /mongodb(\+srv)?:\/\/[^\s]+/gi,
  /sk-[a-zA-Z0-9_-]{20,}/g,
  /bearer\s+[a-zA-Z0-9_\-\.]+/gi,
];

function sanitizeValue(key: string, value: unknown): unknown {
  if (typeof value === "string") {
    // Check if key implies sensitive data
    if (SENSITIVE_KEY_PATTERNS.some((p) => p.test(key))) {
      return "[REDACTED]";
    }
    // Check string content for secrets
    let sanitized = value;
    for (const pattern of SENSITIVE_STRING_PATTERNS) {
      sanitized = sanitized.replace(pattern, "[REDACTED_SECRET]");
    }
    return sanitized;
  }

  if (value && typeof value === "object" && !Array.isArray(value)) {
    const sanitizedObj: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      sanitizedObj[k] = sanitizeValue(k, v);
    }
    return sanitizedObj;
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeValue(key, item));
  }

  return value;
}

function sanitizeMetadata(metadata?: LogMetadata): LogMetadata | undefined {
  if (!metadata) return undefined;
  return sanitizeValue("root", metadata) as LogMetadata;
}

class Logger {
  private formatLog(entry: LogEntry): string {
    return JSON.stringify(entry);
  }

  public log(
    level: LogLevel,
    category: ErrorCategory,
    message: string,
    metadata?: LogMetadata,
    error?: Error,
    requestId?: string
  ): void {
    try {
      const sanitizedMeta = sanitizeMetadata(metadata);
      const entry: LogEntry = {
        level,
        category,
        message,
        timestamp: new Date().toISOString(),
        ...(requestId ? { requestId } : {}),
        ...(sanitizedMeta ? { metadata: sanitizedMeta } : {}),
        ...(error
          ? {
              error: {
                name: error.name,
                message: error.message,
                ...(process.env.NODE_ENV !== "production" ? { stack: error.stack } : {}),
              },
            }
          : {}),
      };

      const formatted = this.formatLog(entry);

      switch (level) {
        case "error":
          console.error(formatted);
          break;
        case "warn":
          console.warn(formatted);
          break;
        case "info":
          console.info(formatted);
          break;
        case "debug":
          if (process.env.NODE_ENV !== "production") {
            console.debug(formatted);
          }
          break;
      }
    } catch (logErr) {
      // Fallback logging without crashing
      console.error("[Logger Internal Error]", logErr);
    }
  }

  public debug(
    category: ErrorCategory,
    message: string,
    metadata?: LogMetadata,
    requestId?: string
  ): void {
    this.log("debug", category, message, metadata, undefined, requestId);
  }

  public info(
    category: ErrorCategory,
    message: string,
    metadata?: LogMetadata,
    requestId?: string
  ): void {
    this.log("info", category, message, metadata, undefined, requestId);
  }

  public warn(
    category: ErrorCategory,
    message: string,
    metadata?: LogMetadata,
    error?: Error,
    requestId?: string
  ): void {
    this.log("warn", category, message, metadata, error, requestId);
  }

  public error(
    category: ErrorCategory,
    message: string,
    error?: unknown,
    metadata?: LogMetadata,
    requestId?: string
  ): void {
    const err = error instanceof Error ? error : error ? new Error(String(error)) : undefined;
    this.log("error", category, message, metadata, err, requestId);
  }
}

export const logger = new Logger();
