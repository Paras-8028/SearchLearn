"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  ChevronLeft,
  FileText,
  HelpCircle,
  Layers,
  Menu,
  PlayCircle,
  Sparkles,
  X,
} from "lucide-react";
import type { LessonDTO } from "@/types/lesson";
import type { CourseDTO } from "@/types/course";
import type { CourseModuleDTO } from "@/types/module";
import { LessonAiTools } from "@/components/lesson/lesson-ai-tools";

interface ModuleWithLessonsDTO extends CourseModuleDTO {
  lessons: LessonDTO[];
}

interface LearnViewerProps {
  lesson: LessonDTO;
  course: CourseDTO;
  currentModule?: CourseModuleDTO | null;
  modules: ModuleWithLessonsDTO[];
  initialCompletedLessonIds: string[];
  initialProgressPercentage: number;
}

export function LearnViewer({
  lesson,
  course,
  currentModule,
  modules,
  initialCompletedLessonIds,
  initialProgressPercentage,
}: LearnViewerProps) {
  const router = useRouter();

  const [completedIds, setCompletedIds] = useState<string[]>(initialCompletedLessonIds);
  const [progressPct, setProgressPct] = useState<number>(initialProgressPercentage);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const isCompleted = completedIds.includes(lesson._id);

  // Flatten all lessons across all modules to calculate prev and next
  const allLessons: LessonDTO[] = modules.flatMap((m) => m.lessons);
  const currentIndex = allLessons.findIndex((l) => l._id === lesson._id);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : undefined;
  const nextLesson =
    currentIndex >= 0 && currentIndex < allLessons.length - 1
      ? allLessons[currentIndex + 1]
      : undefined;

  const handleToggleComplete = async () => {
    setIsUpdating(true);
    const newStatus = !isCompleted;

    // Optimistic update
    const updatedCompletedIds = newStatus
      ? [...completedIds, lesson._id]
      : completedIds.filter((id) => id !== lesson._id);

    setCompletedIds(updatedCompletedIds);

    const total = allLessons.length;
    const newPct = total > 0 ? Math.round((updatedCompletedIds.length / total) * 100) : 0;
    setProgressPct(newPct);

    try {
      const res = await fetch(`/api/lessons/${lesson._id}/progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: newStatus }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          setProgressPct(data.data.progressPercentage);
        }
      }
    } catch (err) {
      console.error("Failed to update progress:", err);
    } finally {
      setIsUpdating(false);

      // Auto-navigate to next lesson if user just completed current lesson and next lesson exists
      if (newStatus && nextLesson) {
        setTimeout(() => {
          router.push(`/learn/${nextLesson._id}`);
        }, 400);
      }
    }
  };

  const renderContent = () => {
    switch (lesson.contentType) {
      case "video":
        return (
          <div className="space-y-6">
            {lesson.videoUrl ? (
              <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-border bg-black shadow-2xl">
                {lesson.videoUrl.includes("youtube.com") || lesson.videoUrl.includes("youtu.be") ? (
                  <iframe
                    src={lesson.videoUrl.replace("watch?v=", "embed/")}
                    title={lesson.title}
                    className="h-full w-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video
                    src={lesson.videoUrl}
                    controls
                    className="h-full w-full object-contain"
                  />
                )}
              </div>
            ) : (
              <div className="flex aspect-video items-center justify-center rounded-2xl border border-dashed border-border bg-card/40 p-8 text-center">
                <div className="space-y-2">
                  <PlayCircle className="mx-auto h-12 w-12 text-primary/60" />
                  <p className="text-sm font-medium text-muted-foreground">
                    Video content placeholder for &quot;{lesson.title}&quot;
                  </p>
                </div>
              </div>
            )}

            {lesson.content && (
              <div className="prose prose-invert max-w-none rounded-2xl border border-border/80 bg-card p-6 md:p-8">
                <h3 className="text-lg font-bold text-foreground mb-3">Lesson Notes & Transcript</h3>
                <div className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                  {lesson.content}
                </div>
              </div>
            )}
          </div>
        );

      case "article":
      case "document":
        return (
          <div className="rounded-2xl border border-border/80 bg-card p-6 md:p-10 shadow-lg space-y-6">
            <div className="flex items-center gap-2 text-xs font-semibold text-primary">
              <FileText className="h-4 w-4" />
              <span className="capitalize">{lesson.contentType} Lesson</span>
            </div>

            <div className="prose prose-invert max-w-none space-y-4 text-foreground">
              {lesson.content ? (
                <div className="whitespace-pre-line leading-relaxed text-sm md:text-base text-muted-foreground">
                  {lesson.content}
                </div>
              ) : (
                <p className="italic text-muted-foreground">
                  No article text provided for this lesson yet.
                </p>
              )}
            </div>
          </div>
        );

      case "quiz":
        return (
          <div className="rounded-2xl border border-border/80 bg-card p-6 md:p-10 shadow-lg space-y-6">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <HelpCircle className="h-4 w-4" />
              <span>Knowledge Check Quiz</span>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold text-foreground">{lesson.title}</h3>
              {lesson.content && (
                <p className="text-sm text-muted-foreground">{lesson.content}</p>
              )}

              <div className="rounded-xl border border-border bg-accent/20 p-6 space-y-4">
                <p className="font-semibold text-sm text-foreground">
                  Review the concept taught in this module. Are you ready to test your knowledge?
                </p>
                <button
                  onClick={handleToggleComplete}
                  className="rounded-lg bg-emerald-500 px-5 py-2.5 text-xs font-bold text-black hover:bg-emerald-400 transition-colors"
                >
                  {isCompleted ? "Quiz Completed ✓" : "Pass Quiz & Mark Complete"}
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background flex flex-col lg:flex-row">
      {/* Sidebar for Desktop & Drawer for Mobile */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-80 transform border-r border-border bg-card transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/80 p-4">
            <Link
              href={`/courses/${course._id}`}
              className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="truncate max-w-[180px]">{course.title}</span>
            </Link>

            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden rounded-md p-1 text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Progress Overview */}
          <div className="border-b border-border/80 p-4 bg-card/50">
            <div className="flex items-center justify-between text-xs font-semibold mb-2">
              <span className="text-muted-foreground">Course Progress</span>
              <span className="text-primary">{progressPct}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* Module & Lesson Outline */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {modules.map((mod, modIdx) => (
              <div key={mod._id} className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  <span>Module {modIdx + 1}:</span>
                  <span className="truncate text-foreground">{mod.title}</span>
                </div>

                <div className="space-y-1 pl-2">
                  {mod.lessons.map((l) => {
                    const active = l._id === lesson._id;
                    const done = completedIds.includes(l._id);

                    return (
                      <Link
                        key={l._id}
                        href={`/learn/${l._id}`}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-xs transition-all ${
                          active
                            ? "bg-primary text-primary-foreground font-semibold"
                            : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          {done ? (
                            <CheckCircle2
                              className={`h-3.5 w-3.5 flex-shrink-0 ${
                                active ? "text-primary-foreground" : "text-emerald-400"
                              }`}
                            />
                          ) : (
                            <PlayCircle className="h-3.5 w-3.5 flex-shrink-0 opacity-70" />
                          )}
                          <span className="truncate">{l.title}</span>
                        </div>

                        {l.duration && (
                          <span className="opacity-75 flex-shrink-0">{l.duration}m</span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto py-8 px-4 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl space-y-8">
          {/* Top Bar for Mobile Toggle & Meta Info */}
          <div className="flex items-center justify-between border-b border-border/60 pb-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground lg:hidden hover:bg-accent"
            >
              <Menu className="h-4 w-4" />
              <span>Course Outline</span>
            </button>

            <div className="flex items-center gap-2 text-xs text-muted-foreground ml-auto">
              <Layers className="h-3.5 w-3.5" />
              <span>{currentModule?.title || "Module"}</span>
            </div>
          </div>

          {/* Lesson Title Header */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-xs font-semibold text-primary capitalize">
                {lesson.contentType}
              </span>
              {lesson.duration && (
                <span className="text-xs text-muted-foreground">
                  • {lesson.duration} minutes
                </span>
              )}
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl text-foreground">
              {lesson.title}
            </h1>

            {lesson.description && (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {lesson.description}
              </p>
            )}
          </div>

          {/* Render Dynamic Content */}
          {renderContent()}

          {/* In-Lesson AI Learning Intelligence Tools */}
          <LessonAiTools lessonId={lesson._id} lessonTitle={lesson.title} />

          {/* Navigation Controls */}
          <div className="pt-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-border/80 bg-card p-5 shadow-lg">
              {prevLesson ? (
                <Link
                  href={`/learn/${prevLesson._id}`}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-secondary/40 px-5 text-sm font-semibold transition-colors hover:bg-secondary hover:text-foreground w-full sm:w-auto"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Previous</span>
                </Link>
              ) : (
                <div className="hidden sm:block" />
              )}

              <button
                onClick={handleToggleComplete}
                disabled={isUpdating}
                className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl px-6 text-sm font-bold transition-all w-full sm:w-auto ${
                  isCompleted
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20"
                    : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20"
                } disabled:opacity-50`}
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>{isCompleted ? "Completed ✓" : "Mark as Complete"}</span>
              </button>

              {nextLesson ? (
                <Link
                  href={`/learn/${nextLesson._id}`}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-secondary/40 px-5 text-sm font-semibold transition-colors hover:bg-secondary hover:text-foreground w-full sm:w-auto"
                >
                  <span>Next Lesson</span>
                  <ChevronLeft className="h-4 w-4 rotate-180" />
                </Link>
              ) : (
                <Link
                  href={`/courses/${course._id}`}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary/20 border border-primary/30 px-5 text-sm font-semibold text-primary hover:bg-primary/30 w-full sm:w-auto"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Finish Course</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
