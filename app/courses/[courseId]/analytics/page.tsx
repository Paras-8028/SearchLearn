import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  Users,
  GraduationCap,
  Award,
  BookOpen,
  ArrowLeft,
  Calendar,
  Layers,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { getCurrentSearchLearnUser } from "@/lib/auth/current-user";
import { canManageCourse } from "@/lib/auth/require-user";
import { getCourseAnalytics } from "@/lib/db/repositories/analytics";
import { StatCard } from "@/components/analytics/stat-card";

export const revalidate = 0;

interface CourseAnalyticsPageProps {
  params: Promise<{
    courseId: string;
  }>;
}

export default async function CourseAnalyticsPage({ params }: CourseAnalyticsPageProps) {
  const { courseId } = await params;
  const user = await getCurrentSearchLearnUser();

  if (!user) {
    redirect(`/sign-in?redirect_url=/courses/${courseId}/analytics`);
  }

  const allowed = await canManageCourse(courseId, user);
  if (!allowed) {
    redirect("/forbidden");
  }

  const analytics = await getCourseAnalytics(courseId);
  if (!analytics) {
    notFound();
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-background p-6 md:p-10">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <Link
            href={`/courses/${analytics.slug || analytics.courseId}`}
            className="hover:text-white transition-colors flex items-center gap-1"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Course
          </Link>
          <ChevronRight className="h-3 w-3 text-zinc-600" />
          <span className="text-zinc-200 font-medium">Course Intelligence</span>
        </div>

        {/* Course Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-800/80 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-1">
              <TrendingUp className="h-3.5 w-3.5" />
              Course Telemetry
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              {analytics.title}
            </h1>
            <p className="text-sm text-zinc-400 mt-1">
              Detailed learner engagement, syllabus completion metrics, and student enrollments.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href={`/instructor/courses/${analytics.courseId}`}
              className="px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs font-semibold text-zinc-200 transition-colors"
            >
              Edit Course
            </Link>
          </div>
        </div>

        {/* 5 KPI Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard
            title="Total Enrollments"
            value={analytics.totalEnrollments}
            icon={GraduationCap}
            description="Lifetime student enrollments"
            iconClassName="text-indigo-400 bg-indigo-500/10"
          />

          <StatCard
            title="Active Learners"
            value={analytics.activeLearners}
            icon={Users}
            description="Active in last 30 days"
            iconClassName="text-emerald-400 bg-emerald-500/10"
          />

          <StatCard
            title="Completion Rate"
            value={`${analytics.completionRate}%`}
            icon={Award}
            description="Course journey completions"
            iconClassName="text-amber-400 bg-amber-500/10"
          />

          <StatCard
            title="Average Progress"
            value={`${analytics.averageProgress}%`}
            icon={TrendingUp}
            description="Mean student progress"
            iconClassName="text-cyan-400 bg-cyan-500/10"
          />

          <StatCard
            title="Lessons Completed"
            value={analytics.lessonsCompleted}
            icon={BookOpen}
            description={`Out of ${analytics.totalLessons} total lessons`}
            iconClassName="text-purple-400 bg-purple-500/10"
          />
        </div>

        {/* Progress & Enrolled Students Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Progress Breakdown */}
          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 backdrop-blur space-y-6">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Layers className="h-4 w-4 text-amber-400" />
              Syllabus Completion
            </h3>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-zinc-400">Classroom Average Progress</span>
                  <span className="font-bold text-white">{analytics.averageProgress}%</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-zinc-950 overflow-hidden border border-zinc-800">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-indigo-500 rounded-full"
                    style={{ width: `${analytics.averageProgress}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-zinc-400">Graduation / Completion Rate</span>
                  <span className="font-bold text-emerald-400">{analytics.completionRate}%</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-zinc-950 overflow-hidden border border-zinc-800">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${analytics.completionRate}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/60 space-y-1 text-xs">
              <p className="font-medium text-zinc-300">Catalog Content Summary</p>
              <p className="text-zinc-500 text-[11px]">
                {analytics.totalLessons} total lessons across curriculum modules. Students have recorded {analytics.lessonsCompleted} lesson completions.
              </p>
            </div>
          </div>

          {/* Enrolled Students Table */}
          <div className="lg:col-span-2 rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 backdrop-blur space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Users className="h-4 w-4 text-indigo-400" />
                Recent Enrolled Learners
              </h3>
              <span className="text-xs text-zinc-500">{analytics.totalEnrollments} enrolled</span>
            </div>

            {analytics.recentEnrollments.length === 0 ? (
              <div className="py-10 text-center rounded-xl border border-dashed border-zinc-800">
                <p className="text-xs text-zinc-500">No students currently enrolled in this course.</p>
              </div>
            ) : (
              <div className="divide-y divide-zinc-800/60">
                {analytics.recentEnrollments.map((student) => (
                  <div
                    key={student.userId}
                    className="py-3 flex items-center justify-between gap-4 text-xs"
                  >
                    <div>
                      <p className="font-semibold text-zinc-200">
                        {student.name || `Learner ${student.userId.slice(-6)}`}
                      </p>
                      <p className="text-[11px] text-zinc-500 flex items-center gap-1.5 mt-0.5">
                        <Calendar className="h-3 w-3" />
                        Enrolled {new Date(student.enrolledAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-24 text-right">
                        <div className="flex items-center justify-end gap-1 text-[11px] font-medium text-zinc-300">
                          <span>{student.progress}%</span>
                          {student.completed && (
                            <Award className="h-3 w-3 text-emerald-400" />
                          )}
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-zinc-950 overflow-hidden mt-1">
                          <div
                            className={`h-full rounded-full ${
                              student.completed ? "bg-emerald-500" : "bg-indigo-500"
                            }`}
                            style={{ width: `${student.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
