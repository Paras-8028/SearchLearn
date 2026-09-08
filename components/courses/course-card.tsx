import Link from "next/link";
import { BookOpen, Clock, Layers, Sparkles, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
  const levelVariant =
    course.level === "advanced"
      ? "destructive"
      : course.level === "intermediate"
        ? "warning"
        : "success";

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-6 shadow-sm transition-all duration-200 hover:border-primary/40 hover:shadow-xl hover:shadow-indigo-500/5">
      <div>
        {/* Category & Level Badges */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          {course.category ? (
            <span className="rounded-lg bg-secondary px-2.5 py-1 text-[11px] font-semibold text-secondary-foreground border border-border/40">
              {course.category}
            </span>
          ) : (
            <span />
          )}

          {course.level && (
            <Badge variant={levelVariant} className="capitalize font-medium">
              {course.level}
            </Badge>
          )}
        </div>

        {/* Course Visual Banner / Thumbnail */}
        {course.thumbnail ? (
          <div className="mb-4 aspect-video overflow-hidden rounded-xl border border-border/50 bg-secondary/50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={course.thumbnail}
              alt={course.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        ) : (
          <div className="mb-4 flex aspect-video items-center justify-center rounded-xl border border-border/50 bg-gradient-to-br from-secondary/80 to-secondary/30 text-muted-foreground group-hover:border-primary/20 transition-colors">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-card border border-border/80 shadow-inner">
              <Sparkles className="size-6 text-primary/80" />
            </div>
          </div>
        )}

        {/* Title & Description */}
        <h3 className="line-clamp-2 text-lg font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
          <Link href={`/courses/${course._id || course.slug}`}>
            <span className="absolute inset-0 z-10" />
            {course.title}
          </Link>
        </h3>

        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {course.description}
        </p>
      </div>

      {/* Meta Footer */}
      <div className="mt-6 border-t border-border/60 pt-4 text-xs text-muted-foreground">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Layers className="size-3.5 text-muted-foreground/80" />
              <span>
                {moduleCount} {moduleCount === 1 ? "module" : "modules"}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <BookOpen className="size-3.5 text-muted-foreground/80" />
              <span>
                {lessonCount} {lessonCount === 1 ? "lesson" : "lessons"}
              </span>
            </div>

            {totalDuration ? (
              <div className="flex items-center gap-1.5">
                <Clock className="size-3.5 text-muted-foreground/80" />
                <span>{Math.round(totalDuration / 60)}m</span>
              </div>
            ) : null}
          </div>

          <div className="flex items-center gap-1 font-semibold text-primary/90 group-hover:text-primary transition-colors">
            <span>View</span>
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </div>
  );
}
