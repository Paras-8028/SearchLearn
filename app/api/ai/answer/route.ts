import { NextResponse } from "next/server";
import { generateGroundedAnswer } from "@/lib/ai/answer";
import { AskAiSchema } from "@/lib/validations/search";

export async function POST(request: Request) {
  try {
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
    const answerResult = await generateGroundedAnswer(question, courseId);

    return NextResponse.json({
      success: true,
      data: answerResult,
    });
  } catch (error: any) {
    console.error("[POST /api/ai/answer] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to generate AI answer",
      },
      { status: 500 }
    );
  }
}
