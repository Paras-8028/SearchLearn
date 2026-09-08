/**
 * SmartLearn AI Pricing Configuration & Cost Estimator
 *
 * Current standard OpenAI pricing (per 1,000,000 tokens):
 * - gpt-4o-mini: $0.150 / 1M input, $0.600 / 1M output
 * - gpt-4o: $2.500 / 1M input, $10.000 / 1M output
 * - text-embedding-3-small: $0.020 / 1M input
 * - text-embedding-3-large: $0.130 / 1M input
 */

export interface ModelPricing {
  inputPerMillion: number;
  outputPerMillion: number;
}

export const AI_MODEL_PRICING: Record<string, ModelPricing> = {
  "gpt-4o-mini": {
    inputPerMillion: 0.15,
    outputPerMillion: 0.6,
  },
  "gpt-4o": {
    inputPerMillion: 2.5,
    outputPerMillion: 10.0,
  },
  "gpt-3.5-turbo": {
    inputPerMillion: 0.5,
    outputPerMillion: 1.5,
  },
  "text-embedding-3-small": {
    inputPerMillion: 0.02,
    outputPerMillion: 0.0,
  },
  "text-embedding-3-large": {
    inputPerMillion: 0.13,
    outputPerMillion: 0.0,
  },
};

export const DEFAULT_PRICING: ModelPricing = AI_MODEL_PRICING["gpt-4o-mini"];

export interface CostCalculationParams {
  model?: string;
  inputTokens?: number;
  outputTokens?: number;
  totalTokens?: number;
}

/**
 * Calculates estimated API cost in USD based on model and token counts.
 * Clearly labeled as estimated because upstream pricing and discounts may vary.
 */
export function calculateEstimatedCost({
  model = "gpt-4o-mini",
  inputTokens = 0,
  outputTokens = 0,
  totalTokens,
}: CostCalculationParams): number {
  const pricing = AI_MODEL_PRICING[model] || DEFAULT_PRICING;

  // If only totalTokens provided, estimate 70% input, 30% output
  let inTokens = inputTokens;
  let outTokens = outputTokens;

  if (totalTokens !== undefined && inTokens === 0 && outTokens === 0) {
    inTokens = Math.round(totalTokens * 0.7);
    outTokens = Math.round(totalTokens * 0.3);
  }

  const inputCost = (inTokens / 1_000_000) * pricing.inputPerMillion;
  const outputCost = (outTokens / 1_000_000) * pricing.outputPerMillion;

  const total = inputCost + outputCost;
  return Number(total.toFixed(4));
}
