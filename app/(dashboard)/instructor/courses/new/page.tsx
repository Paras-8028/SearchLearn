import Link from "next/link";
import { ArrowLeft, BookPlus } from "lucide-react";
import { requireInstructor } from "@/lib/auth/require-user";
import { CourseCreateForm } from "@/components/instructor/course-create-form";

export const revalidate = 0;

export default async function NewCoursePage() {
  const user = await requireInstructor();

  if (!user) {
    return null;
  }

  return (
    <main className="p-6 md:p-10">
      <div className="mx-auto max-w-4xl space-y-8">
        <div>
          <Link
            href="/instructor/courses"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition-colors mb-3"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to My Courses</span>
          </Link>

          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <BookPlus className="w-3.5 h-3.5" />
            Authoring Workspace
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Create New Course
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Set up the foundation for your new course. You will be able to add structured modules, interactive lessons, and study documents immediately after creation.
          </p>
        </div>

        <CourseCreateForm />
      </div>
    </main>
  );
}