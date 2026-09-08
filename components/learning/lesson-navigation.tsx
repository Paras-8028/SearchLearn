import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, Circle } from "lucide-react";

interface LessonNavigationProps {
  prevLessonId?: string;
  nextLessonId?: string;
  isCompleted?: boolean;
  onToggleComplete?: () => void;
  isUpdating?: boolean;
}

export function LessonNavigation({
  prevLessonId,
  nextLessonId,
  isCompleted = false,
  onToggleComplete,
  isUpdating = false,
}: LessonNavigationProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-border/80 bg-card p-4">
      {/* Previous Button */}
      {prevLessonId ? (
        <Link
          href={`/learn/${prevLessonId}`}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-border bg-secondary/40 px-4 text-sm font-medium transition-colors hover:bg-secondary hover:text-foreground w-full sm:w-auto"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Previous Lesson</span>
        </Link>
      ) : (
        <div className="hidden sm:block" />
      )}

      {/* Mark Complete Action */}
      {onToggleComplete && (
        <button
          onClick={onToggleComplete}
          disabled={isUpdating}
          className={`inline-flex h-10 items-center justify-center gap-2 rounded-lg px-5 text-sm font-semibold transition-all w-full sm:w-auto ${
            isCompleted
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20"
              : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20"
          } disabled:opacity-50`}
        >
          {isCompleted ? (
            <>
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Completed</span>
            </>
          ) : (
            <>
              <Circle className="h-4 w-4" />
              <span>Mark as Complete</span>
            </>
          )}
        </button>
      )}

      {/* Next Button */}
      {nextLessonId ? (
        <Link
          href={`/learn/${nextLessonId}`}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-border bg-secondary/40 px-4 text-sm font-medium transition-colors hover:bg-secondary hover:text-foreground w-full sm:w-auto"
        >
          <span>Next Lesson</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      ) : (
        <div className="hidden sm:block" />
      )}
    </div>
  );
}
