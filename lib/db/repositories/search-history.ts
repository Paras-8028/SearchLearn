import { ObjectId } from "mongodb";
import clientPromise from "@/lib/db/mongodb";
import type { SearchHistoryItem, SearchHistoryDTO } from "@/types/search-history";
import type { SearchContentType } from "@/types/search";

const DATABASE_NAME = "searchlearn";
const SEARCH_HISTORY_COLLECTION = "searchHistory";

async function getSearchHistoryCollection() {
  const client = await clientPromise;
  return client.db(DATABASE_NAME).collection<SearchHistoryItem>(SEARCH_HISTORY_COLLECTION);
}

export function serializeSearchHistory(item: SearchHistoryItem): SearchHistoryDTO {
  return {
    ...item,
    _id: item._id ? item._id.toString() : "",
    createdAt: item.createdAt ? item.createdAt.toISOString() : new Date().toISOString(),
  };
}

export async function createSearchHistory(
  userId: string,
  query: string,
  filters?: {
    contentTypes?: SearchContentType[];
    courseId?: string;
  }
): Promise<SearchHistoryDTO | null> {
  const trimmed = query.trim();
  if (!trimmed || !userId) return null;

  const collection = await getSearchHistoryCollection();

  // Avoid creating consecutive identical searches for the same user
  const latest = await collection.findOne({ userId }, { sort: { createdAt: -1 } });
  if (latest && latest.query.toLowerCase() === trimmed.toLowerCase()) {
    // Update timestamp
    await collection.updateOne(
      { _id: latest._id },
      { $set: { createdAt: new Date(), filters } }
    );
    return serializeSearchHistory({
      ...latest,
      createdAt: new Date(),
      filters,
    });
  }

  const newItem: SearchHistoryItem = {
    userId,
    query: trimmed,
    filters,
    createdAt: new Date(),
  };

  const result = await collection.insertOne(newItem);

  // Maintain max 20 history records per user
  const userItems = await collection
    .find({ userId })
    .sort({ createdAt: -1 })
    .skip(20)
    .toArray();

  if (userItems.length > 0) {
    const idsToDelete = userItems.map((i) => i._id).filter((id): id is ObjectId => !!id);
    await collection.deleteMany({ _id: { $in: idsToDelete } });
  }

  return serializeSearchHistory({
    ...newItem,
    _id: result.insertedId,
  });
}

export async function getRecentSearches(
  userId: string,
  limit: number = 20
): Promise<SearchHistoryDTO[]> {
  if (!userId) return [];

  const collection = await getSearchHistoryCollection();
  const history = await collection
    .find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();

  return history.map(serializeSearchHistory);
}

export async function deleteSearchHistory(id: string, userId: string): Promise<boolean> {
  if (!ObjectId.isValid(id) || !userId) return false;

  const collection = await getSearchHistoryCollection();
  const result = await collection.deleteOne({
    _id: new ObjectId(id),
    userId,
  });

  return result.deletedCount === 1;
}

export async function clearSearchHistory(userId: string): Promise<boolean> {
  if (!userId) return false;

  const collection = await getSearchHistoryCollection();
  const result = await collection.deleteMany({ userId });

  return result.acknowledged;
}
