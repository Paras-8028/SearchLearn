import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { recordSearchClick } from "@/lib/db/repositories/analytics";
import { logActivity } from "@/lib/analytics/log-activity";
import { handleApiError } from "@/lib/logger/error-handler";

const clickSchema = z.object({
  searchQuery: z.string().min(1),
  searchId: z.string().optional(),
  resultType: z.string().min(1),
  resultId: z.string().min(1),
  courseId: z.string().optional(),
  lessonId: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    const body = await request.json();
    const parsed = clickSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Invalid payload" }, { status: 400 });
    }

    const { searchQuery, searchId, resultType, resultId, courseId, lessonId } = parsed.data;

    // Record click telemetry
    await recordSearchClick({
      searchQuery,
      searchId,
      resultType,
      resultId,
      courseId,
      lessonId,
      userId: userId || undefined,
      clickedAt: new Date(),
    });

    // Record activity log
    await logActivity({
      userId: userId || undefined,
      eventType: "SEARCH_RESULT_CLICKED",
      category: "SEARCH",
      entityType: resultType,
      entityId: resultId,
      metadata: {
        query: searchQuery,
        resultType,
        resultId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error, request, "search");
  }
}
