import { describe, it, expect } from "vitest";
import {
  successResponse,
  validationErrorResponse,
  unauthorizedResponse,
  forbiddenResponse,
  notFoundResponse,
  rateLimitedResponse,
  ERROR_CODES,
} from "@/lib/api/response";

describe("API Response Utilities", () => {
  it("generates a successful response with 200 status and correct payload", async () => {
    const res = successResponse({ id: "123", title: "Test Course" });
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.data.title).toBe("Test Course");
  });

  it("includes pagination metadata when provided in success response", async () => {
    const res = successResponse(
      ["item1", "item2"],
      200,
      { page: 1, limit: 10, total: 2, totalPages: 1 }
    );
    const data = await res.json();
    expect(data.pagination).toBeDefined();
    expect(data.pagination.total).toBe(2);
  });

  it("generates an unauthorized response with 401 status", async () => {
    const res = unauthorizedResponse();
    expect(res.status).toBe(401);

    const data = await res.json();
    expect(data.success).toBe(false);
    expect(data.error.code).toBe(ERROR_CODES.UNAUTHORIZED);
  });

  it("generates a forbidden response with 403 status", async () => {
    const res = forbiddenResponse("Access denied");
    expect(res.status).toBe(403);

    const data = await res.json();
    expect(data.success).toBe(false);
    expect(data.error.code).toBe(ERROR_CODES.FORBIDDEN);
    expect(data.error.message).toBe("Access denied");
  });

  it("generates a not found response with 404 status", async () => {
    const res = notFoundResponse("Course not found");
    expect(res.status).toBe(404);

    const data = await res.json();
    expect(data.success).toBe(false);
    expect(data.error.code).toBe(ERROR_CODES.NOT_FOUND);
  });

  it("generates a rate limited response with 429 status and Retry-After header", async () => {
    const res = rateLimitedResponse("Rate limit exceeded", 30);
    expect(res.status).toBe(429);
    expect(res.headers.get("Retry-After")).toBe("30");

    const data = await res.json();
    expect(data.success).toBe(false);
    expect(data.error.code).toBe(ERROR_CODES.RATE_LIMITED);
  });

  it("formats validation errors with error details", async () => {
    const res = validationErrorResponse("Invalid title", { field: "title" });
    expect(res.status).toBe(400);

    const data = await res.json();
    expect(data.success).toBe(false);
    expect(data.error.code).toBe(ERROR_CODES.VALIDATION_ERROR);
    expect(data.error.details).toEqual({ field: "title" });
  });
});
