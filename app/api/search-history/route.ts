import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import {
  getRecentSearches,
  createSearchHistory,
  deleteSearchHistory,
  clearSearchHistory,
} from "@/lib/db/repositories/search-history";
import { CreateSearchHistorySchema } from "@/lib/validations/search";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: true, data: [] });
    }

    const history = await getRecentSearches(userId, 20);
    return NextResponse.json({
      success: true,
      data: history,
    });
  } catch (error) {
    console.error("[GET /api/search-history] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch search history" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validation = CreateSearchHistorySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: validation.error.issues[0]?.message || "Invalid payload",
        },
        { status: 400 }
      );
    }

    const item = await createSearchHistory(
      userId,
      validation.data.query,
      validation.data.filters
    );

    return NextResponse.json(
      {
        success: true,
        data: item,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/search-history] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save search history" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      await deleteSearchHistory(id, userId);
    } else {
      await clearSearchHistory(userId);
    }

    return NextResponse.json({
      success: true,
      message: "Search history deleted",
    });
  } catch (error) {
    console.error("[DELETE /api/search-history] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete search history" },
      { status: 500 }
    );
  }
}
