import Link from "next/link";
import { BookOpen, Award } from "lucide-react";
import type { LearningAnalytics } from "@/types/analytics";

interface PopularCoursesProps {
  courses: LearningAnalytics["mostPopularCourses"];
}

export function PopularCourses({ courses }: PopularCoursesProps) {
  return (
    <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 backdrop-blur space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-indigo-400" />
          <h3 className="text-sm font-semibold text-white">Popular Courses</h3>
        </div>
        <span className="text-[11px] text-zinc-500">Ranked by enrollments</span>
      </div>

      {courses.length === 0 ? (
        <div className="py-8 text-center rounded-xl border border-dashed border-zinc-800/80">
          <p className="text-xs text-zinc-500">No course enrollments recorded in this range.</p>
        </div>
      ) : (
        <div className="divide-y divide-zinc-800/60">
          {courses.map((course, idx) => {
            const completionRate =
              course.enrollmentCount > 0
                ? Math.round((course.completedCount / course.enrollmentCount) * 100)
                : 0;

            return (
              <div
                key={course.courseId}
                className="py-3 flex items-center justify-between gap-4 text-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-[10px] font-bold text-zinc-400">
                    {idx + 1}
                  </span>
                  <div className="truncate">
                    <Link
                      href={`/courses/${course.courseId}`}
                      className="font-medium text-zinc-200 hover:text-indigo-400 truncate block transition-colors"
                    >
                      {course.title}
                    </Link>
                    <p className="text-[11px] text-zinc-500 flex items-center gap-2 mt-0.5">
                      <span>{course.enrollmentCount} enrolled</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-emerald-400">
                        <Award className="h-3 w-3" />
                        {completionRate}% completed
                      </span>
                    </p>
                  </div>
                </div>

                <Link
                  href={`/courses/${course.courseId}`}
                  className="shrink-0 px-2.5 py-1 rounded-lg bg-zinc-800/70 hover:bg-zinc-800 text-[11px] font-medium text-zinc-300 transition-colors"
                >
                  View
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
