import { countUserAiRequests } from "@/lib/db/repositories/ai-request-logs";

const MAX_REQUESTS = Number(process.env.AI_RATE_LIMIT_MAX_REQUESTS) || 20;
const WINDOW_MS = Number(process.env.AI_RATE_LIMIT_WINDOW_MS) || 60000; // 1 minute

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetMs: number;
}

export async function checkRateLimit(
  userId: string,
  maxRequests: number = MAX_REQUESTS,
  windowMs: number = WINDOW_MS
): Promise<RateLimitResult> {
  if (!userId) {
    return { allowed: false, remaining: 0, resetMs: windowMs };
  }

  const now = Date.now();
  const windowStart = new Date(now - windowMs);

  const requestCount = await countUserAiRequests(userId, windowStart);

  if (requestCount >= maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetMs: windowMs,
    };
  }

  return {
    allowed: true,
    remaining: Math.max(0, maxRequests - (requestCount + 1)),
    resetMs: windowMs,
  };
}

