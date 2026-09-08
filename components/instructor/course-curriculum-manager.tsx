"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Layers,
  PlusCircle,
  ChevronUp,
  ChevronDown,
  Trash2,
  Edit2,
  PlayCircle,
  FileText,
  FileCode,
  HelpCircle,
  AlertCircle,
  Check,
  X,
  Clock,
} from "lucide-react";
import type { CourseModuleDTO } from "@/types/module";
import type { LessonDTO, LessonContentType } from "@/types/lesson";

export interface ModuleWithLessonsDTO extends CourseModuleDTO {
  lessons: LessonDTO[];
}

interface CourseCurriculumManagerProps {
  courseId: string;
  initialModules: ModuleWithLessonsDTO[];
}

export function CourseCurriculumManager({
  courseId,
  initialModules,
}: CourseCurriculumManagerProps) {
  const [modules, setModules] = useState<ModuleWithLessonsDTO[]>(initialModules);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Add Module State
  const [isAddingModule, setIsAddingModule] = useState(false);
  const [newModuleTitle, setNewModuleTitle] = useState("");
  const [newModuleDesc, setNewModuleDesc] = useState("");

  // Edit Module State
  const [editingModuleId, setEditingModuleId] = useState<string | null>(null);
  const [editModuleTitle, setEditModuleTitle] = useState("");
  const [editModuleDesc, setEditModuleDesc] = useState("");

  // Add Lesson State
  const [addingLessonToModuleId, setAddingLessonToModuleId] = useState<string | null>(null);
  const [newLessonTitle, setNewLessonTitle] = useState("");
  const [newLessonType, setNewLessonType] = useState<LessonContentType>("article");
  const [newLessonDuration, setNewLessonDuration] = useState<number>(10);

  // Handle Add Module
  const handleCreateModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModuleTitle.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/courses/${courseId}/modules`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newModuleTitle.trim(),
          description: newModuleDesc.trim() || undefined,
          order: modules.length,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to create module");
      }

      setModules((prev) => [...prev, { ...data.data, lessons: [] }]);
      setNewModuleTitle("");
      setNewModuleDesc("");
      setIsAddingModule(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create module");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Edit Module
  const handleSaveModuleEdit = async (moduleId: string) => {
    if (!editModuleTitle.trim()) return;

    try {
      const res = await fetch(`/api/modules/${moduleId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editModuleTitle.trim(),
          description: editModuleDesc.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update module");
      }

      setModules((prev) =>
        prev.map((m) =>
          m._id === moduleId
            ? { ...m, title: data.data.title, description: data.data.description }
            : m
        )
      );
      setEditingModuleId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update module");
    }
  };

  // Handle Delete Module
  const handleDeleteModule = async (moduleId: string, title: string) => {
    if (
      !confirm(
        `Are you sure you want to delete module "${title}"? All child lessons and their search index records will be deleted.`
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/modules/${moduleId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to delete module");
      }

      setModules((prev) => prev.filter((m) => m._id !== moduleId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete module");
    }
  };

  // Move Module Up/Down
  const handleMoveModule = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= modules.length) return;

    const newModules = [...modules];
    const [moved] = newModules.splice(index, 1);
    newModules.splice(targetIndex, 0, moved);

    setModules(newModules);

    try {
      await fetch(`/api/courses/${courseId}/modules`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          moduleIds: newModules.map((m) => m._id),
        }),
      });
    } catch (err) {
      console.error("Failed to reorder modules:", err);
    }
  };

  // Handle Create Lesson
  const handleCreateLesson = async (moduleId: string) => {
    if (!newLessonTitle.trim()) return;

    setIsLoading(true);
    setError(null);

    const targetMod = modules.find((m) => m._id === moduleId);
    const order = targetMod ? targetMod.lessons.length : 0;

    try {
      const res = await fetch(`/api/modules/${moduleId}/lessons`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newLessonTitle.trim(),
          contentType: newLessonType,
          duration: Number(newLessonDuration) || 10,
          order,
          published: true,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to create lesson");
      }

      setModules((prev) =>
        prev.map((m) =>
          m._id === moduleId
            ? { ...m, lessons: [...m.lessons, data.data] }
            : m
        )
      );

      setNewLessonTitle("");
      setAddingLessonToModuleId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create lesson");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Delete Lesson
  const handleDeleteLesson = async (moduleId: string, lessonId: string, title: string) => {
    if (!confirm(`Are you sure you want to delete lesson "${title}"?`)) return;

    try {
      const res = await fetch(`/api/lessons/${lessonId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to delete lesson");
      }

      setModules((prev) =>
        prev.map((m) =>
          m._id === moduleId
            ? { ...m, lessons: m.lessons.filter((l) => l._id !== lessonId) }
            : m
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete lesson");
    }
  };

  // Move Lesson Up/Down
  const handleMoveLesson = async (
    moduleId: string,
    lessonIndex: number,
    direction: "up" | "down"
  ) => {
    const mod = modules.find((m) => m._id === moduleId);
    if (!mod) return;

    const targetIndex = direction === "up" ? lessonIndex - 1 : lessonIndex + 1;
    if (targetIndex < 0 || targetIndex >= mod.lessons.length) return;

    const updatedLessons = [...mod.lessons];
    const [moved] = updatedLessons.splice(lessonIndex, 1);
    updatedLessons.splice(targetIndex, 0, moved);

    setModules((prev) =>
      prev.map((m) => (m._id === moduleId ? { ...m, lessons: updatedLessons } : m))
    );

    try {
      await fetch(`/api/modules/${moduleId}/lessons`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonIds: updatedLessons.map((l) => l._id),
        }),
      });
    } catch (err) {
      console.error("Failed to reorder lessons:", err);
    }
  };

  const getLessonIcon = (type: LessonContentType) => {
    switch (type) {
      case "video":
        return PlayCircle;
      case "article":
        return FileText;
      case "document":
        return FileCode;
      case "quiz":
        return HelpCircle;
      default:
        return FileText;
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-red-950/40 border border-red-800/60 rounded-xl text-xs text-red-300 flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Modules List */}
      <div className="space-y-4">
        {modules.map((mod, modIdx) => (
          <div
            key={mod._id}
            className="rounded-2xl bg-zinc-900/80 border border-zinc-800/90 overflow-hidden shadow-sm"
          >
            {/* Module Header */}
            <div className="p-4 sm:p-5 bg-zinc-900 border-b border-zinc-800/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              {editingModuleId === mod._id ? (
                <div className="flex-1 flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={editModuleTitle}
                    onChange={(e) => setEditModuleTitle(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-zinc-950 border border-zinc-700 rounded-lg text-xs text-zinc-100"
                    placeholder="Module Title"
                  />
                  <input
                    type="text"
                    value={editModuleDesc}
                    onChange={(e) => setEditModuleDesc(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-zinc-950 border border-zinc-700 rounded-lg text-xs text-zinc-100"
                    placeholder="Optional Description"
                  />
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleSaveModuleEdit(mod._id)}
                      className="p-1.5 rounded bg-indigo-600 text-white hover:bg-indigo-500"
                      title="Save"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingModuleId(null)}
                      className="p-1.5 rounded bg-zinc-800 text-zinc-400 hover:text-zinc-200"
                      title="Cancel"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleMoveModule(modIdx, "up")}
                      disabled={modIdx === 0}
                      className="p-1 rounded text-zinc-400 hover:text-zinc-200 disabled:opacity-30 transition-colors"
                      title="Move Module Up"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveModule(modIdx, "down")}
                      disabled={modIdx === modules.length - 1}
                      className="p-1 rounded text-zinc-400 hover:text-zinc-200 disabled:opacity-30 transition-colors"
                      title="Move Module Down"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 shrink-0">
                        Module {modIdx + 1}
                      </span>
                      <span className="text-zinc-600">•</span>
                      <span className="text-xs text-zinc-400">
                        {mod.lessons.length} {mod.lessons.length === 1 ? "lesson" : "lessons"}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-zinc-100 truncate">
                      {mod.title}
                    </h4>
                    {mod.description && (
                      <p className="text-xs text-zinc-400 line-clamp-1 mt-0.5">
                        {mod.description}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Module Action Controls */}
              {editingModuleId !== mod._id && (
                <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingModuleId(mod._id);
                      setEditModuleTitle(mod.title);
                      setEditModuleDesc(mod.description || "");
                    }}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors text-xs"
                    title="Edit Module Info"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteModule(mod._id, mod.title)}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-zinc-800 transition-colors text-xs"
                    title="Delete Module"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setAddingLessonToModuleId(mod._id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-xs font-medium transition-colors"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Add Lesson</span>
                  </button>
                </div>
              )}
            </div>

            {/* Lessons In Module */}
            <div className="p-4 space-y-2">
              {mod.lessons.length === 0 ? (
                <div className="p-6 text-center border border-dashed border-zinc-800/80 rounded-xl bg-zinc-950/40 text-xs text-zinc-500">
                  No lessons in this module yet. Click &ldquo;Add Lesson&rdquo; to author your first unit.
                </div>
              ) : (
                mod.lessons.map((lesson, lIdx) => {
                  const Icon = getLessonIcon(lesson.contentType);

                  return (
                    <div
                      key={lesson._id}
                      className="p-3 bg-zinc-950/60 border border-zinc-850 hover:border-zinc-700/80 rounded-xl flex items-center justify-between gap-3 transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {/* Ordering Controls */}
                        <div className="flex items-center shrink-0">
                          <button
                            type="button"
                            onClick={() => handleMoveLesson(mod._id, lIdx, "up")}
                            disabled={lIdx === 0}
                            className="p-0.5 text-zinc-500 hover:text-zinc-200 disabled:opacity-20"
                          >
                            <ChevronUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveLesson(mod._id, lIdx, "down")}
                            disabled={lIdx === mod.lessons.length - 1}
                            className="p-0.5 text-zinc-500 hover:text-zinc-200 disabled:opacity-20"
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Lesson Icon */}
                        <div className="w-7 h-7 rounded-lg bg-zinc-900 flex items-center justify-center text-indigo-400 shrink-0 border border-zinc-800">
                          <Icon className="w-3.5 h-3.5" />
                        </div>

                        {/* Lesson Title & Meta */}
                        <div className="min-w-0">
                          <h5 className="text-xs font-semibold text-zinc-200 truncate">
                            {lesson.title}
                          </h5>
                          <div className="flex items-center gap-2 text-[11px] text-zinc-500 mt-0.5">
                            <span className="capitalize">{lesson.contentType}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {lesson.duration || 10}m
                            </span>
                            <span>•</span>
                            <span
                              className={
                                lesson.published ? "text-emerald-400" : "text-amber-400"
                              }
                            >
                              {lesson.published ? "Published" : "Draft"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Lesson Actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        <Link
                          href={`/instructor/courses/${courseId}/lessons/${lesson._id}`}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition-colors"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Edit</span>
                        </Link>

                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteLesson(mod._id, lesson._id, lesson.title)
                          }
                          className="p-1 text-zinc-500 hover:text-red-400 transition-colors"
                          title="Delete Lesson"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}

              {/* Inline Add Lesson Form */}
              {addingLessonToModuleId === mod._id && (
                <div className="p-4 bg-zinc-950/80 border border-indigo-500/40 rounded-xl space-y-3 mt-3">
                  <span className="text-xs font-semibold text-indigo-300 block">
                    Add Lesson to {mod.title}
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        value={newLessonTitle}
                        onChange={(e) => setNewLessonTitle(e.target.value)}
                        placeholder="Lesson title (e.g. Introduction to Promises)..."
                        className="w-full px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500"
                        autoFocus
                      />
                    </div>

                    <div className="flex gap-2">
                      <select
                        value={newLessonType}
                        onChange={(e) =>
                          setNewLessonType(e.target.value as LessonContentType)
                        }
                        className="w-full px-2 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-indigo-500 capitalize"
                      >
                        <option value="article">Article</option>
                        <option value="video">Video</option>
                        <option value="document">Document</option>
                        <option value="quiz">Quiz</option>
                      </select>

                      <input
                        type="number"
                        value={newLessonDuration}
                        onChange={(e) => setNewLessonDuration(Number(e.target.value))}
                        min={1}
                        placeholder="Mins"
                        className="w-20 px-2 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-200 text-center"
                        title="Duration in minutes"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setAddingLessonToModuleId(null)}
                      className="px-3 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-zinc-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCreateLesson(mod._id)}
                      disabled={isLoading || !newLessonTitle.trim()}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold shadow-sm"
                    >
                      {isLoading ? "Creating..." : "Save Lesson"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add New Module Form */}
      {isAddingModule ? (
        <form
          onSubmit={handleCreateModule}
          className="p-5 bg-zinc-900/90 border border-indigo-500/40 rounded-2xl space-y-4"
        >
          <h4 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            Add New Curriculum Module
          </h4>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">
                Module Title
              </label>
              <input
                type="text"
                value={newModuleTitle}
                onChange={(e) => setNewModuleTitle(e.target.value)}
                placeholder="e.g., Module 2: Functions, Scope & Closures"
                className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">
                Description (Optional)
              </label>
              <textarea
                value={newModuleDesc}
                onChange={(e) => setNewModuleDesc(e.target.value)}
                rows={2}
                placeholder="Brief summary of concepts covered in this module..."
                className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddingModule(false)}
              className="px-3.5 py-1.5 text-xs text-zinc-400 hover:text-zinc-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !newModuleTitle.trim()}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-sm"
            >
              {isLoading ? "Creating..." : "Add Module"}
            </button>
          </div>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setIsAddingModule(true)}
          className="w-full p-4 border border-dashed border-zinc-800 hover:border-indigo-500/60 rounded-2xl bg-zinc-900/40 hover:bg-zinc-900/80 text-zinc-400 hover:text-indigo-300 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Module</span>
        </button>
      )}
    </div>
  );
}
