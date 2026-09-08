import Link from "next/link";
import {
  BookOpen,
  FileSearch,
  GraduationCap,
  History,
  PlayCircle,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

import { DashboardCard } from "@/components/dashboard/dashboard-card";
import type { EnrollmentWithCourseDTO } from "@/types/enrollment";

interface StudentDashboardProps {
  firstName: string;
  enrollments?: EnrollmentWithCourseDTO[];
}

export function StudentDashboard({
  firstName,
  enrollments = [],
}: StudentDashboardProps) {
  const activeEnrollment = enrollments[0];

  return (
    <div>
      <div>
        <p className="text-sm text-muted-foreground">
          Your learning workspace
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          Welcome back, {firstName}
        </h1>

        <p className="mt-3 max-w-2xl text-muted-foreground">
          Search your learning library, continue your courses, and discover
          exactly where concepts are explained.
        </p>
      </div>

      <section className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Search Learning Content"
          description="Find concepts across courses, videos, transcripts, notes, and documents."
          href="/search"
          icon={FileSearch}
        />

        <DashboardCard
          title={`My Courses (${enrollments.length})`}
          description={
            enrollments.length > 0
              ? `You are currently enrolled in ${enrollments.length} ${enrollments.length === 1 ? "course" : "courses"}.`
              : "Browse your enrolled courses and continue learning."
          }
          href="/courses"
          icon={BookOpen}
        />

        <DashboardCard
          title="Continue Learning"
          description={
            activeEnrollment?.course
              ? `Resume ${activeEnrollment.course.title} (${activeEnrollment.progressPercentage}% completed).`
              : "Return to lessons and keep your learning progress moving."
          }
          href={
            activeEnrollment?.lastLessonId
              ? `/learn/${activeEnrollment.lastLessonId}`
              : "/learn"
          }
          icon={GraduationCap}
        />

        <DashboardCard
          title="Search History"
          description="Review your previous searches and discoveries."
          href="/search/history"
          icon={History}
        />
      </section>

      {/* Continue Learning Active Hero Section */}
      {activeEnrollment && activeEnrollment.course && (
        <section className="mt-10 rounded-2xl border border-primary/30 bg-gradient-to-r from-card via-card/80 to-primary/5 p-6 md:p-8 shadow-lg">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-2 text-xs font-semibold text-primary">
                <Sparkles className="h-4 w-4" />
                <span>Jump Right Back In</span>
              </div>

              <h2 className="text-2xl font-bold text-foreground">
                {activeEnrollment.course.title}
              </h2>

              <p className="text-sm text-muted-foreground line-clamp-2">
                {activeEnrollment.course.description}
              </p>

              {/* Progress Bar */}
              <div className="space-y-1.5 pt-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    {activeEnrollment.completedLessonsCount || 0} of{" "}
                    {activeEnrollment.totalLessonsCount || 0} lessons completed
                  </span>
                  <span className="font-semibold text-primary">
                    {activeEnrollment.progressPercentage}%
                  </span>
                </div>

                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full bg-primary transition-all duration-500"
                    style={{ width: `${activeEnrollment.progressPercentage}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href={
                  activeEnrollment.lastLessonId
                    ? `/learn/${activeEnrollment.lastLessonId}`
                    : `/courses/${activeEnrollment.course._id}`
                }
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90 shadow-md shadow-primary/20"
              >
                <PlayCircle className="h-4 w-4" />
                <span>Continue Learning</span>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Enrolled Courses Grid */}
      <section className="mt-10 rounded-xl border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground">
          Enrolled Courses ({enrollments.length})
        </h2>

        {enrollments.length > 0 ? (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {enrollments.map((item) => (
              <div
                key={item._id}
                className="flex flex-col justify-between rounded-lg border border-border/80 bg-card/40 p-4 transition-all hover:border-primary/40"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                    <span className="capitalize font-medium text-secondary-foreground">
                      {item.course?.category || "Course"}
                    </span>
                    <span className="font-semibold text-primary">
                      {item.progressPercentage}%
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-foreground line-clamp-1">
                    {item.course?.title}
                  </h3>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-border/40 pt-3 text-xs">
                  <span className="text-muted-foreground">
                    {item.completedLessonsCount || 0}/{item.totalLessonsCount || 0} lessons
                  </span>

                  <Link
                    href={`/courses/${item.courseId}`}
                    className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
                  >
                    <span>View</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-4 rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
            <CheckCircle2 className="mx-auto h-8 w-8 text-muted-foreground/40 mb-2" />
            <p>You have not enrolled in any courses yet.</p>
            <Link
              href="/courses"
              className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              <span>Explore Course Catalog</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}