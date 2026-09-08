"use client";

import { useRouter } from "next/navigation";
import {
  Users,
  BookOpen,
  Sparkles,
  Search,
  Calendar,
  GraduationCap,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Zap,
} from "lucide-react";
import type { AdminOverviewAnalytics, AnalyticsPeriod } from "@/types/analytics";
import { AnalyticsStatCard } from "./analytics-stat-card";
import { AnalyticsChart } from "./analytics-chart";
import { PopularCourses } from "./popular-courses";
import { PopularSearches } from "./popular-searches";
import { SystemHealth } from "./system-health";

interface AdminAnalyticsViewProps {
  analytics: AdminOverviewAnalytics;
}

export function AdminAnalyticsView({ analytics }: AdminAnalyticsViewProps) {
  const router = useRouter();

  const handleRangeChange = (range: AnalyticsPeriod) => {
    router.push(`/admin/analytics?range=${range}`);
  };

  const { users, learning, search, ai, documents, systemHealth, range } = analytics;

  return (
    <div className="space-y-8">
      {/* Header & Date Range Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Zap className="w-3.5 h-3.5" />
            Platform Telemetry & Performance
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Admin Analytics Dashboard
          </h1>
          <p className="text-sm text-zinc-400 mt-1 max-w-xl">
            Real-time analytics on user acquisition, course completions, semantic search patterns, and AI resource consumption.
          </p>
        </div>

        {/* Date Range Selector Pills */}
        <div className="flex items-center gap-2 bg-zinc-900/90 border border-zinc-800 p-1.5 rounded-2xl shrink-0 shadow-sm">
          <Calendar className="w-3.5 h-3.5 text-zinc-500 ml-2" />
          <span className="text-xs text-zinc-400 font-medium mr-1">Range:</span>
          {(["7d", "30d", "90d", "all"] as AnalyticsPeriod[]).map((r) => {
            const labels: Record<AnalyticsPeriod, string> = {
              "7d": "7 Days",
              "30d": "30 Days",
              "90d": "90 Days",
              all: "All Time",
            };

            const isSelected = range === r;

            return (
              <button
                key={r}
                type="button"
                onClick={() => handleRangeChange(r)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                  isSelected
                    ? "bg-amber-600 text-white shadow"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
                }`}
              >
                {labels[r]}
              </button>
            );
          })}
        </div>
      </div>

      {/* System Infrastructure Health */}
      <SystemHealth health={systemHealth} />

      {/* Summary KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <AnalyticsStatCard
          title="Total Users"
          value={users.totalUsers}
          icon={Users}
          description={`+${users.newUsers} registered in range`}
          badge={{ label: `${users.activeUsers} active`, variant: "info" }}
          iconColor="text-amber-400"
        />

        <AnalyticsStatCard
          title="Courses"
          value={learning.totalCourses}
          icon={BookOpen}
          description={`${learning.newCourses} added in range`}
          badge={{ label: "Curriculum", variant: "neutral" }}
          iconColor="text-indigo-400"
        />

        <AnalyticsStatCard
          title="Enrollments"
          value={learning.totalEnrollments}
          icon={GraduationCap}
          description={`${learning.completionRate}% completion rate`}
          badge={{ label: `${learning.completedCourses} finished`, variant: "success" }}
          iconColor="text-emerald-400"
        />

        <AnalyticsStatCard
          title="Searches"
          value={search.totalSearches}
          icon={Search}
          description={`${search.searchesInRange} queries in range`}
          badge={{ label: `${search.successfulSearches} hits`, variant: "success" }}
          iconColor="text-cyan-400"
        />

        <AnalyticsStatCard
          title="AI Requests"
          value={ai.totalRequests}
          icon={Sparkles}
          description={`~${ai.totalTokens.toLocaleString()} tokens`}
          badge={{ label: `${ai.overallSuccessRate}% success`, variant: "info" }}
          iconColor="text-purple-400"
        />

        <AnalyticsStatCard
          title="Documents"
          value={documents.totalDocuments}
          icon={FileText}
          description={`${documents.totalIndexedChunks} chunks indexed`}
          badge={{
            label: documents.failedDocuments > 0 ? `${documents.failedDocuments} failed` : "All healthy",
            variant: documents.failedDocuments > 0 ? "warning" : "success",
          }}
          iconColor="text-rose-400"
        />
      </div>

      {/* 4 Interactive Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 backdrop-blur space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-amber-400" />
              <h3 className="text-sm font-semibold text-white">User Acquisition & Growth</h3>
            </div>
            <span className="text-xs text-zinc-500">{users.newUsers} new accounts</span>
          </div>
          <AnalyticsChart
            data={users.growthTrend}
            dataKey="count"
            name="New Users"
            type="area"
            color="#f59e0b"
            height={220}
          />
        </div>

        {/* Search Activity Chart */}
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 backdrop-blur space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-cyan-400" />
              <h3 className="text-sm font-semibold text-white">Search Activity Trends</h3>
            </div>
            <span className="text-xs text-zinc-500">{search.searchesInRange} searches</span>
          </div>
          <AnalyticsChart
            data={search.searchTrend}
            dataKey="count"
            name="Queries"
            type="bar"
            color="#06b6d4"
            height={220}
          />
        </div>

        {/* Learning Activity Chart */}
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 backdrop-blur space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-emerald-400" />
              <h3 className="text-sm font-semibold text-white">Enrollments & Completions</h3>
            </div>
            <span className="text-xs text-zinc-500">{learning.newEnrollments} new enrollments</span>
          </div>
          <AnalyticsChart
            data={learning.activityTrend}
            dataKey="enrollments"
            dataKey2="completions"
            name="Enrollments"
            name2="Completions"
            type="bar"
            color="#10b981"
            color2="#6366f1"
            height={220}
          />
        </div>

        {/* AI Usage & Telemetry Chart */}
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 backdrop-blur space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-400" />
              <h3 className="text-sm font-semibold text-white">AI Requests Telemetry</h3>
            </div>
            <span className="text-xs text-zinc-500">${ai.estimatedCostUsd} est. cost</span>
          </div>
          <AnalyticsChart
            data={ai.aiTrend}
            dataKey="requests"
            name="AI Requests"
            type="area"
            color="#a855f7"
            height={220}
          />
        </div>
      </div>

      {/* Popular Content & Searches Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PopularCourses courses={learning.mostPopularCourses} />
        <PopularSearches search={search} />
      </div>

      {/* AI Feature Breakdown & Document Pipeline Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Feature Breakdown */}
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 backdrop-blur space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-400" />
              <h3 className="text-sm font-semibold text-white">AI Feature Breakdown</h3>
            </div>
            <span className="text-xs font-semibold text-emerald-400">
              {ai.overallSuccessRate}% Overall Success
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-zinc-950/60 border border-zinc-800/80 rounded-xl">
              <span className="text-zinc-500">Tokens Consumed</span>
              <p className="text-lg font-bold text-white mt-0.5">
                {ai.totalTokens.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-zinc-950/60 border border-zinc-800/80 rounded-xl">
              <span className="text-zinc-500">Avg Tokens / Request</span>
              <p className="text-lg font-bold text-white mt-0.5">
                {ai.avgTokensPerRequest.toLocaleString()}
              </p>
            </div>
          </div>

          {ai.byFeature.length === 0 ? (
            <div className="py-6 text-center rounded-xl border border-dashed border-zinc-800/80">
              <p className="text-xs text-zinc-500">No AI requests logged in this period.</p>
            </div>
          ) : (
            <div className="divide-y divide-zinc-800/60 text-xs">
              {ai.byFeature.map((f) => (
                <div key={f.feature} className="py-2.5 flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-zinc-200 capitalize">
                      {f.feature.replace(/_/g, " ")}
                    </p>
                    <p className="text-[11px] text-zinc-500">
                      {f.count} calls • avg {f.avgDurationMs}ms
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-medium text-zinc-300">
                      {f.totalTokens.toLocaleString()} tokens
                    </span>
                    <p className="text-[10px] text-emerald-400">
                      {f.successRate}% success
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Document Processing Pipeline & Demographics */}
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 backdrop-blur space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-rose-400" />
              <h3 className="text-sm font-semibold text-white">Document Pipeline & Indexing</h3>
            </div>
            <span className="text-xs text-zinc-500">{documents.totalDocuments} total files</span>
          </div>

          <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
            <div className="p-3 bg-zinc-950/60 border border-zinc-800/80 rounded-xl">
              <span className="text-[11px] text-zinc-500">Completed</span>
              <p className="text-base font-bold text-emerald-400 mt-1 flex items-center justify-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" />
                {documents.completedDocuments}
              </p>
            </div>
            <div className="p-3 bg-zinc-950/60 border border-zinc-800/80 rounded-xl">
              <span className="text-[11px] text-zinc-500">Pending</span>
              <p className="text-base font-bold text-amber-400 mt-1">
                {documents.pendingDocuments}
              </p>
            </div>
            <div className="p-3 bg-zinc-950/60 border border-zinc-800/80 rounded-xl">
              <span className="text-[11px] text-zinc-500">Failed</span>
              <p className="text-base font-bold text-rose-400 mt-1 flex items-center justify-center gap-1">
                {documents.failedDocuments > 0 && <AlertTriangle className="h-3.5 w-3.5" />}
                {documents.failedDocuments}
              </p>
            </div>
          </div>

          {/* User Role Distribution Bar */}
          <div className="pt-2 space-y-2 border-t border-zinc-800/60">
            <div className="flex justify-between text-xs text-zinc-400">
              <span className="font-medium">User Role Distribution</span>
              <span className="text-zinc-500">
                {users.byRole.students} Students • {users.byRole.instructors} Instructors • {users.byRole.admins} Admins
              </span>
            </div>
            <div className="h-2.5 w-full bg-zinc-950 rounded-full flex overflow-hidden border border-zinc-800">
              <div
                style={{
                  width: `${users.totalUsers > 0 ? (users.byRole.students / users.totalUsers) * 100 : 100}%`,
                }}
                className="bg-indigo-500 h-full"
                title={`Students: ${users.byRole.students}`}
              />
              <div
                style={{
                  width: `${users.totalUsers > 0 ? (users.byRole.instructors / users.totalUsers) * 100 : 0}%`,
                }}
                className="bg-amber-500 h-full"
                title={`Instructors: ${users.byRole.instructors}`}
              />
              <div
                style={{
                  width: `${users.totalUsers > 0 ? (users.byRole.admins / users.totalUsers) * 100 : 0}%`,
                }}
                className="bg-emerald-500 h-full"
                title={`Admins: ${users.byRole.admins}`}
              />
            </div>
          </div>

          {/* Recently Registered Users */}
          <div className="space-y-2 pt-2 border-t border-zinc-800/60">
            <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">
              Recently Registered Users
            </span>
            {users.recentUsers.length === 0 ? (
              <p className="text-xs text-zinc-500">No registered users found.</p>
            ) : (
              <div className="divide-y divide-zinc-800/50 text-xs">
                {users.recentUsers.map((u) => (
                  <div key={u.id} className="py-2 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-zinc-200">{u.name || "Anonymous User"}</p>
                      <p className="text-[10px] text-zinc-500">{u.email || u.clerkId}</p>
                    </div>
                    <span className="rounded-md bg-zinc-800/80 px-2 py-0.5 text-[10px] font-medium text-zinc-300 uppercase">
                      {u.role}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
