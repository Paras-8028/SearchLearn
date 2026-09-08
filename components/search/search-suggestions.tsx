"use client";

import { Sparkles, ArrowUpRight } from "lucide-react";

interface SearchSuggestionsProps {
  onSelect: (query: string) => void;
}

const SUGGESTIONS = [
  "What is a JavaScript Promise?",
  "Explain Async / Await in JavaScript",
  "How does the JavaScript Event Loop work?",
  "What is Supervised Learning?",
  "How do Artificial Neural Networks work?",
  "Variables and lexical scope in ES6",
];

export function SearchSuggestions({ onSelect }: SearchSuggestionsProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <Sparkles className="h-3.5 w-3.5 text-primary" />
        <span>Example Learning Questions & Topics</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {SUGGESTIONS.map((suggestion, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(suggestion)}
            className="group inline-flex items-center gap-1.5 rounded-xl border border-border/80 bg-card/60 px-3.5 py-2 text-xs font-medium text-muted-foreground transition-all hover:border-primary/50 hover:bg-card hover:text-foreground"
          >
            <span>{suggestion}</span>
            <ArrowUpRight className="h-3 w-3 opacity-50 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100 group-hover:text-primary" />
          </button>
        ))}
      </div>
    </div>
  );
}
