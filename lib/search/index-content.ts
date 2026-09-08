import { getCourses, getCourseById } from "@/lib/db/repositories/courses";
import { getModulesByCourseId, getModuleById } from "@/lib/db/repositories/modules";
import { getLessonsByCourseId, getLessonById } from "@/lib/db/repositories/lessons";
import { upsertSearchDocument } from "@/lib/db/repositories/search";
import { generateEmbedding } from "@/lib/ai/embeddings";
import { isOpenAIConfigured } from "@/lib/ai/openai";
import {
  buildCourseSearchDocument,
  buildModuleSearchDocument,
  buildLessonSearchDocument,
} from "./build-search-document";

/**
 * Indexes a single course and updates its search document with embeddings
 */
export async function indexCourse(courseId: string) {
  const course = await getCourseById(courseId);
  if (!course) return null;

  const doc = buildCourseSearchDocument(course);

  let embedding: number[] | undefined;
  if (isOpenAIConfigured()) {
    try {
      embedding = await generateEmbedding(doc.searchableText);
    } catch (err) {
      console.warn(`[indexCourse] Could not generate embedding for course ${course.title}:`, err);
    }
  }

  return upsertSearchDocument({
    ...doc,
    embedding,
  });
}

/**
 * Indexes a single module and updates its search document
 */
export async function indexModule(moduleId: string) {
  const mod = await getModuleById(moduleId);
  if (!mod) return null;

  const course = await getCourseById(mod.courseId);
  const doc = buildModuleSearchDocument(mod, course);

  let embedding: number[] | undefined;
  if (isOpenAIConfigured()) {
    try {
      embedding = await generateEmbedding(doc.searchableText);
    } catch (err) {
      console.warn(`[indexModule] Could not generate embedding for module ${mod.title}:`, err);
    }
  }

  return upsertSearchDocument({
    ...doc,
    embedding,
  });
}

/**
 * Indexes a single lesson and updates its search document
 */
export async function indexLesson(lessonId: string) {
  const lesson = await getLessonById(lessonId);
  if (!lesson) return null;

  const course = await getCourseById(lesson.courseId);
  const mod = await getModuleById(lesson.moduleId);
  const doc = buildLessonSearchDocument(lesson, course, mod);

  let embedding: number[] | undefined;
  if (isOpenAIConfigured()) {
    try {
      embedding = await generateEmbedding(doc.searchableText);
    } catch (err) {
      console.warn(`[indexLesson] Could not generate embedding for lesson ${lesson.title}:`, err);
    }
  }

  return upsertSearchDocument({
    ...doc,
    embedding,
  });
}

/**
 * Reindexes all existing courses, modules, and lessons across the database
 */
export async function indexAllContent(): Promise<{
  coursesCount: number;
  modulesCount: number;
  lessonsCount: number;
  embeddingsGenerated: number;
}> {
  const courses = await getCourses();
  let modulesCount = 0;
  let lessonsCount = 0;
  let embeddingsGenerated = 0;

  const hasAI = isOpenAIConfigured();

  for (const course of courses) {
    // 1. Index Course
    const courseDoc = buildCourseSearchDocument(course);
    let courseEmbedding: number[] | undefined;
    if (hasAI) {
      try {
        courseEmbedding = await generateEmbedding(courseDoc.searchableText);
        embeddingsGenerated++;
      } catch (err) {
        console.warn(`[Reindex] Embedding failed for course ${course.title}:`, err);
      }
    }
    await upsertSearchDocument({
      ...courseDoc,
      embedding: courseEmbedding,
    });

    // 2. Index Modules
    const modules = await getModulesByCourseId(course._id);
    modulesCount += modules.length;

    for (const mod of modules) {
      const modDoc = buildModuleSearchDocument(mod, course);
      let modEmbedding: number[] | undefined;
      if (hasAI) {
        try {
          modEmbedding = await generateEmbedding(modDoc.searchableText);
          embeddingsGenerated++;
        } catch (err) {
          console.warn(`[Reindex] Embedding failed for module ${mod.title}:`, err);
        }
      }
      await upsertSearchDocument({
        ...modDoc,
        embedding: modEmbedding,
      });

      // 3. Index Lessons
      const lessons = await getLessonsByCourseId(course._id);
      const modLessons = lessons.filter(
        (l) => l.moduleId?.toString() === mod._id?.toString()
      );

      for (const lesson of modLessons) {
        lessonsCount++;
        const lessonDoc = buildLessonSearchDocument(lesson, course, mod);
        let lessonEmbedding: number[] | undefined;
        if (hasAI) {
          try {
            lessonEmbedding = await generateEmbedding(lessonDoc.searchableText);
            embeddingsGenerated++;
          } catch (err) {
            console.warn(`[Reindex] Embedding failed for lesson ${lesson.title}:`, err);
          }
        }
        await upsertSearchDocument({
          ...lessonDoc,
          embedding: lessonEmbedding,
        });
      }
    }
  }

  return {
    coursesCount: courses.length,
    modulesCount,
    lessonsCount,
    embeddingsGenerated,
  };
}
