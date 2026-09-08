export interface RateLimitOptions {
  limit: number;
  windowMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetMs: number;
  retryAfterSeconds: number;
}

interface Bucket {
  count: number;
  resetTime: number;
}

// In-memory sliding/fixed token bucket store
const store = new Map<string, Bucket>();

// Periodic bucket cleanup to prevent memory leaks
const CLEANUP_INTERVAL_MS = 60000;
let lastCleanup = Date.now();

function cleanupExpiredBuckets() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;

  lastCleanup = now;
  for (const [key, bucket] of store.entries()) {
    if (bucket.resetTime <= now) {
      store.delete(key);
    }
  }
}

/**
 * Checks and increments rate limit counter for a given identifier.
 * Can be easily swapped with Redis/Upstash by replacing the backing store logic.
 */
export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions
): RateLimitResult {
  cleanupExpiredBuckets();

  const now = Date.now();
  const bucket = store.get(identifier);

  if (!bucket || bucket.resetTime <= now) {
    // New or expired window
    store.set(identifier, {
      count: 1,
      resetTime: now + options.windowMs,
    });

    return {
      allowed: true,
      limit: options.limit,
      remaining: Math.max(0, options.limit - 1),
      resetMs: options.windowMs,
      retryAfterSeconds: 0,
    };
  }

  // Window still active
  if (bucket.count >= options.limit) {
    const resetMs = Math.max(0, bucket.resetTime - now);
    return {
      allowed: false,
      limit: options.limit,
      remaining: 0,
      resetMs,
      retryAfterSeconds: Math.ceil(resetMs / 1000),
    };
  }

  bucket.count += 1;
  const resetMs = Math.max(0, bucket.resetTime - now);

  return {
    allowed: true,
    limit: options.limit,
    remaining: Math.max(0, options.limit - bucket.count),
    resetMs,
    retryAfterSeconds: 0,
  };
}

/**
 * Common rate limit presets for SmartLearn
 */
export const RATE_LIMIT_PRESETS = {
  // AI generation & question answering: 10 requests / min / user
  AI: {
    limit: 10,
    windowMs: 60 * 1000,
  },
  // Document upload: 5 uploads / min / user
  DOCUMENT_UPLOAD: {
    limit: 5,
    windowMs: 60 * 1000,
  },
  // Search query: 30 requests / min / user or IP
  SEARCH: {
    limit: 30,
    windowMs: 60 * 1000,
  },
  // General standard API: 60 requests / min
  STANDARD: {
    limit: 60,
    windowMs: 60 * 1000,
  },
} as const;

/**
 * Helper to get identifier from Request (User ID or IP)
 */
export function getClientIdentifier(
  req: Request,
  userId?: string | null
): string {
  if (userId) return `user:${userId}`;

  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "anonymous";
  return `ip:${ip}`;
}
