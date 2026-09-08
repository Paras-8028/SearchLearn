import { ObjectId } from "mongodb";
import type { CourseDTO } from "@/types/course";
import type { CourseModuleDTO } from "@/types/module";
import type { LessonDTO } from "@/types/lesson";
import type { SearchDocument } from "@/types/search";

export function buildCourseSearchDocument(course: CourseDTO): Omit<SearchDocument, "_id" | "createdAt" | "updatedAt"> {
  const parts: string[] = [
    `Course: ${course.title}`,
    course.category ? `Category: ${course.category}` : "",
    course.level ? `Level: ${course.level}` : "",
    `Description: ${course.description}`,
  ].filter(Boolean);

  const searchableText = parts.join("\n\n");

  return {
    sourceType: "course",
    sourceId: new ObjectId(course._id),
    title: course.title,
    content: course.description,
    searchableText,
    metadata: {
      courseTitle: course.title,
      category: course.category,
      level: course.level,
      slug: course.slug,
    },
  };
}

export function buildModuleSearchDocument(
  module: CourseModuleDTO,
  course?: CourseDTO | null
): Omit<SearchDocument, "_id" | "createdAt" | "updatedAt"> {
  const parts: string[] = [
    course ? `Course: ${course.title}` : "",
    `Module: ${module.title}`,
    module.description ? `Description: ${module.description}` : "",
  ].filter(Boolean);

  const searchableText = parts.join("\n\n");

  return {
    sourceType: "module",
    sourceId: new ObjectId(module._id),
    courseId: new ObjectId(module.courseId),
    moduleId: new ObjectId(module._id),
    title: module.title,
    content: module.description || module.title,
    searchableText,
    metadata: {
      courseTitle: course?.title,
      moduleTitle: module.title,
      category: course?.category,
      level: course?.level,
    },
  };
}

export function buildLessonSearchDocument(
  lesson: LessonDTO,
  course?: CourseDTO | null,
  module?: CourseModuleDTO | null
): Omit<SearchDocument, "_id" | "createdAt" | "updatedAt"> {
  const parts: string[] = [
    course ? `Course: ${course.title}` : "",
    module ? `Module: ${module.title}` : "",
    `Lesson: ${lesson.title}`,
    `Content Type: ${lesson.contentType}`,
    lesson.description ? `Description: ${lesson.description}` : "",
    lesson.content ? `Content:\n${lesson.content}` : "",
  ].filter(Boolean);

  const searchableText = parts.join("\n\n");

  return {
    sourceType: "lesson",
    sourceId: new ObjectId(lesson._id),
    courseId: new ObjectId(lesson.courseId),
    moduleId: new ObjectId(lesson.moduleId),
    lessonId: new ObjectId(lesson._id),
    title: lesson.title,
    content: lesson.content || lesson.description || lesson.title,
    searchableText,
    metadata: {
      courseTitle: course?.title,
      moduleTitle: module?.title,
      category: course?.category,
      level: course?.level,
      contentType: lesson.contentType,
      duration: lesson.duration,
    },
  };
}
