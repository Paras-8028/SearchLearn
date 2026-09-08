"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2, AlertCircle, Save, Trash2 } from "lucide-react";
import type { CourseDTO } from "@/types/course";

interface CourseSettingsFormProps {
  course: CourseDTO;
  onUpdate: (updated: CourseDTO) => void;
}

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

export function CourseSettingsForm({ course, onUpdate }: CourseSettingsFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState(course.title);
  const [description, setDescription] = useState(course.description);
  const [category, setCategory] = useState(course.category || "Computer Science");
  const [level, setLevel] = useState<"beginner" | "intermediate" | "advanced">(
    course.level || "beginner"
  );
  const [published, setPublished] = useState(course.published);

  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError("Title and description are required");
      return;
    }

    setIsSaving(true);
    setError(null);
    setMessage(null);

    try {
      const res = await fetch(`/api/courses/${course._id}`, {
        method: "PATCH",
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
        throw new Error(data.error || "Failed to update course");
      }

      onUpdate(data.data);
      setMessage("Course settings updated successfully.");
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update course");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        `Are you completely sure you want to delete "${course.title}"? All modules, lessons, attached documents, and search embeddings will be permanently removed.`
      )
    ) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      const res = await fetch(`/api/courses/${course._id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to delete course");
      }

      router.push("/instructor/courses");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete course");
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl">
      {message && (
        <div className="p-4 bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-xs text-emerald-300 flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-950/40 border border-red-800/60 rounded-xl text-xs text-red-300 flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="p-6 bg-zinc-900/70 border border-zinc-800/80 rounded-2xl space-y-6">
        <h3 className="text-base font-semibold text-zinc-100">Course Metadata & Settings</h3>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Course Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={120}
            className="w-full px-4 py-2.5 bg-zinc-950/70 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Course Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full p-4 bg-zinc-950/70 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
            required
          />
        </div>

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

        <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-zinc-200 block">
              Publish Status
            </span>
            <span className="text-[11px] text-zinc-500">
              {published
                ? "Course is live, searchable by AI, and enrollable by students."
                : "Course is in draft mode and visible only to you."}
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

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold transition-all shadow-md"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Danger Zone */}
      <div className="p-6 bg-red-950/20 border border-red-900/40 rounded-2xl space-y-4">
        <div>
          <h4 className="text-sm font-bold text-red-400">Danger Zone</h4>
          <p className="text-xs text-zinc-400 mt-0.5">
            Permanently delete this course and all associated modules, lessons, embeddings, and enrolled progress.
          </p>
        </div>

        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/40 text-xs font-semibold transition-all"
        >
          {isDeleting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Deleting Course...</span>
            </>
          ) : (
            <>
              <Trash2 className="w-4 h-4" />
              <span>Delete This Course</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
