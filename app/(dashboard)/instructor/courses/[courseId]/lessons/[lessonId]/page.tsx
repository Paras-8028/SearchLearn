import { notFound, redirect } from "next/navigation";
import { requireUser, canManageCourse } from "@/lib/auth/require-user";
import { getCourseById } from "@/lib/db/repositories/courses";
import { getLessonById } from "@/lib/db/repositories/lessons";
import { LessonEditor } from "@/components/instructor/lesson-editor";

export const revalidate = 0;

interface LessonEditorPageProps {
  params: Promise<{ courseId: string; lessonId: string }>;
}

export default async function LessonEditorPage({ params }: LessonEditorPageProps) {
  const user = await requireUser();
  if (!user) {
    redirect("/sign-in");
  }

  const { courseId, lessonId } = await params;
  const [course, lesson] = await Promise.all([
    getCourseById(courseId),
    getLessonById(lessonId),
  ]);

  if (!course || !lesson) {
    notFound();
  }

  const canManage = await canManageCourse(courseId, user);
  if (!canManage) {
    return (
      <main className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-6">
        <div className="max-w-md text-center">
          <p className="text-sm font-semibold text-destructive">403</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-white">
            Access Denied
          </h1>
          <p className="mt-3 text-sm text-zinc-400">
            You do not have permission to edit this lesson.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="p-6 md:p-10">
      <LessonEditor course={course} lesson={lesson} />
    </main>
  );
}
