import { auth } from "@clerk/nextjs/server";
import { hybridSearch } from "@/lib/search/hybrid-search";
import { SearchQuerySchema } from "@/lib/validations/search";
import { createSearchHistory } from "@/lib/db/repositories/search-history";
import { logActivity } from "@/lib/analytics/log-activity";
import {
  successResponse,
  validationErrorResponse,
  rateLimitedResponse,
  serverErrorResponse,
} from "@/lib/api/response";
import {
  checkRateLimit,
  RATE_LIMIT_PRESETS,
  getClientIdentifier,
} from "@/lib/security/rate-limit";
import type { SearchContentType } from "@/types/search";

export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    const clientId = getClientIdentifier(request, userId);
    const rateCheck = checkRateLimit(clientId, RATE_LIMIT_PRESETS.SEARCH);
    if (!rateCheck.allowed) {
      return rateLimitedResponse(
        "Search rate limit exceeded. Please wait a moment before searching again.",
        rateCheck.retryAfterSeconds
      );
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || searchParams.get("query") || "";
    const courseId = searchParams.get("courseId") || undefined;
    const limit = searchParams.get("limit") ? Number(searchParams.get("limit")) : 20;

    const rawContentTypes = searchParams.get("contentTypes");
    let contentTypes: SearchContentType[] | undefined;
    if (rawContentTypes) {
      contentTypes = rawContentTypes.split(",") as SearchContentType[];
    }

    const validation = SearchQuerySchema.safeParse({
      query,
      contentTypes,
      courseId,
      limit,
    });

    if (!validation.success) {
      return validationErrorResponse(
        validation.error.issues[0]?.message || "Invalid search query",
        validation.error.flatten().fieldErrors
      );
    }

    const results = await hybridSearch(validation.data);

    // Save search history and log activity
    try {
      const { userId } = await auth();
      if (userId) {
        await createSearchHistory(userId, validation.data.query, {
          contentTypes: validation.data.contentTypes,
          courseId: validation.data.courseId,
        });
      }

      logActivity({
        userId: userId || undefined,
        eventType: results.length === 0 ? "SEARCH_NO_RESULTS" : "SEARCH_PERFORMED",
        category: "SEARCH",
        metadata: {
          query: validation.data.query,
          resultCount: results.length,
        },
      }).catch(() => {});
    } catch {
      // Non-blocking history record
    }

    return successResponse({
      query: validation.data.query,
      results,
      total: results.length,
    });
  } catch (error) {
    console.error("[GET /api/search] Error:", error);
    return serverErrorResponse(error, "An error occurred while performing search");
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    const clientId = getClientIdentifier(request, userId);
    const rateCheck = checkRateLimit(clientId, RATE_LIMIT_PRESETS.SEARCH);
    if (!rateCheck.allowed) {
      return rateLimitedResponse(
        "Search rate limit exceeded. Please wait a moment before searching again.",
        rateCheck.retryAfterSeconds
      );
    }

    const body = await request.json();
    const validation = SearchQuerySchema.safeParse(body);

    if (!validation.success) {
      return validationErrorResponse(
        validation.error.issues[0]?.message || "Invalid search payload",
        validation.error.flatten().fieldErrors
      );
    }

    const results = await hybridSearch(validation.data);

    // Save search history if user is authenticated
    try {
      if (userId) {
        await createSearchHistory(userId, validation.data.query, {
          contentTypes: validation.data.contentTypes,
          courseId: validation.data.courseId,
        });
      }
    } catch {
      // Non-blocking history record
    }

    return successResponse({
      query: validation.data.query,
      results,
      total: results.length,
    });
  } catch (error) {
    console.error("[POST /api/search] Error:", error);
    return serverErrorResponse(error, "An error occurred while performing search");
  }
}
