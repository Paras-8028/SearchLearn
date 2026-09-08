import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { hybridSearch } from "@/lib/search/hybrid-search";
import { SearchQuerySchema } from "@/lib/validations/search";
import { createSearchHistory } from "@/lib/db/repositories/search-history";
import type { SearchContentType } from "@/types/search";

export async function GET(request: Request) {
  try {
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
      return NextResponse.json(
        {
          success: false,
          error: validation.error.issues[0]?.message || "Invalid search query",
        },
        { status: 400 }
      );
    }

    const results = await hybridSearch(validation.data);

    // Save search history if user is authenticated
    try {
      const { userId } = await auth();
      if (userId) {
        await createSearchHistory(userId, validation.data.query, {
          contentTypes: validation.data.contentTypes,
          courseId: validation.data.courseId,
        });
      }
    } catch {
      // Non-blocking history record
    }

    return NextResponse.json({
      success: true,
      data: {
        query: validation.data.query,
        results,
        total: results.length,
      },
    });
  } catch (error) {
    console.error("[GET /api/search] Error:", error);
    return NextResponse.json(
      { success: false, error: "An error occurred while performing search" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = SearchQuerySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: validation.error.issues[0]?.message || "Invalid search payload",
        },
        { status: 400 }
      );
    }

    const results = await hybridSearch(validation.data);

    // Save search history if user is authenticated
    try {
      const { userId } = await auth();
      if (userId) {
        await createSearchHistory(userId, validation.data.query, {
          contentTypes: validation.data.contentTypes,
          courseId: validation.data.courseId,
        });
      }
    } catch {
      // Non-blocking history record
    }

    return NextResponse.json({
      success: true,
      data: {
        query: validation.data.query,
        results,
        total: results.length,
      },
    });
  } catch (error) {
    console.error("[POST /api/search] Error:", error);
    return NextResponse.json(
      { success: false, error: "An error occurred while performing search" },
      { status: 500 }
    );
  }
}
