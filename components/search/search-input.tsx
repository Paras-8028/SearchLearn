"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X, Loader2, Sparkles, History, ArrowRight } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (val: string) => void;
  onSearch: (val: string) => void;
  placeholder?: string;
  loading?: boolean;
  recentSearches?: string[];
  onSelectRecent?: (val: string) => void;
}

export function SearchInput({
  value,
  onChange,
  onSearch,
  placeholder = "Ask anything about your learning content...",
  loading = false,
  recentSearches = [],
  onSelectRecent,
}: SearchInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (trimmed) {
      setIsFocused(false);
      onSearch(trimmed);
    }
  };

  const handleClear = () => {
    onChange("");
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const showRecentDropdown = isFocused && !value.trim() && recentSearches.length > 0;

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={handleSubmit} className="relative w-full">
        <div className="relative flex items-center">
          <div className="pointer-events-none absolute left-4 flex items-center text-primary/80">
            <Sparkles className="h-5 w-5" />
          </div>

          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder={placeholder}
            className="h-14 w-full rounded-2xl border border-border/80 bg-card py-3 pl-12 pr-28 text-base text-foreground placeholder:text-muted-foreground/60 shadow-lg transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />

          <div className="absolute right-3 flex items-center gap-1.5">
            {value && (
              <button
                type="button"
                onClick={handleClear}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                title="Clear input"
              >
                <X className="h-4 w-4" />
              </button>
            )}

            <button
              type="submit"
              disabled={loading || !value.trim()}
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-primary px-4 text-xs font-bold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 disabled:opacity-40"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Search className="h-3.5 w-3.5" />
                  <span>Search</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Recent Searches Dropdown */}
      {showRecentDropdown && (
        <div className="absolute top-full z-50 mt-2 w-full overflow-hidden rounded-xl border border-border bg-card p-3 shadow-2xl backdrop-blur">
          <div className="mb-2 flex items-center justify-between px-2 text-xs font-semibold text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <History className="h-3.5 w-3.5" />
              Recent Searches
            </span>
          </div>

          <div className="space-y-1">
            {recentSearches.slice(0, 6).map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  onChange(q);
                  setIsFocused(false);
                  onSelectRecent?.(q);
                }}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-foreground hover:bg-accent transition-colors"
              >
                <span className="truncate">{q}</span>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-60" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
