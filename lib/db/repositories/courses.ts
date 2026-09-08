import { ObjectId, Filter } from "mongodb";
import clientPromise from "@/lib/db/mongodb";
import type { Course, CourseDTO } from "@/types/course";

const DATABASE_NAME = "searchlearn";
const COURSES_COLLECTION = "courses";

async function getCoursesCollection() {
  const client = await clientPromise;
  return client.db(DATABASE_NAME).collection<Course>(COURSES_COLLECTION);
}

export function serializeCourse(course: Course): CourseDTO {
  return {
    ...course,
    _id: course._id ? course._id.toString() : "",
    createdAt: course.createdAt ? course.createdAt.toISOString() : new Date().toISOString(),
    updatedAt: course.updatedAt ? course.updatedAt.toISOString() : new Date().toISOString(),
  };
}

export async function createCourse(
  data: Omit<Course, "_id" | "createdAt" | "updatedAt">
): Promise<CourseDTO> {
  const collection = await getCoursesCollection();
  const now = new Date();

  const newCourse: Course = {
    ...data,
    published: data.published ?? false,
    createdAt: now,
    updatedAt: now,
  };

  const result = await collection.insertOne(newCourse);
  return serializeCourse({
    ...newCourse,
    _id: result.insertedId,
  });
}

export async function getCourses(options?: {
  publishedOnly?: boolean;
  category?: string;
  level?: string;
  search?: string;
  instructorId?: string;
}): Promise<CourseDTO[]> {
  const collection = await getCoursesCollection();
  const filter: Filter<Course> = {};

  if (options?.publishedOnly) {
    filter.published = true;
  }

  if (options?.instructorId) {
    filter.instructorId = options.instructorId;
  }

  if (options?.category && options.category !== "all") {
    filter.category = options.category;
  }

  if (options?.level && options.level !== "all") {
    filter.level = options.level as Course["level"];
  }

  if (options?.search) {
    const searchRegex = new RegExp(options.search, "i");
    filter.$or = [
      { title: { $regex: searchRegex } },
      { description: { $regex: searchRegex } },
      { category: { $regex: searchRegex } },
    ];
  }

  const courses = await collection
    .find(filter)
    .sort({ createdAt: -1 })
    .toArray();

  return courses.map(serializeCourse);
}

export async function getCourseById(id: string): Promise<CourseDTO | null> {
  if (!ObjectId.isValid(id)) return null;

  const collection = await getCoursesCollection();
  const course = await collection.findOne({ _id: new ObjectId(id) });
  if (!course) return null;

  return serializeCourse(course);
}

export async function getCourseBySlug(slug: string): Promise<CourseDTO | null> {
  const collection = await getCoursesCollection();
  const course = await collection.findOne({ slug });
  if (!course) return null;

  return serializeCourse(course);
}

export async function updateCourse(
  id: string,
  updates: Partial<Omit<Course, "_id" | "createdAt">>
): Promise<CourseDTO | null> {
  if (!ObjectId.isValid(id)) return null;

  const collection = await getCoursesCollection();
  const updateData = {
    ...updates,
    updatedAt: new Date(),
  };

  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: updateData },
    { returnDocument: "after" }
  );

  if (!result) return null;
  return serializeCourse(result);
}

export async function getCoursesByInstructor(
  instructorId: string,
  options?: {
    search?: string;
    status?: "all" | "published" | "draft";
  }
): Promise<CourseDTO[]> {
  const collection = await getCoursesCollection();
  const filter: Filter<Course> = { instructorId };

  if (options?.status === "published") {
    filter.published = true;
  } else if (options?.status === "draft") {
    filter.published = false;
  }

  if (options?.search && options.search.trim()) {
    const searchRegex = new RegExp(options.search.trim(), "i");
    filter.$or = [
      { title: { $regex: searchRegex } },
      { description: { $regex: searchRegex } },
      { category: { $regex: searchRegex } },
    ];
  }

  const courses = await collection
    .find(filter)
    .sort({ createdAt: -1 })
    .toArray();

  return courses.map(serializeCourse);
}

export async function getInstructorStats(instructorId: string): Promise<{
  totalCourses: number;
  publishedCourses: number;
  draftCourses: number;
  totalModules: number;
  totalLessons: number;
  totalStudents: number;
}> {
  const client = await clientPromise;
  const db = client.db(DATABASE_NAME);

  const coursesCol = db.collection<Course>(COURSES_COLLECTION);
  const modulesCol = db.collection("modules");
  const lessonsCol = db.collection("lessons");
  const enrollmentsCol = db.collection("enrollments");

  const instructorCourses = await coursesCol
    .find({ instructorId }, { projection: { _id: 1, published: 1 } })
    .toArray();

  const totalCourses = instructorCourses.length;
  const publishedCourses = instructorCourses.filter((c) => c.published).length;
  const draftCourses = totalCourses - publishedCourses;

  if (totalCourses === 0) {
    return {
      totalCourses: 0,
      publishedCourses: 0,
      draftCourses: 0,
      totalModules: 0,
      totalLessons: 0,
      totalStudents: 0,
    };
  }

  const courseObjectIds = instructorCourses.map((c) => c._id as ObjectId);

  const [totalModules, totalLessons, totalStudents] = await Promise.all([
    modulesCol.countDocuments({ courseId: { $in: courseObjectIds } }),
    lessonsCol.countDocuments({ courseId: { $in: courseObjectIds } }),
    enrollmentsCol.countDocuments({ courseId: { $in: courseObjectIds } }),
  ]);

  return {
    totalCourses,
    publishedCourses,
    draftCourses,
    totalModules,
    totalLessons,
    totalStudents,
  };
}

export async function getAdminPlatformStats(): Promise<{
  users: { total: number; students: number; instructors: number; admins: number };
  courses: { total: number; published: number; draft: number };
  modules: { total: number };
  lessons: { total: number };
  enrollments: { total: number };
  searches: { total: number };
  aiRequests: { total: number; totalTokens: number };
  documents: { total: number };
}> {
  const client = await clientPromise;
  const db = client.db(DATABASE_NAME);

  const usersCol = db.collection("users");
  const coursesCol = db.collection<Course>(COURSES_COLLECTION);
  const modulesCol = db.collection("modules");
  const lessonsCol = db.collection("lessons");
  const enrollmentsCol = db.collection("enrollments");
  const searchesCol = db.collection("searchHistory");
  const aiLogsCol = db.collection("aiRequestLogs");
  const documentsCol = db.collection("learning_documents");

  const [
    totalUsers,
    studentUsers,
    instructorUsers,
    adminUsers,
    totalCourses,
    publishedCourses,
    totalModules,
    totalLessons,
    totalEnrollments,
    totalSearches,
    totalAiRequests,
    aiTokensAgg,
    totalDocuments,
  ] = await Promise.all([
    usersCol.countDocuments({}),
    usersCol.countDocuments({ role: "student" }),
    usersCol.countDocuments({ role: "instructor" }),
    usersCol.countDocuments({ role: "admin" }),
    coursesCol.countDocuments({}),
    coursesCol.countDocuments({ published: true }),
    modulesCol.countDocuments({}),
    lessonsCol.countDocuments({}),
    enrollmentsCol.countDocuments({}),
    searchesCol.countDocuments({}),
    aiLogsCol.countDocuments({}),
    aiLogsCol.aggregate<{ totalTokens: number }>([
      { $group: { _id: null, totalTokens: { $sum: "$totalTokens" } } },
    ]).toArray(),
    documentsCol.countDocuments({}),
  ]);

  const totalTokens = aiTokensAgg[0]?.totalTokens || 0;

  return {
    users: {
      total: totalUsers,
      students: studentUsers,
      instructors: instructorUsers,
      admins: adminUsers,
    },
    courses: {
      total: totalCourses,
      published: publishedCourses,
      draft: totalCourses - publishedCourses,
    },
    modules: { total: totalModules },
    lessons: { total: totalLessons },
    enrollments: { total: totalEnrollments },
    searches: { total: totalSearches },
    aiRequests: { total: totalAiRequests, totalTokens },
    documents: { total: totalDocuments },
  };
}

export async function deleteCourseCascade(id: string): Promise<boolean> {
  if (!ObjectId.isValid(id)) return false;

  const client = await clientPromise;
  const db = client.db(DATABASE_NAME);
  const courseObjectId = new ObjectId(id);

  // 1. Delete all child lessons
  await db.collection("lessons").deleteMany({ courseId: courseObjectId });

  // 2. Delete all child modules
  await db.collection("modules").deleteMany({ courseId: courseObjectId });

  // 3. Delete search index documents associated with this course
  await db.collection("searchDocuments").deleteMany({
    $or: [{ courseId: courseObjectId }, { sourceId: courseObjectId }],
  });

  // 4. Delete learning documents linked to this course
  await db.collection("learning_documents").deleteMany({ courseId: id });

  // 5. Delete enrollments for this course
  await db.collection("enrollments").deleteMany({ courseId: courseObjectId });

  // 6. Delete course
  const result = await db.collection<Course>(COURSES_COLLECTION).deleteOne({ _id: courseObjectId });
  return result.deletedCount === 1;
}

export async function deleteCourse(id: string): Promise<boolean> {
  return deleteCourseCascade(id);
}

