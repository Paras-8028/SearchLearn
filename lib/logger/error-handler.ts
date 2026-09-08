import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { logger } from "./logger";
import { getOrGenerateRequestId } from "./request-context";
import type { ErrorCategory } from "./types";

export class AppError extends Error {
  constructor(
    public override message: string,
    public statusCode: number = 500,
    public code: string = "INTERNAL_SERVER_ERROR",
    public category: ErrorCategory = "system",
    public details?: unknown
  ) {
    super(message);
    this.name = "AppError";
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export function handleApiError(
  error: unknown,
  request?: Request,
  defaultCategory: ErrorCategory = "api"
): NextResponse {
  const requestId = getOrGenerateRequestId(request);

  if (error instanceof AppError) {
    logger.warn(
      error.category,
      `[${error.code}] ${error.message}`,
      { statusCode: error.statusCode, details: error.details },
      error,
      requestId
    );

    return NextResponse.json(
      {
        success: false,
        error: {
          code: error.code,
          message: error.message,
          requestId,
        },
      },
      { status: error.statusCode }
    );
  }

  if (error instanceof ZodError) {
    logger.warn(
      "validation",
      "Input validation failed",
      { issues: error.issues },
      error,
      requestId
    );

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "The provided request parameters or body are invalid.",
          requestId,
          details: error.flatten().fieldErrors,
        },
      },
      { status: 400 }
    );
  }

  // Unhandled / system errors
  logger.error(
    defaultCategory,
    "Unhandled exception in API route",
    error,
    undefined,
    requestId
  );

  const isProduction = process.env.NODE_ENV === "production";
  const message = isProduction
    ? "An unexpected system error occurred. Please try again later."
    : error instanceof Error
      ? error.message
      : "An unexpected system error occurred.";

  return NextResponse.json(
    {
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message,
        requestId,
      },
    },
    { status: 500 }
  );
}
