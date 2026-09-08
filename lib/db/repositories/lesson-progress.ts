import { ObjectId } from "mongodb";
import clientPromise from "@/lib/db/mongodb";
import type { LessonProgress, LessonProgressDTO } from "@/types/lesson-progress";

const DATABASE_NAME = "searchlearn";
const LESSON_PROGRESS_COLLECTION = "lessonProgress";

async function getLessonProgressCollection() {
  const client = await clientPromise;
  return client.db(DATABASE_NAME).collection<LessonProgress>(LESSON_PROGRESS_COLLECTION);
}

export function serializeLessonProgress(lp: LessonProgress): LessonProgressDTO {
  return {
    ...lp,
    _id: lp._id ? lp._id.toString() : "",
    courseId: lp.courseId.toString(),
    moduleId: lp.moduleId.toString(),
    lessonId: lp.lessonId.toString(),
    lastAccessedAt: lp.lastAccessedAt ? lp.lastAccessedAt.toISOString() : new Date().toISOString(),
    completedAt: lp.completedAt ? lp.completedAt.toISOString() : undefined,
  };
}

export async function upsertLessonProgress(data: {
  userId: string;
  courseId: string;
  moduleId: string;
  lessonId: string;
  completed: boolean;
  progress?: number;
}): Promise<LessonProgressDTO> {
  if (
    !ObjectId.isValid(data.courseId) ||
    !ObjectId.isValid(data.moduleId) ||
    !ObjectId.isValid(data.lessonId)
  ) {
    throw new Error("Invalid ObjectId provided to lesson progress");
  }

  const collection = await getLessonProgressCollection();
  const cId = new ObjectId(data.courseId);
  const mId = new ObjectId(data.moduleId);
  const lId = new ObjectId(data.lessonId);

  const now = new Date();
  const updates: Partial<LessonProgress> = {
    userId: data.userId,
    courseId: cId,
    moduleId: mId,
    lessonId: lId,
    completed: data.completed,
    progress: data.progress ?? (data.completed ? 100 : 0),
    lastAccessedAt: now,
  };

  if (data.completed) {
    updates.completedAt = now;
  }

  const result = await collection.findOneAndUpdate(
    { userId: data.userId, lessonId: lId },
    { $set: updates },
    { upsert: true, returnDocument: "after" }
  );

  if (!result) {
    throw new Error("Failed to update lesson progress");
  }

  return serializeLessonProgress(result);
}

export async function getLessonProgress(
  userId: string,
  lessonId: string
): Promise<LessonProgressDTO | null> {
  if (!ObjectId.isValid(lessonId)) return null;

  const collection = await getLessonProgressCollection();
  const progress = await collection.findOne({
    userId,
    lessonId: new ObjectId(lessonId),
  });

  if (!progress) return null;
  return serializeLessonProgress(progress);
}

export async function getCourseProgress(
  userId: string,
  courseId: string
): Promise<LessonProgressDTO[]> {
  if (!ObjectId.isValid(courseId)) return [];

  const collection = await getLessonProgressCollection();
  const list = await collection
    .find({ userId, courseId: new ObjectId(courseId) })
    .toArray();

  return list.map(serializeLessonProgress);
}

export async function getCompletedLessonIds(
  userId: string,
  courseId: string
): Promise<string[]> {
  if (!ObjectId.isValid(courseId)) return [];

  const collection = await getLessonProgressCollection();
  const list = await collection
    .find({
      userId,
      courseId: new ObjectId(courseId),
      completed: true,
    })
    .toArray();

  return list.map((lp) => lp.lessonId.toString());
}
