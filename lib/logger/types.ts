export type LogLevel = "debug" | "info" | "warn" | "error";

export type ErrorCategory =
  | "authentication"
  | "authorization"
  | "database"
  | "ai"
  | "search"
  | "content-processing"
  | "validation"
  | "api"
  | "system";

export interface LogMetadata {
  [key: string]: unknown;
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  category: ErrorCategory;
  requestId?: string;
  metadata?: LogMetadata;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}
