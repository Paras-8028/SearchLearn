import Link from "next/link";
import {
  Users,
  BookOpen,
  Sparkles,
  Search,
  FileText,
  Layers,
  ShieldCheck,
  ArrowRight,
  Database,
  Activity,
  User as UserIcon,
  GraduationCap,
} from "lucide-react";
import { getAdminDashboardSummary } from "@/lib/db/repositories/admin";
import { AdminStatCard } from "@/components/admin/admin-stat-card";
import { ActivityFeed } from "@/components/analytics/activity-feed";

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const summary = await getAdminDashboardSummary();

  return (
    <main className="p-6 md:p-10">
      <div className="mx-auto max-w-7xl space-y-10">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-800/80 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Platform Administration
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Admin Dashboard
            </h1>
            <p className="text-sm text-zinc-400 mt-1 max-w-2xl">
              Centralized platform operations for SmartLearn. Monitor user accounts, manage curriculum, audit uploaded documents, manage vector search indexes, and track AI telemetry.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/activity"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-200 text-xs font-semibold shadow-sm transition-colors"
            >
              <Activity className="w-3.5 h-3.5 text-amber-400" />
              <span>Activity Logs</span>
            </Link>
            <Link
              href="/admin/search-index"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-sm transition-colors"
            >
              <Database className="w-3.5 h-3.5" />
              <span>Search Index</span>
            </Link>
          </div>
        </div>

        {/* Section 9: Complete 8 KPI Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <AdminStatCard
            title="Total Users"
            value={summary.users.total}
            icon={Users}
            description={`${summary.users.students} students • ${summary.users.instructors} instructors • ${summary.users.admins} admins`}
            badge={{ label: `${summary.users.students} active`, variant: "info" }}
            href="/admin/users"
          />

          <AdminStatCard
            title="Total Courses"
            value={summary.courses.total}
            icon={BookOpen}
            description={`${summary.courses.published} published • ${summary.courses.draft} drafts`}
            badge={{
              label: `${summary.courses.published} live`,
              variant: summary.courses.published > 0 ? "success" : "neutral",
            }}
            href="/admin/courses"
          />

          <AdminStatCard
            title="Total Modules"
            value={summary.content.totalModules}
            icon={Layers}
            description="Organized curriculum course modules"
            badge={{ label: `${summary.content.totalModules} modules`, variant: "neutral" }}
            href="/admin/courses"
          />

          <AdminStatCard
            title="Total Lessons"
            value={summary.content.totalLessons}
            icon={BookOpen}
            description="Interactive lessons published across catalog"
            badge={{ label: `${summary.content.totalLessons} lessons`, variant: "neutral" }}
            href="/admin/courses"
          />

          <AdminStatCard
            title="Total Enrollments"
            value={summary.enrollments?.total ?? 0}
            icon={GraduationCap}
            description={`${summary.enrollments?.completed ?? 0} completed course journeys`}
            badge={{ label: "Learners", variant: "success" }}
            href="/admin/analytics"
          />

          <AdminStatCard
            title="Total Searches"
            value={summary.search.totalQueries}
            icon={Search}
            description="Total natural language & hybrid searches"
            badge={{ label: "Search Intel", variant: "info" }}
            href="/admin/search-analytics"
          />

          <AdminStatCard
            title="Total AI Requests"
            value={summary.ai.totalRequests}
            icon={Sparkles}
            description={`${summary.ai.totalTokens.toLocaleString()} tokens consumed`}
            badge={{ label: `${(summary.ai.totalTokens / 1000).toFixed(1)}k tokens`, variant: "success" }}
            href="/admin/ai-analytics"
          />

          <AdminStatCard
            title="Total Documents"
            value={summary.documents.total}
            icon={FileText}
            description={`${summary.documents.completed} processed • ${summary.documents.failed} failed`}
            badge={{
              label: summary.documents.failed > 0 ? `${summary.documents.failed} failed` : "All healthy",
              variant: summary.documents.failed > 0 ? "warning" : "success",
            }}
            href="/admin/documents"
          />
        </div>

        {/* Recent Activity & Recent Users Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Cols: Activity Feed & Recent Courses */}
          <div className="lg:col-span-2 space-y-8">
            {/* Activity Feed */}
            <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-amber-400" />
                  <h2 className="text-base font-semibold text-white">Recent Platform Activity</h2>
                </div>
                <Link
                  href="/admin/activity"
                  className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1 transition-colors"
                >
                  View all logs
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <ActivityFeed activities={summary.recentActivities} emptyMessage="No recent platform activity logged yet." />
            </div>

            {/* Recent Courses */}
            <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-400" />
                  <h2 className="text-base font-semibold text-white">Recently Added Courses</h2>
                </div>
                <Link
                  href="/admin/courses"
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
                >
                  View all ({summary.courses.total})
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="divide-y divide-zinc-800/60">
                {summary.recentCourses.map((c) => (
                  <div key={c._id} className="py-3 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <Link
                        href={`/courses/${c._id}`}
                        className="text-xs font-semibold text-zinc-200 hover:text-indigo-400 truncate block"
                      >
                        {c.title}
                      </Link>
                      <p className="text-[11px] text-zinc-500 truncate">
                        {c.category || "Uncategorized"} • Level: {c.level}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                          c.published
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-zinc-800 text-zinc-400 border-zinc-700"
                        }`}
                      >
                        {c.published ? "Published" : "Draft"}
                      </span>
                      <Link
                        href={`/instructor/courses/${c._id}`}
                        className="text-[11px] text-zinc-400 hover:text-white px-2 py-1 rounded bg-zinc-800/60 hover:bg-zinc-800 transition-colors"
                      >
                        Manage
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Col: Recent Users & Recent Documents */}
          <div className="space-y-8">
            {/* Recent Users */}
            <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-amber-400" />
                  <h2 className="text-base font-semibold text-white">Recent Users</h2>
                </div>
                <Link
                  href="/admin/users"
                  className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1"
                >
                  Directory
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="divide-y divide-zinc-800/60">
                {summary.recentUsers.map((u) => (
                  <div key={u._id} className="py-2.5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="h-7 w-7 rounded-full bg-zinc-800 border border-zinc-700/60 flex items-center justify-center text-zinc-400 text-xs shrink-0">
                        <UserIcon className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <Link
                          href={`/admin/users/${u._id}`}
                          className="text-xs font-medium text-zinc-200 hover:text-amber-400 truncate block"
                        >
                          {u.firstName || u.lastName ? `${u.firstName || ""} ${u.lastName || ""}`.trim() : "Unnamed User"}
                        </Link>
                        <p className="text-[10px] text-zinc-500 truncate">{u.email}</p>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border shrink-0 ${
                        u.role === "admin"
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                          : u.role === "instructor"
                          ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/30"
                          : "bg-zinc-800/80 text-zinc-400 border-zinc-700/60"
                      }`}
                    >
                      {u.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Documents */}
            <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <h2 className="text-base font-semibold text-white">Recent Documents</h2>
                </div>
                <Link
                  href="/admin/documents"
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
                >
                  All ({summary.documents.total})
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              {summary.recentDocuments.length === 0 ? (
                <p className="text-xs text-zinc-500 py-2">No documents uploaded yet.</p>
              ) : (
                <div className="divide-y divide-zinc-800/60">
                  {summary.recentDocuments.map((doc) => (
                    <div key={doc._id} className="py-2.5 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-zinc-200 truncate">{doc.title}</p>
                        <p className="text-[10px] text-zinc-500 uppercase">{doc.fileType} • {(doc.fileSize / 1024).toFixed(1)} KB</p>
                      </div>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border shrink-0 ${
                          doc.processingStatus === "completed"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : doc.processingStatus === "failed"
                            ? "bg-red-500/10 text-red-400 border-red-500/20"
                            : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        }`}
                      >
                        {doc.processingStatus}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent AI Telemetry */}
            <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <h2 className="text-base font-semibold text-white">Recent AI Telemetry</h2>
                </div>
                <Link
                  href="/admin/analytics"
                  className="text-xs text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1"
                >
                  Analytics
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              {summary.recentAiRequests.length === 0 ? (
                <p className="text-xs text-zinc-500 py-2">No AI logs recorded yet.</p>
              ) : (
                <div className="divide-y divide-zinc-800/60">
                  {summary.recentAiRequests.map((ai) => (
                    <div key={ai._id} className="py-2 flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-zinc-200 truncate">
                          {ai.feature.replace(/_/g, " ")}
                        </p>
                        <p className="text-[10px] text-zinc-500">
                          {ai.totalTokens ? `${ai.totalTokens} tokens` : "N/A"} • {ai.durationMs ? `${ai.durationMs}ms` : ""}
                        </p>
                      </div>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded border shrink-0 ${
                          ai.success
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-red-500/10 text-red-400 border-red-500/20"
                        }`}
                      >
                        {ai.success ? "Success" : "Failed"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
