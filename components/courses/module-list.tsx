"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Layers } from "lucide-react";
import type { CourseModuleDTO } from "@/types/module";
import type { LessonDTO } from "@/types/lesson";
import { LessonItem } from "./lesson-item";

export interface ModuleWithLessonsDTO extends CourseModuleDTO {
  lessons: LessonDTO[];
}

interface ModuleListProps {
  modules: ModuleWithLessonsDTO[];
  completedLessonIds?: string[];
  currentLessonId?: string;
}

export function ModuleList({
  modules,
  completedLessonIds = [],
  currentLessonId,
}: ModuleListProps) {
  const [openModules, setOpenModules] = useState<Record<string, boolean>>(() => {
    // Open all modules by default
    const initial: Record<string, boolean> = {};
    modules.forEach((mod) => {
      initial[mod._id] = true;
    });
    return initial;
  });

  const toggleModule = (id: string) => {
    setOpenModules((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (!modules || modules.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground">
        <Layers className="mx-auto h-8 w-8 text-muted-foreground/60 mb-2" />
        <p>No modules available for this course yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {modules.map((mod, index) => {
        const isOpen = openModules[mod._id] ?? true;
        const completedInModule = mod.lessons.filter((l) =>
          completedLessonIds.includes(l._id)
        ).length;

        return (
          <div
            key={mod._id}
            className="overflow-hidden rounded-xl border border-border/80 bg-card transition-all"
          >
            {/* Module Header Toggle */}
            <button
              onClick={() => toggleModule(mod._id)}
              className="flex w-full items-center justify-between p-5 text-left transition-colors hover:bg-accent/30"
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground">
                  {index + 1}
                </span>

                <div>
                  <h3 className="text-base font-bold text-foreground">
                    {mod.title}
                  </h3>
                  {mod.description && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {mod.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>
                  {completedInModule}/{mod.lessons.length} completed
                </span>
                {isOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </div>
            </button>

            {/* Lessons List */}
            {isOpen && mod.lessons.length > 0 && (
              <div className="border-t border-border/60 p-4 space-y-2 bg-card/30">
                {mod.lessons.map((lesson) => (
                  <LessonItem
                    key={lesson._id}
                    lesson={lesson}
                    isCompleted={completedLessonIds.includes(lesson._id)}
                    isCurrent={lesson._id === currentLessonId}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
