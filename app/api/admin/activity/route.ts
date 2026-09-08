import { NextResponse } from "next/server";
import { z } from "zod";
import { assertAdmin } from "@/lib/auth/require-admin";
import { getPlatformActivities } from "@/lib/db/repositories/activity";
import { handleApiError } from "@/lib/logger/error-handler";

const querySchema = z.object({
  category: z.string().optional(),
  eventType: z.string().optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    await assertAdmin();

    const { searchParams } = new URL(request.url);
    const parsed = querySchema.safeParse({
      category: searchParams.get("category") || undefined,
      eventType: searchParams.get("eventType") || undefined,
      search: searchParams.get("search") || undefined,
      page: searchParams.get("page") || 1,
      limit: searchParams.get("limit") || 20,
    });

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid query parameters" },
        { status: 400 }
      );
    }

    const result = await getPlatformActivities(parsed.data);

    return NextResponse.json({
      success: true,
      data: result.activities,
      pagination: result.pagination,
    });
  } catch (error) {
    return handleApiError(error, request, "api");
  }
}
