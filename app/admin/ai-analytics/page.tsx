import {
  Sparkles,
  Calendar,
  DollarSign,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Layers,
  Cpu,
} from "lucide-react";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getAdvancedAIStats } from "@/lib/db/repositories/analytics";
import { StatCard } from "@/components/analytics/stat-card";
import { EmptyState } from "@/components/analytics/empty-state";

export const revalidate = 0;

export default async function AIAnalyticsPage() {
  await requireAdmin();

  const stats = await getAdvancedAIStats();

  const failureRate = 100 - stats.successRate;

  return (
    <main className="p-6 md:p-10">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="border-b border-zinc-800/80 pb-6">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-400 mb-1">
            <Sparkles className="h-3.5 w-3.5" />
            AI Operations & Cost Telemetry
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            AI Analytics & Cost Intelligence
          </h1>
          <p className="text-sm text-zinc-400 mt-1 max-w-2xl">
            Monitor real-time token consumption across tutor interactions, semantic chunk embeddings, and summarize API costs by feature.
          </p>
        </div>

        {/* 6 Metric KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <StatCard
            title="Total AI Requests"
            value={stats.totalRequests}
            icon={Sparkles}
            description="Lifetime invocations"
            iconClassName="text-purple-400 bg-purple-500/10"
          />

          <StatCard
            title="Requests Today"
            value={stats.requestsToday}
            icon={Calendar}
            description="Since midnight"
            iconClassName="text-indigo-400 bg-indigo-500/10"
          />

          <StatCard
            title="Total Tokens"
            value={stats.totalTokens}
            icon={Cpu}
            description={`${stats.inputTokens.toLocaleString()} in • ${stats.outputTokens.toLocaleString()} out`}
            iconClassName="text-cyan-400 bg-cyan-500/10"
          />

          <StatCard
            title="Estimated Cost"
            value={`$${stats.estimatedCostUsd}`}
            icon={DollarSign}
            description="Blended API cost (Est.)"
            badge="Est. Pricing"
            iconClassName="text-emerald-400 bg-emerald-500/10"
          />

          <StatCard
            title="Success Rate"
            value={`${stats.successRate}%`}
            icon={CheckCircle2}
            description={`${stats.failedRequests} total failures`}
            iconClassName="text-emerald-400 bg-emerald-500/10"
          />

          <StatCard
            title="Avg Latency"
            value={`${stats.avgResponseTimeMs}ms`}
            icon={Clock}
            description="Mean duration per call"
            iconClassName="text-amber-400 bg-amber-500/10"
          />
        </div>

        {/* Request Types & Token Usage Breakdown Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* AI Features & Types Breakdown */}
          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 backdrop-blur space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-purple-400" />
                <h2 className="text-base font-semibold text-white">Feature Invocations</h2>
              </div>
              <span className="text-xs text-zinc-500">Categorized requests</span>
            </div>

            {stats.byFeature.length === 0 ? (
              <EmptyState
                icon={Sparkles}
                title="No AI requests logged"
                description="Feature requests will populate here as users invoke AI tutors."
              />
            ) : (
              <div className="divide-y divide-zinc-800/60 text-xs">
                {stats.byFeature.map((f) => (
                  <div key={f.feature} className="py-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-zinc-200 capitalize">
                        {f.feature.replace(/_/g, " ")}
                      </p>
                      <p className="text-[11px] text-zinc-500">
                        {f.count} calls • avg {f.avgDurationMs}ms
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-medium text-zinc-300">
                        {f.totalTokens.toLocaleString()} tokens
                      </p>
                      <span className="text-[10px] text-emerald-400">
                        {f.successRate}% success
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Token Usage & Cost Card */}
          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 backdrop-blur space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-emerald-400" />
                <h2 className="text-base font-semibold text-white">Token Accounting & Pricing</h2>
              </div>
              <span className="text-xs text-zinc-400 font-mono font-semibold">
                gpt-4o-mini
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/60">
                <span className="text-zinc-500">Input / Prompt Tokens</span>
                <p className="text-xl font-bold text-white mt-1">
                  {stats.inputTokens.toLocaleString()}
                </p>
                <span className="text-[10px] text-zinc-500">$0.150 / 1M tokens</span>
              </div>

              <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/60">
                <span className="text-zinc-500">Output / Completion Tokens</span>
                <p className="text-xl font-bold text-white mt-1">
                  {stats.outputTokens.toLocaleString()}
                </p>
                <span className="text-[10px] text-zinc-500">$0.600 / 1M tokens</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/60 flex items-center justify-between">
              <div>
                <span className="text-xs text-zinc-400">Total Calculated Cost (USD)</span>
                <p className="text-2xl font-extrabold text-emerald-400">
                  ${stats.estimatedCostUsd}
                </p>
              </div>
              <span className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-[11px] font-semibold text-emerald-400">
                Estimated Cost
              </span>
            </div>

            <p className="text-[11px] text-zinc-500">
              Pricing calculated from centralized configurations in <code className="text-zinc-400">lib/ai/cost.ts</code>. Actual invoice totals may reflect tier volume discounts.
            </p>
          </div>
        </div>

        {/* AI Failure Diagnostics */}
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 backdrop-blur space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-rose-400" />
              <h2 className="text-base font-semibold text-white">Failure Diagnostics & Error Rate</h2>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-zinc-400">Failure Rate:</span>
              <span className={`font-semibold ${failureRate > 5 ? "text-rose-400" : "text-emerald-400"}`}>
                {failureRate}%
              </span>
            </div>
          </div>

          {stats.recentFailures.length === 0 ? (
            <div className="py-8 text-center rounded-xl border border-dashed border-zinc-800 bg-zinc-950/40">
              <CheckCircle2 className="h-7 w-7 text-emerald-400 mx-auto mb-2" />
              <p className="text-xs font-semibold text-zinc-200">Zero Recent AI Failures</p>
              <p className="text-[11px] text-zinc-500 mt-0.5">All API requests and streaming calls have executed without error.</p>
            </div>
          ) : (
            <div className="divide-y divide-zinc-800/60 text-xs">
              {stats.recentFailures.map((fail) => (
                <div key={fail.id} className="py-3 flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-zinc-200 capitalize">
                        {fail.feature.replace(/_/g, " ")}
                      </span>
                      <span className="rounded bg-rose-500/10 border border-rose-500/20 px-1.5 py-0.2 text-[10px] font-semibold text-rose-400">
                        Error
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-1 max-w-xl truncate">
                      {fail.error}
                    </p>
                  </div>

                  <span className="text-[10px] text-zinc-500 shrink-0">
                    {new Date(fail.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
