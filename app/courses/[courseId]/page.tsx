import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getCourseById, getCourseBySlug } from "@/lib/db/repositories/courses";
import { getModulesByCourseId } from "@/lib/db/repositories/modules";
import { getLessonsByModuleId, getLessonsByCourseId } from "@/lib/db/repositories/lessons";
import { getEnrollment } from "@/lib/db/repositories/enrollments";
import { getCompletedLessonIds } from "@/lib/db/repositories/lesson-progress";
import { CourseHeader } from "@/components/courses/course-header";
import { ModuleList, type ModuleWithLessonsDTO } from "@/components/courses/module-list";

export const revalidate = 0;

interface CourseDetailsPageProps {
  params: Promise<{
    courseId: string;
  }>;
}

export default async function CourseDetailsPage({ params }: CourseDetailsPageProps) {
  const { courseId } = await params;

  let course = await getCourseById(courseId);
  if (!course) {
    course = await getCourseBySlug(courseId);
  }

  if (!course) {
    notFound();
  }

  const { userId } = await auth();

  const modules = await getModulesByCourseId(course._id);
  const lessons = await getLessonsByCourseId(course._id);

  const modulesWithLessons: ModuleWithLessonsDTO[] = await Promise.all(
    modules.map(async (mod) => {
      const modLessons = await getLessonsByModuleId(mod._id);
      return {
        ...mod,
        lessons: modLessons,
      };
    })
  );

  let enrollment = null;
  let completedLessonIds: string[] = [];

  if (userId) {
    enrollment = await getEnrollment(userId, course._id);
    completedLessonIds = await getCompletedLessonIds(userId, course._id);
  }

  const firstLessonId = lessons[0]?._id;

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-background py-10">
      <div className="mx-auto max-w-5xl px-6 lg:px-8 space-y-10">
        {/* Course Banner Header */}
        <CourseHeader
          course={course}
          moduleCount={modules.length}
          lessonCount={lessons.length}
          firstLessonId={firstLessonId}
          enrollment={enrollment}
        />

        {/* Modules & Lessons Section */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Course Content
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {modules.length} modules • {lessons.length} lessons
            </p>
          </div>

          <ModuleList
            modules={modulesWithLessons}
            completedLessonIds={completedLessonIds}
          />
        </section>
      </div>
    </main>
  );
}
