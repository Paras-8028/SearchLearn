import { getCourses } from "@/lib/db/repositories/courses";
import { AdminCoursesList } from "@/components/admin/admin-courses-list";
import { ShieldCheck } from "lucide-react";

export const revalidate = 0;

export default async function AdminCoursesPage() {
  const courses = await getCourses({ publishedOnly: false });

  return (
    <main className="p-6 md:p-10">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-800/80 pb-6">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Global Content Governance
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Platform Courses
            </h1>
            <p className="text-sm text-zinc-400 mt-1 max-w-xl">
              Inspect, review, and manage courses created across all instructors. Modify curriculum and perform administrative deletions if necessary.
            </p>
          </div>
        </div>

        <AdminCoursesList initialCourses={courses} />
      </div>
    </main>
  );
}
