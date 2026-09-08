import Link from "next/link";
import {
  BookOpen,
  FileSearch,
  History,
  PlayCircle,
  Sparkles,
  ArrowRight,
  Layers,
  Flame,
} from "lucide-react";

import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { LearningOverview } from "@/components/analytics/learning-overview";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import type { EnrollmentWithCourseDTO } from "@/types/enrollment";
import type { StudentLearningStats } from "@/types/analytics";

interface StudentDashboardProps {
  firstName: string;
  enrollments?: EnrollmentWithCourseDTO[];
  learningStats?: StudentLearningStats;
}

export function StudentDashboard({
  firstName,
  enrollments = [],
  learningStats,
}: StudentDashboardProps) {
  const activeEnrollment = enrollments[0];

  const todayFormatted = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  }).format(new Date());

  return (
    <div className="space-y-10">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
            <span>{todayFormatted}</span>
            <span>•</span>
            <span className="text-indigo-400 font-medium">Learning Workspace</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Welcome back, {firstName}
          </h1>

          <p className="mt-1 text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Search your knowledge library, resume in-progress lessons, and receive AI-grounded tutoring.
          </p>
        </div>

        {learningStats?.currentStreak ? (
          <div className="flex items-center gap-2.5 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-amber-400 shrink-0 shadow-sm">
            <Flame className="size-5 text-amber-400 fill-amber-400/20" />
            <div>
              <div className="text-sm font-bold leading-none">
                {learningStats.currentStreak} Day Streak
              </div>
              <p className="text-[10px] text-amber-300/80 mt-0.5">Active consistency</p>
            </div>
          </div>
        ) : null}
      </div>

      {/* Learning Stats & 7-Day Consistency Tracker */}
      {learningStats && (
        <section>
          <LearningOverview stats={learningStats} />
        </section>
      )}

      {/* Quick Action Navigation Grid */}
      <section>
        <div className="mb-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Quick Actions
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <DashboardCard
            title="Search Content"
            description="Find exact concepts across courses, video moments, transcripts, and notes."
            href="/search"
            icon={FileSearch}
            badge="Vector"
          />

          <DashboardCard
            title="Ask AI Mentor"
            description="Ask questions and receive explanations strictly cited from your library."
            href="/ask"
            icon={Sparkles}
            badge="RAG"
          />

          <DashboardCard
            title="Explore Courses"
            description={`Browse the catalog. Enrolled in ${enrollments.length} ${enrollments.length === 1 ? "course" : "courses"}.`}
            href="/courses"
            icon={BookOpen}
          />

          <DashboardCard
            title="Search History"
            description="Review your previous queries, discoveries, and result clicks."
            href="/search/history"
            icon={History}
          />
        </div>
      </section>

      {/* Continue Learning Active Hero Section */}
      {activeEnrollment && activeEnrollment.course ? (
        <section className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-r from-card via-card/90 to-primary/10 p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-3 max-w-2xl">
              <Badge variant="indigo" className="px-3 py-0.5 text-xs">
                <PlayCircle className="size-3.5 text-indigo-400" />
                <span>Resume Active Course</span>
              </Badge>

              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {activeEnrollment.course.title}
              </h2>

              <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                {activeEnrollment.course.description}
              </p>

              {/* Progress Bar & Counter */}
              <div className="space-y-1.5 pt-2 max-w-md">
                <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
                  <span>
                    {activeEnrollment.completedLessonsCount || 0} of{" "}
                    {activeEnrollment.totalLessonsCount || 0} lessons completed
                  </span>
                  <span className="font-semibold text-primary">
                    {activeEnrollment.progressPercentage}%
                  </span>
                </div>

                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary/80">
                  <div
                    className="h-full bg-primary transition-all duration-500 rounded-full"
                    style={{ width: `${activeEnrollment.progressPercentage}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="shrink-0">
              <Link
                href={
                  activeEnrollment.lastLessonId
                    ? `/learn/${activeEnrollment.lastLessonId}`
                    : `/courses/${activeEnrollment.course._id}`
                }
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-lg shadow-indigo-500/25 transition-all hover:bg-primary/90 hover:scale-[1.02]"
              >
                <PlayCircle className="size-4" />
                <span>Continue Learning</span>
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      {/* Enrolled Courses Section */}
      <section className="rounded-2xl border border-border/80 bg-card p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-foreground sm:text-xl">
              Enrolled Courses
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {enrollments.length} {enrollments.length === 1 ? "active course" : "active courses"} in your curriculum
            </p>
          </div>

          <Link
            href="/courses"
            className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
          >
            <span>Explore all courses</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        {enrollments.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {enrollments.map((item) => (
              <div
                key={item._id}
                className="group relative flex flex-col justify-between rounded-xl border border-border/80 bg-secondary/30 p-5 transition-all duration-200 hover:border-primary/40 hover:bg-secondary/50"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                    <span className="rounded-md bg-secondary px-2 py-0.5 text-[11px] font-medium text-secondary-foreground">
                      {item.course?.category || "General"}
                    </span>
                    <span className="font-semibold text-primary text-xs">
                      {item.progressPercentage}%
                    </span>
                  </div>

                  <h3 className="font-semibold text-base text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                    {item.course?.title}
                  </h3>

                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {item.course?.description}
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-border/50 pt-3 text-xs">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Layers className="size-3.5" />
                    <span>
                      {item.completedLessonsCount || 0}/{item.totalLessonsCount || 0} lessons
                    </span>
                  </div>

                  <Link
                    href={
                      item.lastLessonId
                        ? `/learn/${item.lastLessonId}`
                        : `/courses/${item.courseId}`
                    }
                    className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
                  >
                    <span>Resume</span>
                    <ArrowRight className="size-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={BookOpen}
            title="No enrolled courses yet"
            description="Browse our course catalog to find topics in full-stack engineering, AI, and systems."
            action={
              <Link
                href="/courses"
                className="inline-flex h-9 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
              >
                <span>Browse Course Catalog</span>
                <ArrowRight className="size-3.5" />
              </Link>
            }
          />
        )}
      </section>
    </div>
  );
}