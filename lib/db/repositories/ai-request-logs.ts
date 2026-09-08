import clientPromise from "@/lib/db/mongodb";
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
  } catch (err) {
    // Non-blocking logging error
    console.error("[logAiRequest] Error writing log entry:", err);
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
