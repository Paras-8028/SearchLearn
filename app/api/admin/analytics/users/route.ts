import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/require-user";
import { getUserAnalytics } from "@/lib/db/repositories/analytics";
import { AppError, handleApiError } from "@/lib/logger/error-handler";
import type { AnalyticsPeriod } from "@/types/analytics";

export const dynamic = "force-dynamic";

const querySchema = z.object({
  range: z.enum(["7d", "30d", "90d", "all"]).default("30d"),
});

export async function GET(request: Request) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      throw new AppError(
        "Forbidden: Administrator role required",
        403,
        "UNAUTHORIZED_ADMIN",
        "authorization"
      );
    }

    const { searchParams } = new URL(request.url);
    const parsed = querySchema.safeParse({
      range: searchParams.get("range") || "30d",
    });

    if (!parsed.success) {
      throw parsed.error;
    }

    const data = await getUserAnalytics(parsed.data.range as AnalyticsPeriod);

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    return handleApiError(error, request, "api");
  }
}
