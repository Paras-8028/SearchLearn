import { type Filter } from "mongodb";
import clientPromise from "@/lib/db/mongodb";
import type { PlatformActivity, PlatformActivityDTO, ActivityCategory, PlatformActivityType } from "@/types/activity";
import { calculatePagination, type PaginationMeta } from "@/lib/validations/pagination";
import { logger } from "@/lib/logger/logger";

const DATABASE_NAME = "searchlearn";
const ACTIVITIES_COLLECTION = "platformActivities";

async function getActivitiesCollection() {
  const client = await clientPromise;
  return client.db(DATABASE_NAME).collection<PlatformActivity>(ACTIVITIES_COLLECTION);
}

export function serializeActivity(activity: PlatformActivity): PlatformActivityDTO {
  return {
    ...activity,
    _id: activity._id ? activity._id.toString() : "",
    type: activity.type || activity.eventType || "UNKNOWN",
    eventType: activity.eventType || activity.type || "UNKNOWN",
    category: activity.category || "USER",
    createdAt: activity.createdAt ? new Date(activity.createdAt).toISOString() : new Date().toISOString(),
  };
}

export async function createActivity(
  data: Omit<PlatformActivity, "_id" | "createdAt">
): Promise<void> {
  try {
    const collection = await getActivitiesCollection();
    const entry: PlatformActivity = {
      ...data,
      type: data.type || data.eventType || "UNKNOWN",
      eventType: data.eventType || data.type || "UNKNOWN",
      category: data.category || "USER",
      createdAt: new Date(),
    };
    await collection.insertOne(entry);
  } catch (err) {
    logger.warn("database", "Failed to write activity record", {
      type: data.type || data.eventType,
      userId: data.userId,
    }, err instanceof Error ? err : undefined);
  }
}

// Backward-compatible alias
export const logPlatformActivity = createActivity;

export async function getRecentActivities(
  limit: number = 20
): Promise<PlatformActivityDTO[]> {
  try {
    const collection = await getActivitiesCollection();
    const activities = await collection
      .find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();

    return activities.map(serializeActivity);
  } catch (err) {
    logger.error("database", "Error reading recent platform activities", err);
    return [];
  }
}

// Backward-compatible alias
export const getRecentPlatformActivities = getRecentActivities;

export async function getUserActivities(
  userId: string,
  limit: number = 20
): Promise<PlatformActivityDTO[]> {
  try {
    const collection = await getActivitiesCollection();
    const activities = await collection
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();

    return activities.map(serializeActivity);
  } catch (err) {
    logger.error("database", "Error reading user activities", err);
    return [];
  }
}

// Backward-compatible alias
export const getActivitiesByUserId = getUserActivities;

export interface GetActivitiesFilter {
  category?: ActivityCategory | string;
  eventType?: PlatformActivityType | string;
  userId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export async function getPlatformActivities(
  filters: GetActivitiesFilter = {}
): Promise<{ activities: PlatformActivityDTO[]; pagination: PaginationMeta }> {
  try {
    const collection = await getActivitiesCollection();
    const query: Filter<PlatformActivity> = {};

    if (filters.category && filters.category !== "ALL") {
      query.category = filters.category;
    }

    if (filters.eventType && filters.eventType !== "ALL") {
      query.$or = [{ type: filters.eventType }, { eventType: filters.eventType }];
    }

    if (filters.userId) {
      query.userId = filters.userId;
    }

    if (filters.search && filters.search.trim().length > 0) {
      const regex = new RegExp(filters.search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      query.$or = [
        { message: { $regex: regex } },
        { userName: { $regex: regex } },
        { userEmail: { $regex: regex } },
      ];
    }

    const total = await collection.countDocuments(query);
    const pagination = calculatePagination({
      page: filters.page,
      limit: filters.limit || 20,
      total,
    });

    const activities = await collection
      .find(query)
      .sort({ createdAt: -1 })
      .skip(pagination.skip)
      .limit(pagination.limit)
      .toArray();

    return {
      activities: activities.map(serializeActivity),
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total: pagination.total,
        totalPages: pagination.totalPages,
      },
    };
  } catch (err) {
    logger.error("database", "Failed to query paginated platform activities", err);
    return {
      activities: [],
      pagination: {
        page: 1,
        limit: filters.limit || 20,
        total: 0,
        totalPages: 1,
      },
    };
  }
}
