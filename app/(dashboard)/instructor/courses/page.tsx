import Link from "next/link";
import { PlusCircle, BookOpen } from "lucide-react";
import { requireInstructor } from "@/lib/auth/require-user";
import { getCoursesByInstructor } from "@/lib/db/repositories/courses";
import { InstructorCoursesList } from "@/components/instructor/instructor-courses-list";

export const revalidate = 0;

export default async function InstructorCoursesPage() {
  const user = await requireInstructor();

  if (!user) {
    return null;
  }

  const courses = await getCoursesByInstructor(user.clerkId);

  return (
    <main className="p-6 md:p-10">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-800/80 pb-6">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <BookOpen className="w-3.5 h-3.5" />
              Course Catalog
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              My Courses
            </h1>
            <p className="text-sm text-zinc-400 mt-1 max-w-xl">
              Create, edit, and maintain your authored courses, curriculum modules, and search-indexed lessons.
            </p>
          </div>

          <Link
            href="/instructor/courses/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Course</span>
          </Link>
        </div>

        {/* Courses List Component */}
        <InstructorCoursesList initialCourses={courses} />
      </div>
    </main>
  );
}