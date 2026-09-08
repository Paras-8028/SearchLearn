import { describe, it, expect } from "vitest";
import { calculateEstimatedCost } from "@/lib/ai/cost";

describe("AI Cost & Token Telemetry Calculation", () => {
  it("computes cost correctly for gpt-4o-mini", () => {
    // 1,000,000 input tokens = $0.15, 1,000,000 output tokens = $0.60
    const cost = calculateEstimatedCost({
      model: "gpt-4o-mini",
      inputTokens: 1_000_000,
      outputTokens: 1_000_000,
    });
    expect(cost).toBeCloseTo(0.75, 4);
  });

  it("computes cost correctly for text-embedding-3-small", () => {
    // 1,000,000 input tokens = $0.02
    const cost = calculateEstimatedCost({
      model: "text-embedding-3-small",
      inputTokens: 1_000_000,
      outputTokens: 0,
    });
    expect(cost).toBeCloseTo(0.02, 4);
  });

  it("handles zero token counts cleanly", () => {
    const cost = calculateEstimatedCost({
      model: "gpt-4o-mini",
      inputTokens: 0,
      outputTokens: 0,
    });
    expect(cost).toBe(0);
  });
});
