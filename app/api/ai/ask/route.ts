import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { generateGroundedAnswer } from "@/lib/ai/answer";
import { AskAiSchema } from "@/lib/validations/search";
import { checkRateLimit } from "@/lib/ai/rate-limit";
import { sanitizeAiError } from "@/lib/ai/errors";

export async function POST(request: Request) {
  try {
    let userId: string | undefined;
    try {
      const authData = await auth();
      userId = authData.userId || undefined;
    } catch {
      // Unauthenticated requests will fall back to IP identifier
    }

    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "anonymous";
    const rateLimitKey = userId ? `user:${userId}` : `ip:${ip}`;

    // Rate limit: 20 requests per minute
    const rateLimit = await checkRateLimit(rateLimitKey, 20, 60000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Rate limit exceeded. Please wait a moment before asking another question.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": Math.ceil((rateLimit.resetAt - Date.now()) / 1000).toString(),
          },
        }
      );
    }

    const body = await request.json();
    const validation = AskAiSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: validation.error.issues[0]?.message || "Invalid question input",
        },
        { status: 400 }
      );
    }

    const { question, courseId } = validation.data;
    const answerResult = await generateGroundedAnswer(question, courseId, userId);

    return NextResponse.json({
      success: true,
      data: answerResult,
    });
  } catch (error: unknown) {
    console.error("[POST /api/ai/ask] Error:", error);
    const sanitized = sanitizeAiError(error);
    return NextResponse.json(
      {
        success: false,
        error: sanitized,
      },
      { status: 500 }
    );
  }
}
