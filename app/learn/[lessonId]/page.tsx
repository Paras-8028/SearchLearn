import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getLessonById, getLessonsByModuleId } from "@/lib/db/repositories/lessons";
import { getModuleById, getModulesByCourseId } from "@/lib/db/repositories/modules";
import { getCourseById } from "@/lib/db/repositories/courses";
import { getEnrollment } from "@/lib/db/repositories/enrollments";
import { getCompletedLessonIds } from "@/lib/db/repositories/lesson-progress";
import { LearnViewer } from "@/components/learning/learn-viewer";

export const revalidate = 0;

interface LearnPageProps {
  params: Promise<{
    lessonId: string;
  }>;
}

export default async function LearnLessonPage({ params }: LearnPageProps) {
  const { lessonId } = await params;

  const lesson = await getLessonById(lessonId);
  if (!lesson) {
    notFound();
  }

  const currentModule = await getModuleById(lesson.moduleId);
  const course = await getCourseById(lesson.courseId);

  if (!course) {
    notFound();
  }

  const { userId } = await auth();

  // Get all modules and lessons for sidebar outline
  const modules = await getModulesByCourseId(course._id);
  const modulesWithLessons = await Promise.all(
    modules.map(async (mod) => {
      const lessons = await getLessonsByModuleId(mod._id);
      return {
        ...mod,
        lessons,
      };
    })
  );

  let completedLessonIds: string[] = [];
  let progressPercentage = 0;

  if (userId) {
    completedLessonIds = await getCompletedLessonIds(userId, course._id);
    const enrollment = await getEnrollment(userId, course._id);
    if (enrollment) {
      progressPercentage = enrollment.progressPercentage;
    }
  }

  return (
    <LearnViewer
      lesson={lesson}
      course={course}
      currentModule={currentModule}
      modules={modulesWithLessons}
      initialCompletedLessonIds={completedLessonIds}
      initialProgressPercentage={progressPercentage}
    />
  );
}
