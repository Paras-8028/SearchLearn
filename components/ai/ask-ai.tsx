"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  BookOpen,
  Send,
  Loader2,
  Copy,
  Check,
  ExternalLink,
  AlertCircle,
} from "lucide-react";
import type { CourseDTO } from "@/types/course";
import type { AiAnswerResult } from "@/lib/ai/answer";

interface AskAiProps {
  courses: CourseDTO[];
}

const PRESET_PROMPTS = [
  "Explain Big-O time complexity and common algorithm classes.",
  "What is Retrieval-Augmented Generation (RAG) and how does it work?",
  "How does vector search differ from keyword lexical search?",
  "What are React 19 Server Components and actions?",
  "How do indexes optimize query performance in MongoDB?",
];

export function AskAi({ courses }: AskAiProps) {
  const [question, setQuestion] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AiAnswerResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleAsk = async (e?: React.FormEvent, customQuestion?: string) => {
    if (e) e.preventDefault();
    const queryToAsk = (customQuestion || question).trim();
    if (!queryToAsk) return;

    setIsLoading(true);
    setError(null);
    if (customQuestion) setQuestion(customQuestion);

    try {
      const res = await fetch("/api/ai/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: queryToAsk,
          courseId: selectedCourseId || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to generate answer");
      }

      setResult(data.data);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "An error occurred while asking AI."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result?.answer) return;
    navigator.clipboard.writeText(result.answer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Hero Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-800/60 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          Grounded Learning Intelligence
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Ask SearchLearn AI
        </h1>
        <p className="text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Ask questions across courses, modules, lessons, and uploaded documents.
          Answers are strictly synthesized with citations from your learning repository.
        </p>
      </div>

      {/* Query Formulation Form */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 sm:p-6 shadow-xl backdrop-blur space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Course Scope Filter */}
          <div className="sm:w-64">
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">
              Knowledge Scope
            </label>
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-950/60 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-indigo-500 transition-colors"
            >
              <option value="">All Courses & Library</option>
              {courses.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Info */}
          <div className="flex-1 flex items-center text-xs text-zinc-500 sm:pt-6">
            <span>
              💡 Grounded with hybrid vector search & reranking across all indexed material.
            </span>
          </div>
        </div>

        {/* Input Area */}
        <form onSubmit={handleAsk} className="space-y-3">
          <div className="relative">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleAsk();
                }
              }}
              rows={3}
              placeholder="Ask a conceptual question (e.g. 'How does binary search achieve O(log n)?', 'Explain React 19 Actions')..."
              className="w-full p-4 bg-zinc-950/80 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
            />

            <button
              type="submit"
              disabled={isLoading || !question.trim()}
              className="absolute right-3 bottom-3 inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition-all shadow-md"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Thinking...</span>
                </>
              ) : (
                <>
                  <span>Ask AI</span>
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Preset Prompt Chips */}
        <div className="space-y-1.5 pt-2">
          <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
            Suggested Prompts
          </span>
          <div className="flex flex-wrap gap-2">
            {PRESET_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleAsk(undefined, prompt)}
                className="text-xs text-left bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700/60 hover:border-indigo-500/50 text-zinc-300 rounded-lg px-3 py-1.5 transition-all"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-950/40 border border-red-800/60 rounded-xl text-sm text-red-300 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-400 mt-0.5" />
          <div>
            <h4 className="font-semibold text-red-200">Unable to generate answer</h4>
            <p className="mt-0.5 text-xs text-red-300/90">{error}</p>
          </div>
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-6 space-y-4 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-950/60 border border-indigo-800/40 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-indigo-400 animate-spin" />
            </div>
            <div className="space-y-1.5">
              <div className="h-4 w-40 bg-zinc-800 rounded" />
              <div className="h-3 w-64 bg-zinc-800/60 rounded" />
            </div>
          </div>
          <div className="space-y-2 pt-3">
            <div className="h-3 w-full bg-zinc-800/80 rounded" />
            <div className="h-3 w-5/6 bg-zinc-800/80 rounded" />
            <div className="h-3 w-4/6 bg-zinc-800/80 rounded" />
          </div>
        </div>
      )}

      {/* Answer Display */}
      {result && !isLoading && (
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-zinc-100 font-semibold text-sm">Grounded AI Answer</h3>
                <div className="flex items-center gap-2 text-[11px] text-zinc-500">
                  {result.model && <span>Model: {result.model}</span>}
                  {result.tokensUsed ? (
                    <>
                      <span>•</span>
                      <span>{result.tokensUsed} tokens</span>
                    </>
                  ) : null}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700/80 text-xs text-zinc-300 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-medium">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          {/* Answer Text */}
          <div className="prose prose-invert max-w-none text-zinc-200 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
            {result.answer}
          </div>

          {/* Grounded Sources */}
          {result.sources && result.sources.length > 0 && (
            <div className="pt-6 border-t border-zinc-800/80 space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                Verified Sources ({result.sources.length})
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {result.sources.map((src, idx) => (
                  <Link
                    key={src.id || idx}
                    href={src.href || "#"}
                    className="group p-3 rounded-xl bg-zinc-950/60 border border-zinc-800 hover:border-indigo-500/50 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 group-hover:text-indigo-300 transition-colors">
                          {src.contentType}
                        </span>
                        <ExternalLink className="w-3 h-3 text-zinc-600 group-hover:text-indigo-400 transition-colors" />
                      </div>

                      <h5 className="text-xs font-medium text-zinc-200 group-hover:text-indigo-300 transition-colors line-clamp-1">
                        {src.title}
                      </h5>

                      {src.courseTitle && (
                        <p className="text-[11px] text-zinc-500 line-clamp-1 mt-0.5">
                          {src.courseTitle}
                        </p>
                      )}

                      {src.snippet && (
                        <p className="text-[11px] text-zinc-400 line-clamp-2 mt-1.5 leading-relaxed bg-zinc-900/40 p-1.5 rounded border border-zinc-800/40">
                          &ldquo;{src.snippet}&rdquo;
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
