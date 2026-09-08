import Link from "next/link";
import { PlayCircle, FileText, File, HelpCircle, CheckCircle2, Circle } from "lucide-react";
import type { LessonDTO, LessonContentType } from "@/types/lesson";

interface LessonItemProps {
  lesson: LessonDTO;
  isCompleted?: boolean;
  isCurrent?: boolean;
}

export function LessonItem({
  lesson,
  isCompleted = false,
  isCurrent = false,
}: LessonItemProps) {
  const getIcon = (type: LessonContentType) => {
    switch (type) {
      case "video":
        return <PlayCircle className="h-4 w-4 text-primary" />;
      case "article":
        return <FileText className="h-4 w-4 text-blue-400" />;
      case "document":
        return <File className="h-4 w-4 text-amber-400" />;
      case "quiz":
        return <HelpCircle className="h-4 w-4 text-emerald-400" />;
      default:
        return <FileText className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <Link
      href={`/learn/${lesson._id}`}
      className={`group flex items-center justify-between gap-4 rounded-lg border p-3.5 text-sm transition-all ${
        isCurrent
          ? "border-primary bg-primary/10 font-medium text-foreground"
          : "border-border/60 bg-card/40 hover:border-primary/40 hover:bg-accent/40"
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex-shrink-0">{getIcon(lesson.contentType)}</div>

        <span className="truncate group-hover:text-primary transition-colors">
          {lesson.title}
        </span>
      </div>

      <div className="flex items-center gap-3 flex-shrink-0 text-xs text-muted-foreground">
        {lesson.duration ? (
          <span>{lesson.duration} min</span>
        ) : (
          <span className="capitalize">{lesson.contentType}</span>
        )}

        {isCompleted ? (
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
        ) : (
          <Circle className="h-4 w-4 text-muted-foreground/40 group-hover:text-muted-foreground" />
        )}
      </div>
    </Link>
  );
}
