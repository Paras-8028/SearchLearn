import clientPromise from "@/lib/db/mongodb";
import { logger } from "@/lib/logger/logger";
import { logActivity } from "@/lib/analytics/log-activity";
import type { AIRequestLog, AIRequestLogDTO, AIFeature } from "@/types/ai-log";

const DATABASE_NAME = "searchlearn";
const LOGS_COLLECTION = "aiRequestLogs";

async function getLogsCollection() {
  const client = await clientPromise;
  return client.db(DATABASE_NAME).collection<AIRequestLog>(LOGS_COLLECTION);
}

export function serializeLog(log: AIRequestLog): AIRequestLogDTO {
  return {
    ...log,
    _id: log._id ? log._id.toString() : "",
    createdAt: log.createdAt ? log.createdAt.toISOString() : new Date().toISOString(),
  };
}

export async function logAiRequest(data: {
  userId: string;
  feature: AIFeature;
  model?: string;
  inputTokens?: number;
  outputTokens?: number;
  totalTokens?: number;
  success: boolean;
  error?: string;
  durationMs?: number;
}): Promise<void> {
  try {
    const collection = await getLogsCollection();
    const entry: AIRequestLog = {
      ...data,
      createdAt: new Date(),
    };
    await collection.insertOne(entry);

    logActivity({
      userId: data.userId,
      eventType: data.success ? "AI_REQUEST_COMPLETED" : "AI_REQUEST_FAILED",
      category: "AI",
      metadata: {
        feature: data.feature,
        model: data.model,
        totalTokens: data.totalTokens,
      },
    }).catch(() => {});
  } catch (err) {
    // Non-blocking logging error
    logger.error("ai", "Failed to write AI telemetry log entry", err, {
      userId: data.userId,
      feature: data.feature,
    });
  }
}

/**
 * Counts user requests within a timeframe for sliding-window rate limiting
 */
export async function countUserAiRequests(
  userId: string,
  since: Date
): Promise<number> {
  try {
    const collection = await getLogsCollection();
    return await collection.countDocuments({
      userId,
      createdAt: { $gte: since },
    });
  } catch (err) {
    console.error("[countUserAiRequests] Error querying request count:", err);
    return 0;
  }
}

export async function getAiUsageAnalytics(): Promise<
  Array<{
    feature: string;
    totalRequests: number;
    successfulRequests: number;
    totalTokens: number;
    avgDurationMs: number;
  }>
> {
  try {
    const collection = await getLogsCollection();
    const result = await collection
      .aggregate<{
        _id: string;
        totalRequests: number;
        successfulRequests: number;
        totalTokens: number;
        avgDurationMs: number;
      }>([
        {
          $group: {
            _id: "$feature",
            totalRequests: { $sum: 1 },
            successfulRequests: {
              $sum: { $cond: [{ $eq: ["$success", true] }, 1, 0] },
            },
            totalTokens: { $sum: { $ifNull: ["$totalTokens", 0] } },
            avgDurationMs: { $avg: { $ifNull: ["$durationMs", 0] } },
          },
        },
        { $sort: { totalRequests: -1 } },
      ])
      .toArray();

    return result.map((r) => ({
      feature: r._id || "unknown",
      totalRequests: r.totalRequests,
      successfulRequests: r.successfulRequests,
      totalTokens: r.totalTokens,
      avgDurationMs: Math.round(r.avgDurationMs),
    }));
  } catch (err) {
    console.error("[getAiUsageAnalytics] Error calculating analytics:", err);
    return [];
  }
}

