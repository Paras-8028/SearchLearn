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

export async function deleteCourse(id: string): Promise<boolean> {
  if (!ObjectId.isValid(id)) return false;

  const collection = await getCoursesCollection();
  const result = await collection.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount === 1;
}
