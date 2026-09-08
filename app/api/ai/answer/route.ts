import { auth } from "@clerk/nextjs/server";
import { generateGroundedAnswer } from "@/lib/ai/answer";
import { AskAiSchema } from "@/lib/validations/search";
import { sanitizeAiError } from "@/lib/ai/errors";
import {
  successResponse,
  validationErrorResponse,
  rateLimitedResponse,
  errorResponse,
} from "@/lib/api/response";
import {
  checkRateLimit,
  RATE_LIMIT_PRESETS,
  getClientIdentifier,
} from "@/lib/security/rate-limit";

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    const clientId = getClientIdentifier(request, userId);
    const rateCheck = checkRateLimit(clientId, RATE_LIMIT_PRESETS.AI);
    if (!rateCheck.allowed) {
      return rateLimitedResponse(
        "AI rate limit exceeded. Please wait a moment before asking another question.",
        rateCheck.retryAfterSeconds
      );
    }

    const body = await request.json();
    const validation = AskAiSchema.safeParse(body);

    if (!validation.success) {
      return validationErrorResponse(
        validation.error.issues[0]?.message || "Invalid question input",
        validation.error.flatten().fieldErrors
      );
    }

    const { question, courseId } = validation.data;
    const answerResult = await generateGroundedAnswer(question, courseId);

    return successResponse(answerResult);
  } catch (error: unknown) {
    console.error("[POST /api/ai/answer] Error:", error);
    const safeError = sanitizeAiError(error, "answer");
    return errorResponse(safeError.message, safeError.code, safeError.status);
  }
}
