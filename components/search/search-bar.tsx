"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
}

export function SearchBar({
  placeholder = "Search courses, lessons, notes, and documents...",
  onSearch,
  className,
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    if (onSearch) {
      onSearch(trimmedQuery);
    } else {
      router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`relative w-full ${className || ""}`}>
      <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />

      <Input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={placeholder}
        className="h-13 w-full rounded-2xl border-border/80 bg-card/90 pl-12 pr-24 text-sm sm:text-base text-foreground shadow-lg shadow-black/20 backdrop-blur-sm transition-all hover:border-border-hover focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
      />

      <button
        type="submit"
        className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 rounded-xl bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-all cursor-pointer"
      >
        <span>Search</span>
        <ArrowRight className="size-3.5" />
      </button>
    </form>
  );
}