import { SearchResultCard } from "./search-result-card";
import { BookOpen, Search } from "lucide-react";
import type { SearchResult } from "@/types/search";

interface SearchResultsProps {
  results: SearchResult[];
  loading: boolean;
  query: string;
}

export function SearchResults({ results, loading, query }: SearchResultsProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="animate-pulse rounded-xl border border-border/60 bg-card/60 p-5 space-y-3"
          >
            <div className="h-4 w-1/4 rounded bg-muted" />
            <div className="h-6 w-3/4 rounded bg-muted" />
            <div className="h-4 w-full rounded bg-muted" />
            <div className="h-3 w-1/3 rounded bg-muted" />
          </div>
        ))}
      </div>
    );
  }

  if (!query.trim()) {
    return null;
  }

  if (results.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border/80 bg-card/20 p-12 text-center">
        <Search className="mx-auto h-12 w-12 text-muted-foreground/40 mb-3" />
        <h3 className="text-lg font-bold text-foreground">
          No learning content found
        </h3>
        <p className="mt-1 text-sm text-muted-foreground max-w-sm mx-auto">
          We couldn&apos;t find anything matching &quot;{query}&quot;. Try using different keywords, asking broader questions, or adjusting filters.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
        <span>
          Found <strong className="text-foreground">{results.length}</strong> matching learning {results.length === 1 ? "result" : "results"}
        </span>
      </div>

      <div className="space-y-4">
        {results.map((res) => (
          <SearchResultCard key={res.id} result={res} />
        ))}
      </div>
    </div>
  );
}
