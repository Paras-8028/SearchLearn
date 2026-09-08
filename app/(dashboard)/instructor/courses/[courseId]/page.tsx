import { notFound, redirect } from "next/navigation";
import { requireUser, canManageCourse } from "@/lib/auth/require-user";
import { getCourseById } from "@/lib/db/repositories/courses";
import { getModulesByCourseId } from "@/lib/db/repositories/modules";
import { getLessonsByModuleId } from "@/lib/db/repositories/lessons";
import { CourseManager } from "@/components/instructor/course-manager";

export const revalidate = 0;

interface CourseDetailPageProps {
  params: Promise<{ courseId: string }>;
}

export default async function CourseDetailPage({ params }: CourseDetailPageProps) {
  const user = await requireUser();
  if (!user) {
    redirect("/sign-in");
  }

  const { courseId } = await params;
  const course = await getCourseById(courseId);

  if (!course) {
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
            You do not have permission to manage this course. Only the course author or an
            administrator can edit these materials.
          </p>
        </div>
      </main>
    );
  }

  const modules = await getModulesByCourseId(courseId);
  const modulesWithLessons = await Promise.all(
    modules.map(async (mod) => {
      const lessons = await getLessonsByModuleId(mod._id);
      return {
        ...mod,
        lessons,
      };
    })
  );

  return (
    <main className="p-6 md:p-10">
      <div className="mx-auto max-w-7xl">
        <CourseManager
          initialCourse={course}
          initialModules={modulesWithLessons}
        />
      </div>
    </main>
  );
}
