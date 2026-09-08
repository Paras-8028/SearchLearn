import { NextResponse } from "next/server";

export const ERROR_CODES = {
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  DATABASE_ERROR: "DATABASE_ERROR",
  AI_SERVICE_ERROR: "AI_SERVICE_ERROR",
  RATE_LIMITED: "RATE_LIMITED",
  INTERNAL_ERROR: "INTERNAL_ERROR",
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiErrorResponse {
  success: false;
  error: {
    message: string;
    code: ErrorCode | string;
    details?: unknown;
  };
}

export function successResponse<T>(
  data: T,
  status = 200,
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  },
  headers?: Record<string, string>
) {
  const body: ApiSuccessResponse<T> = {
    success: true,
    data,
    ...(pagination ? { pagination } : {}),
  };

  return NextResponse.json(body, {
    status,
    headers: headers ? new Headers(headers) : undefined,
  });
}

export function errorResponse(
  message: string,
  code: ErrorCode | string = ERROR_CODES.INTERNAL_ERROR,
  status = 400,
  details?: unknown,
  headers?: Record<string, string>
) {
  const body: ApiErrorResponse = {
    success: false,
    error: {
      message,
      code,
      ...(details !== undefined ? { details } : {}),
    },
  };

  return NextResponse.json(body, {
    status,
    headers: headers ? new Headers(headers) : undefined,
  });
}

export function validationErrorResponse(
  message = "Validation failed",
  details?: unknown
) {
  return errorResponse(message, ERROR_CODES.VALIDATION_ERROR, 400, details);
}

export function unauthorizedResponse(message = "Unauthorized") {
  return errorResponse(message, ERROR_CODES.UNAUTHORIZED, 401);
}

export function forbiddenResponse(
  message = "You do not have permission to perform this action"
) {
  return errorResponse(message, ERROR_CODES.FORBIDDEN, 403);
}

export function notFoundResponse(message = "Resource not found") {
  return errorResponse(message, ERROR_CODES.NOT_FOUND, 404);
}

export function rateLimitedResponse(
  message = "Too many requests. Please try again later.",
  retryAfterSeconds?: number
) {
  const headers: Record<string, string> = {};
  if (retryAfterSeconds) {
    headers["Retry-After"] = String(retryAfterSeconds);
  }

  return errorResponse(
    message,
    ERROR_CODES.RATE_LIMITED,
    429,
    undefined,
    headers
  );
}

export function serverErrorResponse(
  error?: unknown,
  message = "An unexpected error occurred"
) {
  const details =
    process.env.NODE_ENV !== "production" && error instanceof Error
      ? { name: error.name, message: error.message, stack: error.stack }
      : undefined;

  return errorResponse(message, ERROR_CODES.INTERNAL_ERROR, 500, details);
}
