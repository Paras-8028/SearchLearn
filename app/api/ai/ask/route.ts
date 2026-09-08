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
  checkRateLimit as checkMemoryRateLimit,
  RATE_LIMIT_PRESETS,
  getClientIdentifier,
} from "@/lib/security/rate-limit";

export async function POST(request: Request) {
  try {
    let userId: string | undefined;
    try {
      const authData = await auth();
      userId = authData.userId || undefined;
    } catch {
      // Unauthenticated requests will fall back to IP identifier
    }

    const clientId = getClientIdentifier(request, userId);
    const rateCheck = checkMemoryRateLimit(clientId, RATE_LIMIT_PRESETS.AI);
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
    const answerResult = await generateGroundedAnswer(question, courseId, userId);

    return successResponse(answerResult);
  } catch (error: unknown) {
    console.error("[POST /api/ai/ask] Error:", error);
    const safeError = sanitizeAiError(error, "ask");
    return errorResponse(safeError.message, safeError.code, safeError.status);
  }
}
