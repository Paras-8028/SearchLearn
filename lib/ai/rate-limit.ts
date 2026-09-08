import { countUserAiRequests } from "@/lib/db/repositories/ai-request-logs";

const MAX_REQUESTS = Number(process.env.AI_RATE_LIMIT_MAX_REQUESTS) || 20;
const WINDOW_MS = Number(process.env.AI_RATE_LIMIT_WINDOW_MS) || 60000; // 1 minute

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetMs: number;
}

export async function checkRateLimit(userId: string): Promise<RateLimitResult> {
  if (!userId) {
    return { allowed: false, remaining: 0, resetMs: WINDOW_MS };
  }

  const now = Date.now();
  const windowStart = new Date(now - WINDOW_MS);

  const requestCount = await countUserAiRequests(userId, windowStart);

  if (requestCount >= MAX_REQUESTS) {
    return {
      allowed: false,
      remaining: 0,
      resetMs: WINDOW_MS,
    };
  }

  return {
    allowed: true,
    remaining: Math.max(0, MAX_REQUESTS - (requestCount + 1)),
    resetMs: WINDOW_MS,
  };
}
