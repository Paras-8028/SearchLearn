"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  BookOpen,
  Loader2,
  AlertCircle,
  ArrowLeft,
  Sparkles,
} from "lucide-react";

const CATEGORIES = [
  "Web Development",
  "Computer Science",
  "Artificial Intelligence",
  "Data Structures & Algorithms",
  "Cloud & DevOps",
  "Databases & Backend",
  "Mobile Development",
  "Software Engineering",
];

export function CourseCreateForm() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Computer Science");
  const [level, setLevel] = useState<"beginner" | "intermediate" | "advanced">("beginner");
  const [published, setPublished] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Please enter a course title");
      return;
    }
    if (!description.trim()) {
      setError("Please enter a course description");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          category,
          level,
          published,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to create course");
      }

      router.push(`/instructor/courses/${data.data._id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create course");
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
      {error && (
        <div className="p-4 bg-red-950/40 border border-red-800/60 rounded-xl text-xs text-red-300 flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Details Card */}
      <div className="p-6 bg-zinc-900/70 border border-zinc-800/80 rounded-2xl space-y-6">
        <h2 className="text-base font-semibold text-zinc-100 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-indigo-400" />
          Course Information
        </h2>

        {/* Title */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Course Title <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Advanced Asynchronous JavaScript & Node.js"
            maxLength={120}
            className="w-full px-4 py-2.5 bg-zinc-950/70 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors"
            required
          />
          <span className="text-[11px] text-zinc-500 block text-right">
            {title.length}/120
          </span>
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Description <span className="text-red-400">*</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Provide a thorough overview of what learners will master, key concepts, and prerequisites..."
            className="w-full p-4 bg-zinc-950/70 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
            required
          />
        </div>

        {/* Category & Level */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2.5 bg-zinc-950/70 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-indigo-500 transition-colors"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Target Difficulty
            </label>
            <select
              value={level}
              onChange={(e) =>
                setLevel(e.target.value as "beginner" | "intermediate" | "advanced")
              }
              className="w-full px-3 py-2.5 bg-zinc-950/70 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-indigo-500 transition-colors capitalize"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>

        {/* Status Toggle */}
        <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-zinc-200 block">
              Publish Status
            </span>
            <span className="text-[11px] text-zinc-500">
              Published courses appear in the public catalog and AI semantic search index.
            </span>
          </div>

          <button
            type="button"
            onClick={() => setPublished(!published)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border ${
              published
                ? "bg-emerald-950/60 text-emerald-300 border-emerald-700"
                : "bg-zinc-800 text-zinc-400 border-zinc-700"
            }`}
          >
            {published ? "✓ Published" : "Draft"}
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <Link
          href="/instructor/courses"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Cancel & Return</span>
        </Link>

        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold transition-all shadow-md"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Creating Course...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Create Course & Open Curriculum Builder</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
