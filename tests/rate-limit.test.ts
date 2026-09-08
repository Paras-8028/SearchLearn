import { describe, it, expect } from "vitest";
import { checkRateLimit } from "@/lib/security/rate-limit";

describe("Rate Limiter Security Engine", () => {
  it("allows requests within configured threshold", () => {
    const key = "test-user-1";
    const result1 = checkRateLimit(key, { limit: 3, windowMs: 10000 });
    expect(result1.allowed).toBe(true);
    expect(result1.remaining).toBe(2);

    const result2 = checkRateLimit(key, { limit: 3, windowMs: 10000 });
    expect(result2.allowed).toBe(true);
    expect(result2.remaining).toBe(1);

    const result3 = checkRateLimit(key, { limit: 3, windowMs: 10000 });
    expect(result3.allowed).toBe(true);
    expect(result3.remaining).toBe(0);
  });

  it("blocks requests that exceed the limit", () => {
    const key = "test-user-blocked";
    // Fire limit requests
    for (let i = 0; i < 5; i++) {
      checkRateLimit(key, { limit: 5, windowMs: 10000 });
    }

    // 6th request must be denied
    const blocked = checkRateLimit(key, { limit: 5, windowMs: 10000 });
    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
  });

  it("isolates counters across different identifiers", () => {
    const keyA = "user-alice";
    const keyB = "user-bob";

    const resA = checkRateLimit(keyA, { limit: 2, windowMs: 10000 });
    expect(resA.allowed).toBe(true);
    expect(resA.remaining).toBe(1);

    const resB = checkRateLimit(keyB, { limit: 2, windowMs: 10000 });
    expect(resB.allowed).toBe(true);
    expect(resB.remaining).toBe(1);
  });
});
