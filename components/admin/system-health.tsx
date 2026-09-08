import { Database, Sparkles, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import type { SystemHealthStatus } from "@/types/analytics";

interface SystemHealthProps {
  health: SystemHealthStatus;
}

export function SystemHealth({ health }: SystemHealthProps) {
  const isDbHealthy = health.database.status === "healthy";
  const isAiHealthy = health.aiService.status === "available";
  const isDocsHealthy = health.documentProcessing.status === "operational";

  return (
    <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-5 backdrop-blur">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Platform Infrastructure Health
          </h3>
          <p className="text-[11px] text-zinc-500 mt-0.5">
            Real-time status of database connection, AI reasoning providers, and pipeline workers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Database */}
          <div className="flex items-center gap-2.5 rounded-xl border border-zinc-800 bg-zinc-950/60 px-3.5 py-2">
            <Database className="h-4 w-4 text-emerald-400 shrink-0" />
            <div className="text-xs">
              <div className="flex items-center gap-1.5 font-medium text-zinc-200">
                <span>Database</span>
                {isDbHealthy ? (
                  <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                ) : (
                  <AlertCircle className="h-3 w-3 text-red-400" />
                )}
              </div>
              <p className="text-[10px] text-zinc-500">
                {isDbHealthy ? `Connected (${health.database.latencyMs}ms)` : "Unavailable"}
              </p>
            </div>
          </div>

          {/* AI Service */}
          <div className="flex items-center gap-2.5 rounded-xl border border-zinc-800 bg-zinc-950/60 px-3.5 py-2">
            <Sparkles className="h-4 w-4 text-purple-400 shrink-0" />
            <div className="text-xs">
              <div className="flex items-center gap-1.5 font-medium text-zinc-200">
                <span>AI Service</span>
                {isAiHealthy ? (
                  <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                ) : (
                  <AlertCircle className="h-3 w-3 text-amber-400" />
                )}
              </div>
              <p className="text-[10px] text-zinc-500">
                {isAiHealthy ? `Active (${health.aiService.provider})` : "Key Missing"}
              </p>
            </div>
          </div>

          {/* Document Processing */}
          <div className="flex items-center gap-2.5 rounded-xl border border-zinc-800 bg-zinc-950/60 px-3.5 py-2">
            <FileText className="h-4 w-4 text-indigo-400 shrink-0" />
            <div className="text-xs">
              <div className="flex items-center gap-1.5 font-medium text-zinc-200">
                <span>Doc Pipeline</span>
                {isDocsHealthy ? (
                  <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                ) : (
                  <AlertCircle className="h-3 w-3 text-amber-400" />
                )}
              </div>
              <p className="text-[10px] text-zinc-500">
                {isDocsHealthy
                  ? "Operational"
                  : `${health.documentProcessing.failedCount} failed`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
