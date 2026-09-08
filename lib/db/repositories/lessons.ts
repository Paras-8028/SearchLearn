import { ObjectId } from "mongodb";
import clientPromise from "@/lib/db/mongodb";
import type { Lesson, LessonDTO, LessonInput } from "@/types/lesson";

const DATABASE_NAME = "searchlearn";
const LESSONS_COLLECTION = "lessons";

async function getLessonsCollection() {
  const client = await clientPromise;
  return client.db(DATABASE_NAME).collection<Lesson>(LESSONS_COLLECTION);
}

export function serializeLesson(lesson: Lesson): LessonDTO {
  return {
    ...lesson,
    _id: lesson._id ? lesson._id.toString() : "",
    courseId: lesson.courseId.toString(),
    moduleId: lesson.moduleId.toString(),
    createdAt: lesson.createdAt ? lesson.createdAt.toISOString() : new Date().toISOString(),
    updatedAt: lesson.updatedAt ? lesson.updatedAt.toISOString() : new Date().toISOString(),
  };
}

export async function createLesson(
  data: LessonInput
): Promise<LessonDTO> {
  const collection = await getLessonsCollection();
  const now = new Date();

  const cId = typeof data.courseId === "string" ? new ObjectId(data.courseId) : data.courseId;
  const mId = typeof data.moduleId === "string" ? new ObjectId(data.moduleId) : data.moduleId;

  const newLesson: Lesson = {
    ...data,
    courseId: cId,
    moduleId: mId,
    published: data.published ?? true,
    createdAt: now,
    updatedAt: now,
  };

  const result = await collection.insertOne(newLesson);
  return serializeLesson({
    ...newLesson,
    _id: result.insertedId,
  });
}

export async function getLessonsByModuleId(moduleId: string): Promise<LessonDTO[]> {
  if (!ObjectId.isValid(moduleId)) return [];

  const collection = await getLessonsCollection();
  const lessons = await collection
    .find({ moduleId: new ObjectId(moduleId) })
    .sort({ order: 1 })
    .toArray();

  return lessons.map(serializeLesson);
}

export async function getLessonsByCourseId(courseId: string): Promise<LessonDTO[]> {
  if (!ObjectId.isValid(courseId)) return [];

  const collection = await getLessonsCollection();
  const lessons = await collection
    .find({ courseId: new ObjectId(courseId) })
    .sort({ order: 1 })
    .toArray();

  return lessons.map(serializeLesson);
}

export async function getLessonById(id: string): Promise<LessonDTO | null> {
  if (!ObjectId.isValid(id)) return null;

  const collection = await getLessonsCollection();
  const lesson = await collection.findOne({ _id: new ObjectId(id) });
  if (!lesson) return null;

  return serializeLesson(lesson);
}

export async function updateLesson(
  id: string,
  updates: Partial<Omit<Lesson, "_id" | "createdAt">>
): Promise<LessonDTO | null> {
  if (!ObjectId.isValid(id)) return null;

  const collection = await getLessonsCollection();
  const updateData: Partial<Lesson> = {
    ...updates,
    updatedAt: new Date(),
  };

  if (updates.courseId && typeof updates.courseId === "string") {
    updateData.courseId = new ObjectId(updates.courseId);
  }
  if (updates.moduleId && typeof updates.moduleId === "string") {
    updateData.moduleId = new ObjectId(updates.moduleId);
  }

  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: updateData },
    { returnDocument: "after" }
  );

  if (!result) return null;
  return serializeLesson(result);
}

export async function deleteLesson(id: string): Promise<boolean> {
  if (!ObjectId.isValid(id)) return false;

  const collection = await getLessonsCollection();
  const result = await collection.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount === 1;
}
