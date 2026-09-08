import { Search, TrendingUp, Compass } from "lucide-react";
import type { SearchAnalytics } from "@/types/analytics";

interface PopularSearchesProps {
  search: SearchAnalytics;
}

export function PopularSearches({ search }: PopularSearchesProps) {
  return (
    <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 backdrop-blur space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-emerald-400" />
          <h3 className="text-sm font-semibold text-white">Search Intelligence</h3>
        </div>
        <span className="text-[11px] text-zinc-500">{search.searchesInRange} queries</span>
      </div>

      {/* Top Search Queries */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[11px] font-medium text-zinc-400 uppercase tracking-wider">
          <span className="flex items-center gap-1.5">
            <TrendingUp className="h-3.5 w-3.5 text-amber-400" />
            Trending Queries
          </span>
          <span>Hits</span>
        </div>

        {search.popularQueries.length === 0 ? (
          <div className="py-6 text-center rounded-xl border border-dashed border-zinc-800/80">
            <p className="text-xs text-zinc-500">No search queries recorded in this period.</p>
          </div>
        ) : (
          <div className="space-y-1.5">
            {search.popularQueries.slice(0, 7).map((q, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-xl bg-zinc-950/60 border border-zinc-800/50 px-3 py-2 text-xs"
              >
                <span className="font-medium text-zinc-300 truncate max-w-xs">
                  &ldquo;{q.query}&rdquo;
                </span>
                <span className="font-semibold text-emerald-400 shrink-0 ml-2">
                  {q.count} {q.count === 1 ? "search" : "searches"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Queries */}
      <div className="space-y-2 pt-1 border-t border-zinc-800/60">
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-400 uppercase tracking-wider">
          <Compass className="h-3.5 w-3.5 text-indigo-400" />
          Recent Queries
        </div>
        {search.recentSearches.length === 0 ? (
          <p className="text-xs text-zinc-500">No recent searches.</p>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {search.recentSearches.slice(0, 8).map((s, idx) => (
              <span
                key={idx}
                className="rounded-lg border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-[11px] text-zinc-300"
              >
                {s.query}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
