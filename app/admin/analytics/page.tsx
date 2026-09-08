import {
  BarChart3,
  Sparkles,
  Search,
  Users,
  BookOpen,
  CheckCircle2,
  TrendingUp,
  Cpu,
  Clock,
} from "lucide-react";
import { getAdminPlatformStats } from "@/lib/db/repositories/courses";
import { getAiUsageAnalytics } from "@/lib/db/repositories/ai-request-logs";

export const revalidate = 0;

export default async function AdminAnalyticsPage() {
  const [stats, aiAnalytics] = await Promise.all([
    getAdminPlatformStats(),
    getAiUsageAnalytics(),
  ]);

  return (
    <main className="p-6 md:p-10">
      <div className="mx-auto max-w-7xl space-y-10">
        {/* Header */}
        <div className="border-b border-zinc-800/80 pb-6">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <BarChart3 className="w-3.5 h-3.5" />
            System Intelligence Metrics
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Platform Analytics
          </h1>
          <p className="text-sm text-zinc-400 mt-1 max-w-xl">
            Real-time usage telemetry, AI feature breakdown, token consumption, and platform growth metrics.
          </p>
        </div>

        {/* High-Level Overview Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 bg-zinc-900/70 border border-zinc-800/80 rounded-2xl space-y-1.5">
            <div className="flex items-center justify-between text-zinc-400 text-xs font-medium">
              <span>Total AI Tokens</span>
              <Cpu className="w-4 h-4 text-indigo-400" />
            </div>
            <p className="text-3xl font-extrabold text-white">
              {stats.aiRequests.totalTokens.toLocaleString()}
            </p>
            <p className="text-[11px] text-zinc-500">Across all AI completions</p>
          </div>

          <div className="p-5 bg-zinc-900/70 border border-zinc-800/80 rounded-2xl space-y-1.5">
            <div className="flex items-center justify-between text-zinc-400 text-xs font-medium">
              <span>AI Operations</span>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-3xl font-extrabold text-white">
              {stats.aiRequests.total.toLocaleString()}
            </p>
            <p className="text-[11px] text-zinc-500">Q&A, quizzes, explanations</p>
          </div>

          <div className="p-5 bg-zinc-900/70 border border-zinc-800/80 rounded-2xl space-y-1.5">
            <div className="flex items-center justify-between text-zinc-400 text-xs font-medium">
              <span>Search Queries</span>
              <Search className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-3xl font-extrabold text-white">
              {stats.searches.total.toLocaleString()}
            </p>
            <p className="text-[11px] text-zinc-500">Semantic & hybrid searches</p>
          </div>

          <div className="p-5 bg-zinc-900/70 border border-zinc-800/80 rounded-2xl space-y-1.5">
            <div className="flex items-center justify-between text-zinc-400 text-xs font-medium">
              <span>Course Enrollments</span>
              <TrendingUp className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-3xl font-extrabold text-white">
              {stats.enrollments.total.toLocaleString()}
            </p>
            <p className="text-[11px] text-zinc-500">Active student learner paths</p>
          </div>
        </div>

        {/* AI Features Telemetry Breakdown */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">AI Feature Telemetry</h2>
              <p className="text-xs text-zinc-400">
                Performance and token consumption grouped by feature type
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-zinc-300">
                <thead className="bg-zinc-950/80 border-b border-zinc-800 text-[11px] uppercase tracking-wider text-zinc-400 font-semibold">
                  <tr>
                    <th className="py-3.5 px-5">Feature</th>
                    <th className="py-3.5 px-5">Requests</th>
                    <th className="py-3.5 px-5">Tokens Consumed</th>
                    <th className="py-3.5 px-5">Success Rate</th>
                    <th className="py-3.5 px-5">Avg Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {aiAnalytics.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-10 text-center text-zinc-500">
                        No AI telemetry records logged yet. Try asking AI questions or testing in-lesson tools.
                      </td>
                    </tr>
                  ) : (
                    aiAnalytics.map((item) => {
                      const successPct = item.totalRequests > 0
                        ? Math.round((item.successfulRequests / item.totalRequests) * 100)
                        : 100;

                      return (
                        <tr key={item.feature} className="hover:bg-zinc-850/50 transition-colors">
                          <td className="py-4 px-5 font-semibold text-zinc-200">
                            <span className="font-mono text-indigo-300">
                              {item.feature}
                            </span>
                          </td>
                          <td className="py-4 px-5">{item.totalRequests}</td>
                          <td className="py-4 px-5 font-mono text-zinc-300">
                            {item.totalTokens.toLocaleString()}
                          </td>
                          <td className="py-4 px-5">
                            <span
                              className={`inline-flex items-center gap-1 font-semibold ${
                                successPct >= 90
                                  ? "text-emerald-400"
                                  : successPct >= 70
                                  ? "text-amber-400"
                                  : "text-red-400"
                              }`}
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              {successPct}%
                            </span>
                          </td>
                          <td className="py-4 px-5 text-zinc-400">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-zinc-500" />
                              {item.avgDurationMs}ms
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* User & Content Composition */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User Composition */}
          <div className="p-6 bg-zinc-900/70 border border-zinc-800 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-400" />
              User Role Distribution
            </h3>

            <div className="space-y-3 pt-2">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-zinc-400">Students</span>
                  <span className="font-semibold text-zinc-200">
                    {stats.users.students} (
                    {stats.users.total > 0
                      ? Math.round((stats.users.students / stats.users.total) * 100)
                      : 0}
                    %)
                  </span>
                </div>
                <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
                  <div
                    className="h-full bg-zinc-400 rounded-full"
                    style={{
                      width: `${
                        stats.users.total > 0
                          ? (stats.users.students / stats.users.total) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-indigo-400 font-medium">Instructors</span>
                  <span className="font-semibold text-zinc-200">
                    {stats.users.instructors} (
                    {stats.users.total > 0
                      ? Math.round((stats.users.instructors / stats.users.total) * 100)
                      : 0}
                    %)
                  </span>
                </div>
                <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full"
                    style={{
                      width: `${
                        stats.users.total > 0
                          ? (stats.users.instructors / stats.users.total) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-amber-400 font-medium">Administrators</span>
                  <span className="font-semibold text-zinc-200">
                    {stats.users.admins} (
                    {stats.users.total > 0
                      ? Math.round((stats.users.admins / stats.users.total) * 100)
                      : 0}
                    %)
                  </span>
                </div>
                <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{
                      width: `${
                        stats.users.total > 0
                          ? (stats.users.admins / stats.users.total) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Course Status Ratio */}
          <div className="p-6 bg-zinc-900/70 border border-zinc-800 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              Course Publication Health
            </h3>

            <div className="space-y-3 pt-2">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-emerald-400 font-medium">Published & Live</span>
                  <span className="font-semibold text-zinc-200">
                    {stats.courses.published} (
                    {stats.courses.total > 0
                      ? Math.round((stats.courses.published / stats.courses.total) * 100)
                      : 0}
                    %)
                  </span>
                </div>
                <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{
                      width: `${
                        stats.courses.total > 0
                          ? (stats.courses.published / stats.courses.total) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-amber-400 font-medium">Draft & In-Progress</span>
                  <span className="font-semibold text-zinc-200">
                    {stats.courses.draft} (
                    {stats.courses.total > 0
                      ? Math.round((stats.courses.draft / stats.courses.total) * 100)
                      : 0}
                    %)
                  </span>
                </div>
                <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{
                      width: `${
                        stats.courses.total > 0
                          ? (stats.courses.draft / stats.courses.total) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
