"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Layers, PlayCircle, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import type { CourseDTO } from "@/types/course";
import type { EnrollmentDTO } from "@/types/enrollment";

interface CourseHeaderProps {
  course: CourseDTO;
  moduleCount: number;
  lessonCount: number;
  firstLessonId?: string;
  enrollment?: EnrollmentDTO | null;
}

export function CourseHeader({
  course,
  moduleCount,
  lessonCount,
  firstLessonId,
  enrollment,
}: CourseHeaderProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const levelColor =
    course.level === "advanced"
      ? "bg-red-500/10 text-red-400 border-red-500/20"
      : course.level === "intermediate"
        ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
        : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";

  const handleStartOrContinue = async () => {
    setLoading(true);
    try {
      // Trigger enrollment API call
      const res = await fetch(`/api/courses/${course._id}/enroll`, {
        method: "POST",
      });

      if (res.status === 401) {
        router.push(`/sign-in?redirect=/courses/${course._id}`);
        return;
      }

      const targetLessonId =
        enrollment?.lastLessonId || firstLessonId;

      if (targetLessonId) {
        router.push(`/learn/${targetLessonId}`);
      } else {
        alert("This course has no published lessons yet.");
      }
    } catch (err) {
      console.error("Enrollment failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const isEnrolled = !!enrollment;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-b from-card to-card/60 p-6 md:p-10 shadow-xl">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-4 max-w-3xl">
          {/* Categories & Level */}
          <div className="flex flex-wrap items-center gap-2">
            {course.category && (
              <span className="rounded-md bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
                {course.category}
              </span>
            )}
            {course.level && (
              <span
                className={`rounded-md border px-3 py-1 text-xs font-semibold capitalize ${levelColor}`}
              >
                {course.level} Level
              </span>
            )}
            {isEnrolled && (
              <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-semibold text-primary">
                <CheckCircle2 className="h-3.5 w-3.5" /> Enrolled
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl text-foreground">
            {course.title}
          </h1>

          {/* Description */}
          <p className="text-base text-muted-foreground leading-relaxed md:text-lg">
            {course.description}
          </p>

          {/* Stats */}
          <div className="flex flex-wrap items-center gap-6 pt-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-primary" />
              <span>
                <strong className="text-foreground">{moduleCount}</strong> Modules
              </span>
            </div>

            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              <span>
                <strong className="text-foreground">{lessonCount}</strong> Lessons
              </span>
            </div>

            {isEnrolled && (
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span>
                  Progress: <strong className="text-foreground">{enrollment.progressPercentage}%</strong>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Action Button Box */}
        <div className="mt-4 md:mt-0 flex flex-col items-stretch sm:items-start md:items-end">
          <button
            onClick={handleStartOrContinue}
            disabled={loading}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-8 text-base font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/20 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <PlayCircle className="h-5 w-5" />
            )}
            <span>
              {isEnrolled ? "Continue Learning" : "Start Learning"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
