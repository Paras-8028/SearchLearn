import { ObjectId, Filter } from "mongodb";

import clientPromise from "@/lib/db/mongodb";
import type { SearchLearnUser, SearchLearnUserDTO, UserRole } from "@/types/user";

const DATABASE_NAME = "searchlearn";
const USERS_COLLECTION = "users";

async function getUsersCollection() {
  const client = await clientPromise;

  return client
    .db(DATABASE_NAME)
    .collection<SearchLearnUser>(USERS_COLLECTION);
}

export function serializeUser(user: SearchLearnUser): SearchLearnUserDTO {
  return {
    _id: user._id ? user._id.toString() : "",
    clerkId: user.clerkId,
    firstName: user.firstName ?? null,
    lastName: user.lastName ?? null,
    email: user.email ?? null,
    role: user.role,
    createdAt: user.createdAt ? user.createdAt.toISOString() : undefined,
    updatedAt: user.updatedAt ? user.updatedAt.toISOString() : undefined,
  };
}

export async function findUserByClerkId(clerkId: string) {
  const collection = await getUsersCollection();

  return collection.findOne({ clerkId });
}

export async function findUserById(id: string) {
  const collection = await getUsersCollection();

  if (ObjectId.isValid(id)) {
    const user = await collection.findOne({ _id: new ObjectId(id) });
    if (user) return user;
  }

  return collection.findOne({ clerkId: id });
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

export async function countAdmins(): Promise<number> {
  const collection = await getUsersCollection();
  return collection.countDocuments({ role: "admin" });
}

export async function getUserCountByRole(): Promise<{
  student: number;
  instructor: number;
  admin: number;
  total: number;
}> {
  const collection = await getUsersCollection();

  const [student, instructor, admin, total] = await Promise.all([
    collection.countDocuments({ role: "student" }),
    collection.countDocuments({ role: "instructor" }),
    collection.countDocuments({ role: "admin" }),
    collection.countDocuments({}),
  ]);

  return {
    student,
    instructor,
    admin,
    total,
  };
}

export async function getAllUsers(options?: {
  search?: string;
  role?: UserRole | "all";
  page?: number;
  limit?: number;
}): Promise<{
  users: SearchLearnUserDTO[];
  total: number;
  page: number;
  totalPages: number;
}> {
  const collection = await getUsersCollection();
  const filter: Filter<SearchLearnUser> = {};

  if (options?.role && options.role !== "all") {
    filter.role = options.role;
  }

  if (options?.search && options.search.trim()) {
    const searchRegex = new RegExp(options.search.trim(), "i");
    filter.$or = [
      { email: { $regex: searchRegex } },
      { firstName: { $regex: searchRegex } },
      { lastName: { $regex: searchRegex } },
    ];
  }

  const page = Math.max(1, options?.page || 1);
  const limit = Math.max(1, Math.min(100, options?.limit || 20));
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    collection
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray(),
    collection.countDocuments(filter),
  ]);

  return {
    users: users.map(serializeUser),
    total,
    page,
    totalPages: Math.ceil(total / limit) || 1,
  };
}

export function isValidObjectId(id: string) {
  return ObjectId.isValid(id);
}