import { ObjectId } from "mongodb";

import clientPromise from "@/lib/db/mongodb";
import type { SearchLearnUser, UserRole } from "@/types/user";

const DATABASE_NAME = "searchlearn";
const USERS_COLLECTION = "users";

async function getUsersCollection() {
  const client = await clientPromise;

  return client
    .db(DATABASE_NAME)
    .collection<SearchLearnUser>(USERS_COLLECTION);
}

export async function findUserByClerkId(clerkId: string) {
  const collection = await getUsersCollection();

  return collection.findOne({ clerkId });
}

export async function createUser(
  user: Omit<SearchLearnUser, "_id">,
) {
  const collection = await getUsersCollection();

  const result = await collection.insertOne(user);

  return {
    ...user,
    _id: result.insertedId,
  };
}

export async function updateUserRole(
  clerkId: string,
  role: UserRole,
) {
  const collection = await getUsersCollection();

  return collection.updateOne(
    { clerkId },
    {
      $set: {
        role,
        updatedAt: new Date(),
      },
    },
  );
}

export async function ensureUser(
  user: Omit<SearchLearnUser, "_id">,
) {
  const collection = await getUsersCollection();

  const existingUser = await collection.findOne({
    clerkId: user.clerkId,
  });

  if (existingUser) {
    return existingUser;
  }

  const result = await collection.insertOne(user);

  return {
    ...user,
    _id: result.insertedId,
  };
}

export function isValidObjectId(id: string) {
  return ObjectId.isValid(id);
}