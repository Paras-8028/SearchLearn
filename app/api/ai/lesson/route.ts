import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getOpenAIClient, isOpenAIConfigured } from "@/lib/ai/openai";
import { getLessonById } from "@/lib/db/repositories/lessons";
import { getCourseById } from "@/lib/db/repositories/courses";
import { logAiRequest } from "@/lib/db/repositories/ai-request-logs";
import { checkRateLimit } from "@/lib/ai/rate-limit";
import { sanitizeAiError } from "@/lib/ai/errors";
import { LessonAiActionSchema } from "@/lib/validations/lesson-ai";
import {
  buildLessonPrompt,
  type LessonAiAction,
  type QuizQuestion,
} from "@/lib/ai/prompts/lesson-actions";
import type { AIFeature } from "@/types/ai-log";

export async function POST(request: Request) {
  const startTime = Date.now();
  let userId: string = "anonymous";

  try {
    try {
      const authData = await auth();
      if (authData.userId) userId = authData.userId;
    } catch {
      // Unauthenticated fallback
    }

    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "anonymous";
    const rateLimitKey = userId !== "anonymous" ? `user:${userId}` : `ip:${ip}`;

    const rateLimit = await checkRateLimit(rateLimitKey, 25, 60000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many AI requests. Please wait a moment before trying again.",
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const validation = LessonAiActionSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: validation.error.issues[0]?.message || "Invalid request payload",
        },
        { status: 400 }
      );
    }

    const { lessonId, action, userQuery } = validation.data;

    // Fetch lesson
    const lesson = await getLessonById(lessonId);
    if (!lesson) {
      return NextResponse.json(
        { success: false, error: "Lesson not found" },
        { status: 404 }
      );
    }

    // Fetch parent course for enriched context
    const course = await getCourseById(lesson.courseId);

    if (!isOpenAIConfigured()) {
      return NextResponse.json(
        {
          success: false,
          error: "AI service is currently not configured. Please add OPENAI_API_KEY.",
        },
        { status: 503 }
      );
    }

    const { systemPrompt, userPrompt } = buildLessonPrompt(
      action as LessonAiAction,
      lesson.title,
      lesson.content || lesson.description || "",
      course?.title,
      undefined,
      userQuery
    );

    const model = process.env.OPENAI_CHAT_MODEL || "gpt-4o-mini";
    const openai = getOpenAIClient();

    const completion = await openai.chat.completions.create({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: action === "quiz" ? 0.3 : 0.4,
      max_tokens: 1200,
    });

    const rawResponse = completion.choices[0]?.message?.content || "";
    const inputTokens = completion.usage?.prompt_tokens || 0;
    const outputTokens = completion.usage?.completion_tokens || 0;
    const totalTokens = completion.usage?.total_tokens || 0;

    let featureName: AIFeature = "lesson_explain";
    if (action === "summarize") featureName = "lesson_summary";
    else if (action === "key_points") featureName = "lesson_key_points";
    else if (action === "quiz") featureName = "lesson_quiz";
    else if (action === "simplify") featureName = "lesson_simplify";

    await logAiRequest({
      userId,
      feature: featureName,
      model,
      inputTokens,
      outputTokens,
      totalTokens,
      success: true,
      durationMs: Date.now() - startTime,
    });

    if (action === "quiz") {
      let parsedQuestions: QuizQuestion[] = [];
      try {
        // Strip any markdown fences if present
        let cleaned = rawResponse.trim();
        if (cleaned.startsWith("```json")) {
          cleaned = cleaned.replace(/^```json/, "").replace(/```$/, "").trim();
        } else if (cleaned.startsWith("```")) {
          cleaned = cleaned.replace(/^```/, "").replace(/```$/, "").trim();
        }

        const parsed = JSON.parse(cleaned);
        if (Array.isArray(parsed.questions)) {
          parsedQuestions = parsed.questions;
        } else if (Array.isArray(parsed)) {
          parsedQuestions = parsed;
        }
      } catch (parseErr) {
        console.error("[POST /api/ai/lesson] Failed to parse quiz JSON:", parseErr, rawResponse);
        return NextResponse.json(
          {
            success: false,
            error: "Failed to generate structured quiz questions. Please try again.",
          },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        data: {
          action,
          quiz: parsedQuestions,
          tokensUsed: totalTokens,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        action,
        content: rawResponse,
        tokensUsed: totalTokens,
      },
    });
  } catch (error: unknown) {
    console.error("[POST /api/ai/lesson] Error:", error);
    const safeError = sanitizeAiError(error, "lesson_ai");

    await logAiRequest({
      userId,
      feature: "lesson_explain",
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      durationMs: Date.now() - startTime,
    });

    return NextResponse.json(
      {
        success: false,
        error: safeError.message,
      },
      { status: safeError.status }
    );
  }
}
