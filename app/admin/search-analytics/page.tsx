import {
  Search,
  TrendingUp,
  AlertCircle,
  MousePointerClick,
  Calendar,
  Layers,
} from "lucide-react";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getAdvancedSearchStats } from "@/lib/db/repositories/analytics";
import { StatCard } from "@/components/analytics/stat-card";
import { EmptyState } from "@/components/analytics/empty-state";

export const revalidate = 0;

export default async function SearchAnalyticsPage() {
  await requireAdmin();

  const stats = await getAdvancedSearchStats();

  const searchModes = [
    { label: "Hybrid Search (Vector + Text)", count: stats.searchTypeBreakdown.hybrid, color: "bg-indigo-500" },
    { label: "Pure Semantic Search", count: stats.searchTypeBreakdown.semantic, color: "bg-cyan-500" },
    { label: "Keyword / Exact Match", count: stats.searchTypeBreakdown.keyword, color: "bg-amber-500" },
    { label: "AI Answer Generation", count: stats.searchTypeBreakdown.aiAnswer, color: "bg-purple-500" },
  ];

  const totalModes =
    stats.searchTypeBreakdown.hybrid +
    stats.searchTypeBreakdown.semantic +
    stats.searchTypeBreakdown.keyword +
    stats.searchTypeBreakdown.aiAnswer || 1;

  return (
    <main className="p-6 md:p-10">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="border-b border-zinc-800/80 pb-6">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-1">
            <Search className="h-3.5 w-3.5" />
            Search Intelligence & Discovery
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Search Analytics
          </h1>
          <p className="text-sm text-zinc-400 mt-1 max-w-2xl">
            Audit natural language query volumes, monitor zero-result searches, evaluate click-through rates (CTR), and analyze student information seeking behavior.
          </p>
        </div>

        {/* 6 Metric KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <StatCard
            title="Total Searches"
            value={stats.totalSearches}
            icon={Search}
            description="Lifetime search requests"
            iconClassName="text-cyan-400 bg-cyan-500/10"
          />

          <StatCard
            title="Searches Today"
            value={stats.searchesToday}
            icon={Calendar}
            description="Recorded since midnight"
            iconClassName="text-emerald-400 bg-emerald-500/10"
          />

          <StatCard
            title="This Week"
            value={stats.searchesThisWeek}
            icon={TrendingUp}
            description="Last 7 calendar days"
            iconClassName="text-indigo-400 bg-indigo-500/10"
          />

          <StatCard
            title="CTR"
            value={`${stats.clickThroughRate}%`}
            icon={MousePointerClick}
            description={`${stats.totalClicks} result clicks logged`}
            iconClassName="text-purple-400 bg-purple-500/10"
          />

          <StatCard
            title="Zero-Hit Searches"
            value={stats.noResultSearches}
            icon={AlertCircle}
            description="Queries returning 0 items"
            iconClassName="text-rose-400 bg-rose-500/10"
          />

          <StatCard
            title="Avg Results / Query"
            value={stats.avgResultsPerSearch}
            icon={Layers}
            description="Mean result count"
            iconClassName="text-amber-400 bg-amber-500/10"
          />
        </div>

        {/* Popular & Failed Searches Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Popular Searches */}
          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 backdrop-blur space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-400" />
                <h2 className="text-base font-semibold text-white">Top Search Queries</h2>
              </div>
              <span className="text-xs text-zinc-500">Ranked by volume</span>
            </div>

            {stats.popularQueries.length === 0 ? (
              <EmptyState
                icon={Search}
                title="No queries logged yet"
                description="Queries will be grouped automatically as users search."
              />
            ) : (
              <div className="space-y-2">
                {stats.popularQueries.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-xl bg-zinc-950/60 border border-zinc-800/60 px-4 py-2.5 text-xs transition-colors hover:border-zinc-700/80"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-[10px] font-bold text-zinc-400">
                        {idx + 1}
                      </span>
                      <span className="font-medium text-zinc-200 truncate capitalize">
                        &ldquo;{item.query}&rdquo;
                      </span>
                    </div>
                    <span className="font-semibold text-emerald-400 shrink-0 ml-2">
                      {item.count} {item.count === 1 ? "query" : "queries"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Failed Searches (0 Results) */}
          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 backdrop-blur space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-rose-400" />
                <h2 className="text-base font-semibold text-white">Zero-Result Searches</h2>
              </div>
              <span className="text-xs text-zinc-500">Curriculum gaps</span>
            </div>

            <p className="text-xs text-zinc-400">
              These searches returned zero results. Use this signal to create lessons or upload reference documents addressing missing concepts.
            </p>

            {stats.failedSearches.length === 0 ? (
              <EmptyState
                icon={AlertCircle}
                title="No failed searches"
                description="All recent searches yielded relevant curriculum matches."
              />
            ) : (
              <div className="space-y-2">
                {stats.failedSearches.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-xl bg-zinc-950/60 border border-rose-950/40 px-4 py-2.5 text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="h-2 w-2 rounded-full bg-rose-500 shrink-0" />
                      <span className="font-medium text-zinc-300 truncate">
                        &ldquo;{item.query}&rdquo;
                      </span>
                    </div>
                    <span className="text-[11px] text-zinc-500 shrink-0">
                      {item.count} attempts
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Search Mode Breakdown & CTR Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Search Mode Distribution */}
          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 backdrop-blur space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-indigo-400" />
                <h2 className="text-base font-semibold text-white">Search Mode Distribution</h2>
              </div>
              <span className="text-xs text-zinc-500">{stats.totalSearches} total queries</span>
            </div>

            {/* Stacked Percentage Bar */}
            <div className="h-3.5 w-full bg-zinc-950 rounded-full flex overflow-hidden border border-zinc-800">
              {searchModes.map((mode) => {
                const pct = Math.round((mode.count / totalModes) * 100);
                return (
                  <div
                    key={mode.label}
                    style={{ width: `${pct}%` }}
                    className={`${mode.color} h-full transition-all`}
                    title={`${mode.label}: ${pct}%`}
                  />
                );
              })}
            </div>

            {/* Mode Legend */}
            <div className="space-y-2 pt-2">
              {searchModes.map((mode) => {
                const pct = Math.round((mode.count / totalModes) * 100);
                return (
                  <div key={mode.label} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className={`h-2.5 w-2.5 rounded-full ${mode.color}`} />
                      <span className="text-zinc-300">{mode.label}</span>
                    </div>
                    <span className="text-zinc-500 font-medium">
                      {mode.count} ({pct}%)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Search Click-Through Rate Explanation Card */}
          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 backdrop-blur space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MousePointerClick className="h-4 w-4 text-purple-400" />
                <h2 className="text-base font-semibold text-white">Click-Through Telemetry</h2>
              </div>
              <span className="text-xs font-bold text-purple-400">{stats.clickThroughRate}% CTR</span>
            </div>

            <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/60 space-y-2 text-xs">
              <div className="flex justify-between items-center text-zinc-400">
                <span>Result Clicks</span>
                <span className="font-bold text-white">{stats.totalClicks}</span>
              </div>
              <div className="flex justify-between items-center text-zinc-400">
                <span>Searches Executed</span>
                <span className="font-bold text-white">{stats.totalSearches}</span>
              </div>
              <div className="flex justify-between items-center text-zinc-400 border-t border-zinc-800/60 pt-2 font-semibold">
                <span className="text-zinc-300">Click-Through Rate (CTR)</span>
                <span className="text-emerald-400">{stats.clickThroughRate}%</span>
              </div>
            </div>

            <p className="text-xs text-zinc-500">
              A higher Click-Through Rate demonstrates that the vector rankings and relevance labels effectively align with student learning intent.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
