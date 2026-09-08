"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Trash2,
  Eye,
} from "lucide-react";
import type { LessonDTO, LessonContentType } from "@/types/lesson";
import type { CourseDTO } from "@/types/course";

interface LessonEditorProps {
  course: CourseDTO;
  lesson: LessonDTO;
}

export function LessonEditor({ course, lesson }: LessonEditorProps) {
  const router = useRouter();

  const [title, setTitle] = useState(lesson.title);
  const [description, setDescription] = useState(lesson.description || "");
  const [contentType, setContentType] = useState<LessonContentType>(lesson.contentType);
  const [content, setContent] = useState(lesson.content || "");
  const [videoUrl, setVideoUrl] = useState(lesson.videoUrl || "");
  const [duration, setDuration] = useState<number>(lesson.duration || 10);
  const [published, setPublished] = useState(lesson.published ?? true);

  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!title.trim()) {
      setError("Lesson title is required");
      return;
    }

    setIsSaving(true);
    setError(null);
    setSaveSuccess(false);

    try {
      const res = await fetch(`/api/lessons/${lesson._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || undefined,
          contentType,
          content: content || undefined,
          videoUrl: videoUrl.trim() || undefined,
          duration: Number(duration) || 10,
          published,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update lesson");
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save lesson");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to permanently delete lesson "${lesson.title}"?`)) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      const res = await fetch(`/api/lessons/${lesson._id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete lesson");
      }

      router.push(`/instructor/courses/${course._id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete lesson");
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-800/80 pb-6">
        <div>
          <Link
            href={`/instructor/courses/${course._id}`}
            className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to {course.title}</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-xs text-indigo-400 font-semibold uppercase tracking-wider">
              Lesson Editor
            </span>
            <span className="text-zinc-600">•</span>
            <span
              className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                published
                  ? "bg-emerald-950/60 text-emerald-400 border-emerald-800/50"
                  : "bg-amber-950/60 text-amber-400 border-amber-800/50"
              }`}
            >
              {published ? "Published" : "Draft"}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
            {title || "Untitled Lesson"}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {published && (
            <Link
              href={`/learn/${lesson._id}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-zinc-300 transition-colors"
              target="_blank"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </Link>
          )}

          <button
            type="button"
            onClick={() => handleSave()}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold transition-all shadow-md"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-xs text-emerald-300 flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>Lesson saved! AI embeddings & search index updated in background.</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-950/40 border border-red-800/60 rounded-xl text-xs text-red-300 flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Editor Form */}
      <div className="space-y-6">
        {/* Basic Metadata Card */}
        <div className="p-6 bg-zinc-900/70 border border-zinc-800/80 rounded-2xl space-y-5">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Lesson Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Understanding Promise.all and Promise.race"
              className="w-full px-4 py-2.5 bg-zinc-950/70 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Description / Summary (Optional)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief summary of what this lesson covers..."
              className="w-full px-4 py-2.5 bg-zinc-950/70 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            {/* Content Type */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Lesson Type
              </label>
              <select
                value={contentType}
                onChange={(e) => setContentType(e.target.value as LessonContentType)}
                className="w-full px-3 py-2 bg-zinc-950/70 border border-zinc-800 rounded-xl text-xs text-zinc-200 capitalize focus:outline-none focus:border-indigo-500"
              >
                <option value="article">Article / Reading</option>
                <option value="video">Video Lesson</option>
                <option value="document">Document / PDF</option>
                <option value="quiz">Knowledge Check</option>
              </select>
            </div>

            {/* Duration */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Duration (Minutes)
              </label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                min={1}
                className="w-full px-3 py-2 bg-zinc-950/70 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Published Toggle */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Status
              </label>
              <button
                type="button"
                onClick={() => setPublished(!published)}
                className={`w-full py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                  published
                    ? "bg-emerald-950/60 text-emerald-300 border-emerald-700"
                    : "bg-zinc-800 text-zinc-400 border-zinc-700"
                }`}
              >
                {published ? "✓ Published" : "Draft Mode"}
              </button>
            </div>
          </div>

          {/* Video URL Input & Preview */}
          {contentType === "video" && (
            <div className="pt-4 border-t border-zinc-800/80 space-y-3">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Video URL (YouTube or MP4 stream)
                </label>
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-4 py-2 bg-zinc-950/70 border border-zinc-800 rounded-xl text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {videoUrl && (
                <div className="aspect-video w-full rounded-xl overflow-hidden border border-zinc-800 bg-black">
                  {videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be") ? (
                    <iframe
                      src={videoUrl.replace("watch?v=", "embed/")}
                      title="Video preview"
                      className="w-full h-full border-0"
                      allowFullScreen
                    />
                  ) : (
                    <video src={videoUrl} controls className="w-full h-full object-contain" />
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Lesson Body Content Editor */}
        <div className="p-6 bg-zinc-900/70 border border-zinc-800/80 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-zinc-100">
                Lesson Content & Notes
              </h3>
              <p className="text-xs text-zinc-400">
                Full lesson narrative, code examples, transcript, or study guide.
              </p>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-zinc-500">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>AI Search Grounded</span>
            </div>
          </div>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={16}
            placeholder="Write lesson material here (Plain Text or Markdown)...
# Topic Overview
Explain the concept thoroughly with intuitive real-world examples.

```javascript
// Add sample code blocks
const result = await doAsyncWork();
```"
            className="w-full p-4 bg-zinc-950/80 border border-zinc-800 rounded-xl text-sm font-mono text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors resize-y leading-relaxed"
          />

          <div className="p-3 bg-zinc-950/40 border border-zinc-800/60 rounded-xl flex items-center justify-between text-[11px] text-zinc-500">
            <span>
              💡 Markdown supported: headers (`#`), bullet points (`-`), bold (`**`), code (` ``` `).
            </span>
            <span>{content.length} characters</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-950/40 transition-colors"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Lesson</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleSave()}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold transition-all shadow-md"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Lesson</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
