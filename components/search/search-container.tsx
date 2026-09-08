"use client";

import { useState } from "react";
import { SearchInput } from "./search-input";
import { SearchFilters } from "./search-filters";
import { SearchSuggestions } from "./search-suggestions";
import { SearchResults } from "./search-results";
import { AiAnswer } from "./ai-answer";
import { Sparkles, Bot } from "lucide-react";
import type { SearchResult } from "@/types/search";
import type { CourseDTO } from "@/types/course";
import type { SearchHistoryDTO } from "@/types/search-history";

interface AiSource {
  id: string;
  title: string;
  contentType: string;
  courseTitle?: string;
  moduleTitle?: string;
  href: string;
}

interface SearchContainerProps {
  initialCourses: CourseDTO[];
  initialRecentSearches: SearchHistoryDTO[];
}

export function SearchContainer({
  initialCourses = [],
  initialRecentSearches = [],
}: SearchContainerProps) {
  const [query, setQuery] = useState("");
  const [activeQuery, setActiveQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedCourse, setSelectedCourse] = useState("all");

  const [results, setResults] = useState<SearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  // AI Answer state
  const [aiAnswer, setAiAnswer] = useState<string>("");
  const [aiSources, setAiSources] = useState<AiSource[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [showAiBox, setShowAiBox] = useState(false);

  const [recentSearches, setRecentSearches] = useState<string[]>(() =>
    initialRecentSearches.map((s) => s.query)
  );

  const performSearch = async (
    searchQuery: string,
    contentType: string = selectedType,
    courseId: string = selectedCourse
  ) => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;

    setActiveQuery(trimmed);
    setSearchLoading(true);

    // Update local recent searches
    setRecentSearches((prev) => [
      trimmed,
      ...prev.filter((q) => q.toLowerCase() !== trimmed.toLowerCase()),
    ]);

    try {
      const contentTypesParam =
        contentType !== "all" ? contentType : undefined;
      const courseIdParam =
        courseId !== "all" ? courseId : undefined;

      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: trimmed,
          contentTypes: contentTypesParam ? [contentTypesParam] : undefined,
          courseId: courseIdParam,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          setResults(data.data.results || []);
        }
      }
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setSearchLoading(false);
    }

    // Auto-generate AI answer if it appears to be a question
    const isQuestion =
      trimmed.endsWith("?") ||
      /^(what|how|why|where|when|explain|describe|can|is|does)\b/i.test(trimmed) ||
      trimmed.split(" ").length >= 4;

    if (isQuestion) {
      fetchAiAnswer(trimmed, courseId);
    } else {
      setShowAiBox(false);
      setAiAnswer("");
      setAiSources([]);
    }
  };

  const fetchAiAnswer = async (questionText: string, courseId: string = selectedCourse) => {
    setShowAiBox(true);
    setAiLoading(true);
    setAiAnswer("");
    setAiSources([]);

    try {
      const res = await fetch("/api/ai/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: questionText,
          courseId: courseId !== "all" ? courseId : undefined,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          setAiAnswer(data.data.answer);
          setAiSources(data.data.sources || []);
        }
      }
    } catch (err) {
      console.error("AI Answer generation failed:", err);
      setAiAnswer("An error occurred while generating the AI answer.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleTypeChange = (newType: string) => {
    setSelectedType(newType);
    if (activeQuery) {
      performSearch(activeQuery, newType, selectedCourse);
    }
  };

  const handleCourseChange = (newCourse: string) => {
    setSelectedCourse(newCourse);
    if (activeQuery) {
      performSearch(activeQuery, selectedType, newCourse);
    }
  };

  const handleSelectSuggestion = (suggestedText: string) => {
    setQuery(suggestedText);
    performSearch(suggestedText);
  };

  return (
    <div className="space-y-8">
      {/* Search Header Banner */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Intelligent Learning Search & RAG</span>
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl text-foreground">
          Search Your Learning Library
        </h1>

        <p className="text-base text-muted-foreground max-w-2xl leading-relaxed">
          Ask questions or search topics across courses, lessons, code concepts, and video transcripts using hybrid semantic search.
        </p>
      </div>

      {/* Main Search Input */}
      <div className="max-w-3xl space-y-4">
        <SearchInput
          value={query}
          onChange={setQuery}
          onSearch={(q) => performSearch(q)}
          loading={searchLoading}
          recentSearches={recentSearches}
          onSelectRecent={(q) => performSearch(q)}
        />

        {/* Action Bar for AI Ask */}
        {query && !showAiBox && (
          <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
            <span>Press Enter or click Search to find matches</span>
            <button
              onClick={() => fetchAiAnswer(query)}
              className="inline-flex items-center gap-1.5 font-semibold text-primary hover:underline"
            >
              <Bot className="h-3.5 w-3.5" />
              <span>Ask SearchLearn AI for an answer</span>
            </button>
          </div>
        )}
      </div>

      {/* Suggestions if no search has run */}
      {!activeQuery && (
        <div className="max-w-3xl pt-2">
          <SearchSuggestions onSelect={handleSelectSuggestion} />
        </div>
      )}

      {/* Search Active State */}
      {activeQuery && (
        <div className="space-y-8">
          {/* Filters */}
          <SearchFilters
            selectedType={selectedType}
            onSelectType={handleTypeChange}
            selectedCourse={selectedCourse}
            onSelectCourse={handleCourseChange}
            courses={initialCourses.map((c) => ({ _id: c._id, title: c.title }))}
          />

          {/* AI Answer Section */}
          {showAiBox && (
            <AiAnswer
              answer={aiAnswer}
              sources={aiSources}
              loading={aiLoading}
              question={activeQuery}
              onClose={() => setShowAiBox(false)}
            />
          )}

          {/* Search Results Grid */}
          <SearchResults
            results={results}
            loading={searchLoading}
            query={activeQuery}
          />
        </div>
      )}
    </div>
  );
}
