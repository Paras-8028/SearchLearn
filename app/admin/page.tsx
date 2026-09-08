import Link from "next/link";
import {
  Users,
  BookOpen,
  Sparkles,
  Search,
  FileText,
  Layers,
  ShieldCheck,
  BarChart3,
  ArrowRight,
  GraduationCap,
} from "lucide-react";
import { getAdminPlatformStats } from "@/lib/db/repositories/courses";

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const stats = await getAdminPlatformStats();

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
              Admin Overview
            </h1>
            <p className="text-sm text-zinc-400 mt-1 max-w-2xl">
              Global operations dashboard for SearchLearn. Monitor user accounts, manage course content platform-wide, and track AI intelligence usage.
            </p>
          </div>
        </div>

        {/* Platform KPI Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Users Card */}
          <div className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800/80 space-y-2">
            <div className="flex items-center justify-between text-zinc-400 text-xs font-medium">
              <span>Total Registered Users</span>
              <Users className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-3xl font-extrabold text-white">{stats.users.total}</p>
            <div className="text-[11px] text-zinc-500 flex items-center gap-2">
              <span className="text-zinc-300">{stats.users.students} students</span>
              <span>•</span>
              <span className="text-indigo-400">{stats.users.instructors} instructors</span>
              <span>•</span>
              <span className="text-amber-400">{stats.users.admins} admins</span>
            </div>
          </div>

          {/* Courses Card */}
          <div className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800/80 space-y-2">
            <div className="flex items-center justify-between text-zinc-400 text-xs font-medium">
              <span>Platform Courses</span>
              <BookOpen className="w-4 h-4 text-indigo-400" />
            </div>
            <p className="text-3xl font-extrabold text-white">{stats.courses.total}</p>
            <div className="text-[11px] text-zinc-500 flex items-center gap-2">
              <span className="text-emerald-400">{stats.courses.published} live</span>
              <span>•</span>
              <span className="text-amber-400">{stats.courses.draft} in draft</span>
            </div>
          </div>

          {/* AI Intelligence Card */}
          <div className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800/80 space-y-2">
            <div className="flex items-center justify-between text-zinc-400 text-xs font-medium">
              <span>AI Requests Processed</span>
              <Sparkles className="w-4 h-4 text-indigo-400" />
            </div>
            <p className="text-3xl font-extrabold text-white">{stats.aiRequests.total}</p>
            <p className="text-[11px] text-zinc-500">
              {stats.aiRequests.totalTokens.toLocaleString()} tokens consumed
            </p>
          </div>

          {/* Search Queries Card */}
          <div className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800/80 space-y-2">
            <div className="flex items-center justify-between text-zinc-400 text-xs font-medium">
              <span>Searches Executed</span>
              <Search className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-3xl font-extrabold text-white">{stats.searches.total}</p>
            <p className="text-[11px] text-zinc-500">
              {stats.documents.total} documents indexed
            </p>
          </div>
        </div>

        {/* Content Inventory Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-850 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-950/60 border border-indigo-800/40 flex items-center justify-center text-indigo-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-zinc-500 font-medium">Total Curriculum Modules</p>
              <p className="text-xl font-bold text-white">{stats.modules.total}</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-850 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-950/60 border border-blue-800/40 flex items-center justify-center text-blue-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-zinc-500 font-medium">Total Lessons Authored</p>
              <p className="text-xl font-bold text-white">{stats.lessons.total}</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-850 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-950/60 border border-emerald-800/40 flex items-center justify-center text-emerald-400">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-zinc-500 font-medium">Total Course Enrollments</p>
              <p className="text-xl font-bold text-white">{stats.enrollments.total}</p>
            </div>
          </div>
        </div>

        {/* Quick Management Hub */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white">Administrative Actions</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href="/admin/users"
              className="group p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-amber-500/50 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-zinc-100 group-hover:text-amber-300 transition-colors">
                  User & Role Management
                </h3>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Inspect student, instructor, and admin accounts. Update user permissions and promote instructors.
                </p>
              </div>

              <div className="pt-6 flex items-center gap-1.5 text-xs font-semibold text-amber-400 group-hover:text-amber-300">
                <span>Manage Users</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              href="/admin/courses"
              className="group p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-indigo-500/50 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-zinc-100 group-hover:text-indigo-300 transition-colors">
                  Global Course Directory
                </h3>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Browse, review, and edit courses authored across all instructors on the platform.
                </p>
              </div>

              <div className="pt-6 flex items-center gap-1.5 text-xs font-semibold text-indigo-400 group-hover:text-indigo-300">
                <span>Browse All Courses</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              href="/admin/analytics"
              className="group p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-emerald-500/50 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-zinc-100 group-hover:text-emerald-300 transition-colors">
                  Platform Analytics
                </h3>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Analyze AI tokens consumed, grounded feature distributions, and user engagement metrics.
                </p>
              </div>

              <div className="pt-6 flex items-center gap-1.5 text-xs font-semibold text-emerald-400 group-hover:text-emerald-300">
                <span>View Analytics</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
