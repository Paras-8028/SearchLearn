import Link from "next/link";
import { BookOpen, Clock, Layers, Sparkles } from "lucide-react";
import type { CourseDTO } from "@/types/course";

interface CourseCardProps {
  course: CourseDTO;
  moduleCount?: number;
  lessonCount?: number;
  totalDuration?: number;
}

export function CourseCard({
  course,
  moduleCount = 0,
  lessonCount = 0,
  totalDuration,
}: CourseCardProps) {
  const levelColor =
    course.level === "advanced"
      ? "bg-red-500/10 text-red-400 border-red-500/20"
      : course.level === "intermediate"
        ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
        : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";

  return (
    <div className="group relative flex flex-col justify-between rounded-xl border border-border bg-card p-6 transition-all duration-200 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
      <div>
        {/* Badges & Category */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          {course.category ? (
            <span className="rounded-md bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
              {course.category}
            </span>
          ) : (
            <span />
          )}

          {course.level && (
            <span
              className={`rounded-md border px-2.5 py-0.5 text-xs font-medium capitalize ${levelColor}`}
            >
              {course.level}
            </span>
          )}
        </div>

        {/* Thumbnail / Placeholder */}
        {course.thumbnail ? (
          <div className="mb-4 aspect-video overflow-hidden rounded-lg border border-border/50 bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={course.thumbnail}
              alt={course.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        ) : (
          <div className="mb-4 flex aspect-video items-center justify-center rounded-lg border border-border/50 bg-accent/20 text-muted-foreground group-hover:bg-accent/40">
            <Sparkles className="h-8 w-8 text-primary/70" />
          </div>
        )}

        {/* Title & Description */}
        <h3 className="line-clamp-2 text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
          <Link href={`/courses/${course._id || course.slug}`}>
            <span className="absolute inset-0 z-10" />
            {course.title}
          </Link>
        </h3>

        <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {course.description}
        </p>
      </div>

      {/* Meta Footer */}
      <div className="mt-6 border-t border-border/60 pt-4 text-xs text-muted-foreground">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-muted-foreground/80" />
              <span>{moduleCount} {moduleCount === 1 ? "module" : "modules"}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5 text-muted-foreground/80" />
              <span>{lessonCount} {lessonCount === 1 ? "lesson" : "lessons"}</span>
            </div>
          </div>

          {totalDuration ? (
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-muted-foreground/80" />
              <span>{totalDuration}m</span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
