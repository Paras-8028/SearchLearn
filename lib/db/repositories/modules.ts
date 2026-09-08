import { ObjectId } from "mongodb";
import clientPromise from "@/lib/db/mongodb";
import type { CourseModule, CourseModuleDTO, CourseModuleInput } from "@/types/module";

const DATABASE_NAME = "searchlearn";
const MODULES_COLLECTION = "modules";

async function getModulesCollection() {
  const client = await clientPromise;
  return client.db(DATABASE_NAME).collection<CourseModule>(MODULES_COLLECTION);
}

export function serializeModule(mod: CourseModule): CourseModuleDTO {
  return {
    ...mod,
    _id: mod._id ? mod._id.toString() : "",
    courseId: mod.courseId.toString(),
    createdAt: mod.createdAt ? mod.createdAt.toISOString() : new Date().toISOString(),
    updatedAt: mod.updatedAt ? mod.updatedAt.toISOString() : new Date().toISOString(),
  };
}

export async function createModule(
  data: CourseModuleInput
): Promise<CourseModuleDTO> {
  const collection = await getModulesCollection();
  const now = new Date();

  const cId = typeof data.courseId === "string" ? new ObjectId(data.courseId) : data.courseId;

  const newModule: CourseModule = {
    ...data,
    courseId: cId,
    createdAt: now,
    updatedAt: now,
  };

  const result = await collection.insertOne(newModule);
  return serializeModule({
    ...newModule,
    _id: result.insertedId,
  });
}

export async function getModulesByCourseId(courseId: string): Promise<CourseModuleDTO[]> {
  if (!ObjectId.isValid(courseId)) return [];

  const collection = await getModulesCollection();
  const modules = await collection
    .find({ courseId: new ObjectId(courseId) })
    .sort({ order: 1 })
    .toArray();

  return modules.map(serializeModule);
}

export async function getModuleById(id: string): Promise<CourseModuleDTO | null> {
  if (!ObjectId.isValid(id)) return null;

  const collection = await getModulesCollection();
  const mod = await collection.findOne({ _id: new ObjectId(id) });
  if (!mod) return null;

  return serializeModule(mod);
}

export async function updateModule(
  id: string,
  updates: Partial<Omit<CourseModule, "_id" | "createdAt">>
): Promise<CourseModuleDTO | null> {
  if (!ObjectId.isValid(id)) return null;

  const collection = await getModulesCollection();
  const updateData: Partial<CourseModule> = {
    ...updates,
    updatedAt: new Date(),
  };

  if (updates.courseId && typeof updates.courseId === "string") {
    updateData.courseId = new ObjectId(updates.courseId);
  }

  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: updateData },
    { returnDocument: "after" }
  );

  if (!result) return null;
  return serializeModule(result);
}

export async function deleteModule(id: string): Promise<boolean> {
  if (!ObjectId.isValid(id)) return false;

  const collection = await getModulesCollection();
  const result = await collection.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount === 1;
}
