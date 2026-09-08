import Link from "next/link";
import {
  BookOpen,
  PlusCircle,
  Users,
  Layers,
  FileText,
  Sparkles,
  ArrowRight,
  Eye,
  Settings2,
} from "lucide-react";
import { requireInstructor } from "@/lib/auth/require-user";
import { getCoursesByInstructor, getInstructorStats } from "@/lib/db/repositories/courses";

export const revalidate = 0;

export default async function InstructorDashboardPage() {
  const user = await requireInstructor();

  if (!user) {
    return null;
  }

  const [stats, courses] = await Promise.all([
    getInstructorStats(user.clerkId),
    getCoursesByInstructor(user.clerkId),
  ]);

  const recentCourses = courses.slice(0, 4);

  return (
    <main className="p-6 md:p-10">
      <div className="mx-auto max-w-7xl space-y-10">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-800/80 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              Instructor Workspace
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Studio Dashboard
            </h1>
            <p className="text-sm text-zinc-400 mt-1 max-w-xl">
              Manage your curriculum, author lessons, and view learning metrics for{" "}
              <span className="text-zinc-200 font-medium">
                {user.firstName ? `${user.firstName}'s courses` : "your courses"}
              </span>
              .
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/instructor/courses/new"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create New Course</span>
            </Link>
          </div>
        </div>

        {/* Real Statistics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800/80 space-y-2">
            <div className="flex items-center justify-between text-zinc-400 text-xs font-medium">
              <span>Total Courses</span>
              <BookOpen className="w-4 h-4 text-indigo-400" />
            </div>
            <p className="text-3xl font-extrabold text-white">{stats.totalCourses}</p>
            <div className="text-[11px] text-zinc-500 flex items-center gap-2">
              <span className="text-emerald-400 font-medium">
                {stats.publishedCourses} published
              </span>
              <span>•</span>
              <span className="text-amber-400 font-medium">
                {stats.draftCourses} draft
              </span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800/80 space-y-2">
            <div className="flex items-center justify-between text-zinc-400 text-xs font-medium">
              <span>Total Students</span>
              <Users className="w-4 h-4 text-indigo-400" />
            </div>
            <p className="text-3xl font-extrabold text-white">{stats.totalStudents}</p>
            <p className="text-[11px] text-zinc-500">Total course enrollments</p>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800/80 space-y-2">
            <div className="flex items-center justify-between text-zinc-400 text-xs font-medium">
              <span>Curriculum Modules</span>
              <Layers className="w-4 h-4 text-indigo-400" />
            </div>
            <p className="text-3xl font-extrabold text-white">{stats.totalModules}</p>
            <p className="text-[11px] text-zinc-500">Structured sections created</p>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800/80 space-y-2">
            <div className="flex items-center justify-between text-zinc-400 text-xs font-medium">
              <span>Lessons Authored</span>
              <FileText className="w-4 h-4 text-indigo-400" />
            </div>
            <p className="text-3xl font-extrabold text-white">{stats.totalLessons}</p>
            <p className="text-[11px] text-zinc-500">Search-indexed learning units</p>
          </div>
        </div>

        {/* Recent Courses Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Your Courses</h2>
              <p className="text-xs text-zinc-400">
                Quick access to your authored courses and learning content
              </p>
            </div>

            {courses.length > 0 && (
              <Link
                href="/instructor/courses"
                className="text-xs font-medium text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1"
              >
                <span>View all ({courses.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>

          {courses.length === 0 ? (
            <div className="p-12 text-center border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/30 space-y-4">
              <BookOpen className="w-12 h-12 text-zinc-600 mx-auto" />
              <div>
                <h3 className="text-base font-semibold text-zinc-200">
                  You haven&apos;t created any courses yet
                </h3>
                <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
                  Build your first course curriculum, author interactive lessons, and upload
                  documents to make them searchable.
                </p>
              </div>
              <Link
                href="/instructor/courses/new"
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-all shadow"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create Your First Course</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentCourses.map((course) => (
                <div
                  key={course._id}
                  className="group relative p-5 bg-zinc-900/70 border border-zinc-800/80 hover:border-zinc-700 rounded-2xl transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="min-w-0">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                          {course.category || "General"}
                        </span>
                        <h3 className="text-base font-bold text-zinc-100 group-hover:text-indigo-300 transition-colors line-clamp-1">
                          {course.title}
                        </h3>
                      </div>

                      <span
                        className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border shrink-0 ${
                          course.published
                            ? "bg-emerald-950/60 text-emerald-400 border-emerald-800/50"
                            : "bg-amber-950/60 text-amber-400 border-amber-800/50"
                        }`}
                      >
                        {course.published ? "Published" : "Draft"}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed mb-4">
                      {course.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-zinc-800/60 flex items-center justify-between text-xs">
                    <span className="text-zinc-500 capitalize">
                      Level: {course.level || "Beginner"}
                    </span>

                    <div className="flex items-center gap-2">
                      {course.published && (
                        <Link
                          href={`/courses/${course._id}`}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors text-xs inline-flex items-center gap-1"
                          title="View public course"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Preview</span>
                        </Link>
                      )}

                      <Link
                        href={`/instructor/courses/${course._id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition-colors"
                      >
                        <Settings2 className="w-3.5 h-3.5" />
                        <span>Manage</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}