import { ObjectId } from "mongodb";
import clientPromise from "@/lib/db/mongodb";
import type { Enrollment, EnrollmentDTO, EnrollmentWithCourseDTO } from "@/types/enrollment";
import { getCourseById } from "./courses";
import { getLessonsByCourseId } from "./lessons";
import { getCompletedLessonIds } from "./lesson-progress";

const DATABASE_NAME = "searchlearn";
const ENROLLMENTS_COLLECTION = "enrollments";

async function getEnrollmentsCollection() {
  const client = await clientPromise;
  return client.db(DATABASE_NAME).collection<Enrollment>(ENROLLMENTS_COLLECTION);
}

export function serializeEnrollment(enrollment: Enrollment): EnrollmentDTO {
  return {
    ...enrollment,
    _id: enrollment._id ? enrollment._id.toString() : "",
    courseId: enrollment.courseId.toString(),
    lastLessonId: enrollment.lastLessonId ? enrollment.lastLessonId.toString() : undefined,
    enrolledAt: enrollment.enrolledAt ? enrollment.enrolledAt.toISOString() : new Date().toISOString(),
    completedAt: enrollment.completedAt ? enrollment.completedAt.toISOString() : undefined,
  };
}

export async function createEnrollment(
  userId: string,
  courseId: string
): Promise<EnrollmentDTO> {
  if (!ObjectId.isValid(courseId)) {
    throw new Error("Invalid course ID");
  }

  const collection = await getEnrollmentsCollection();
  const cObjectId = new ObjectId(courseId);

  const existing = await collection.findOne({ userId, courseId: cObjectId });
  if (existing) {
    return serializeEnrollment(existing);
  }

  const now = new Date();
  const newEnrollment: Enrollment = {
    userId,
    courseId: cObjectId,
    enrolledAt: now,
    progressPercentage: 0,
  };

  const result = await collection.insertOne(newEnrollment);
  return serializeEnrollment({
    ...newEnrollment,
    _id: result.insertedId,
  });
}

export async function getEnrollment(
  userId: string,
  courseId: string
): Promise<EnrollmentDTO | null> {
  if (!ObjectId.isValid(courseId)) return null;

  const collection = await getEnrollmentsCollection();
  const enrollment = await collection.findOne({
    userId,
    courseId: new ObjectId(courseId),
  });

  if (!enrollment) return null;
  return serializeEnrollment(enrollment);
}

export async function getUserEnrollments(
  userId: string
): Promise<EnrollmentWithCourseDTO[]> {
  const collection = await getEnrollmentsCollection();
  const enrollments = await collection
    .find({ userId })
    .sort({ enrolledAt: -1 })
    .toArray();

  const results: EnrollmentWithCourseDTO[] = [];

  for (const enrollment of enrollments) {
    const serialized = serializeEnrollment(enrollment);
    const course = await getCourseById(serialized.courseId);
    const lessons = await getLessonsByCourseId(serialized.courseId);
    const completedLessonIds = await getCompletedLessonIds(userId, serialized.courseId);

    results.push({
      ...serialized,
      course: course ?? undefined,
      completedLessonsCount: completedLessonIds.length,
      totalLessonsCount: lessons.length,
    });
  }

  return results;
}

export async function updateEnrollmentProgress(
  userId: string,
  courseId: string,
  progressPercentage: number,
  lastLessonId?: string,
  completedAt?: Date
): Promise<EnrollmentDTO | null> {
  if (!ObjectId.isValid(courseId)) return null;

  const collection = await getEnrollmentsCollection();
  const cObjectId = new ObjectId(courseId);

  const updates: Partial<Enrollment> = {
    progressPercentage: Math.min(100, Math.max(0, Math.round(progressPercentage))),
  };

  if (lastLessonId && ObjectId.isValid(lastLessonId)) {
    updates.lastLessonId = new ObjectId(lastLessonId);
  }

  if (completedAt) {
    updates.completedAt = completedAt;
  } else if (progressPercentage >= 100) {
    updates.completedAt = new Date();
  }

  const result = await collection.findOneAndUpdate(
    { userId, courseId: cObjectId },
    { $set: updates },
    { returnDocument: "after" }
  );

  if (!result) return null;
  return serializeEnrollment(result);
}
