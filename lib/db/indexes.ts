import clientPromise from "@/lib/db/mongodb";

export async function createDatabaseIndexes() {
  const client = await clientPromise;
  const db = client.db("searchlearn");

  // Users indexes
  await db.collection("users").createIndex({ clerkId: 1 }, { unique: true });
  await db.collection("users").createIndex({ email: 1 });

  // Courses indexes
  await db.collection("courses").createIndex({ slug: 1 }, { unique: true });
  await db.collection("courses").createIndex({ instructorId: 1 });
  await db.collection("courses").createIndex({ published: 1 });

  // Modules indexes
  await db.collection("modules").createIndex({ courseId: 1 });
  await db.collection("modules").createIndex({ courseId: 1, order: 1 });

  // Lessons indexes
  await db.collection("lessons").createIndex({ courseId: 1 });
  await db.collection("lessons").createIndex({ moduleId: 1 });
  await db.collection("lessons").createIndex({ moduleId: 1, order: 1 });

  // Enrollments indexes
  await db.collection("enrollments").createIndex(
    { userId: 1, courseId: 1 },
    { unique: true }
  );
  await db.collection("enrollments").createIndex({ userId: 1 });

  // Lesson progress indexes
  await db.collection("lessonProgress").createIndex(
    { userId: 1, lessonId: 1 },
    { unique: true }
  );
  await db.collection("lessonProgress").createIndex({ userId: 1, courseId: 1 });

  // Search Documents indexes
  await db.collection("searchDocuments").createIndex(
    { sourceId: 1 },
    { unique: true }
  );
  await db.collection("searchDocuments").createIndex({ sourceType: 1 });
  await db.collection("searchDocuments").createIndex({ courseId: 1 });
  await db.collection("searchDocuments").createIndex({ moduleId: 1 });
  await db.collection("searchDocuments").createIndex({ lessonId: 1 });

  // Search History indexes
  await db.collection("searchHistory").createIndex({ userId: 1, createdAt: -1 });
}