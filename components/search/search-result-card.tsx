import Link from "next/link";
import {
  BookOpen,
  Layers,
  FileText,
  PlayCircle,
  HelpCircle,
  File,
  ArrowRight,
  Clock,
  Sparkles,
} from "lucide-react";
import type { SearchResult, SearchContentType } from "@/types/search";

interface SearchResultCardProps {
  result: SearchResult;
}

export function SearchResultCard({ result }: SearchResultCardProps) {
  const getIcon = (type: SearchContentType) => {
    switch (type) {
      case "course":
        return <BookOpen className="h-4 w-4 text-primary" />;
      case "module":
        return <Layers className="h-4 w-4 text-purple-400" />;
      case "video":
        return <PlayCircle className="h-4 w-4 text-red-400" />;
      case "quiz":
        return <HelpCircle className="h-4 w-4 text-emerald-400" />;
      case "document":
        return <File className="h-4 w-4 text-amber-400" />;
      case "article":
      case "lesson":
      default:
        return <FileText className="h-4 w-4 text-blue-400" />;
    }
  };

  const relevanceColor =
    result.relevanceLabel === "Highly Relevant"
      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
      : result.relevanceLabel === "Relevant"
        ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
        : "bg-secondary text-secondary-foreground border-border";

  const handleClick = () => {
    try {
      fetch("/api/search/click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          searchQuery: result.title,
          resultType: result.contentType,
          resultId: result.id,
          courseId: result.courseId,
          lessonId: result.lessonId,
        }),
        keepalive: true,
      }).catch(() => {});
    } catch {
      // Non-blocking telemetry
    }
  };

  return (
    <div className="group relative rounded-xl border border-border/80 bg-card p-5 transition-all duration-200 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
      <div className="flex flex-col gap-3">
        {/* Badges and Breadcrumbs Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-muted-foreground truncate">
            <span className="flex items-center gap-1.5 font-semibold text-foreground">
              {getIcon(result.contentType)}
              <span className="capitalize">{result.contentType}</span>
            </span>

            {result.courseTitle && (
              <>
                <span>•</span>
                <span className="truncate">{result.courseTitle}</span>
              </>
            )}

            {result.moduleTitle && (
              <>
                <span>›</span>
                <span className="truncate">{result.moduleTitle}</span>
              </>
            )}
          </div>

          {result.relevanceLabel && (
            <span
              className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-semibold ${relevanceColor}`}
            >
              <Sparkles className="h-3 w-3" />
              <span>{result.relevanceLabel}</span>
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
          <Link href={result.href} onClick={handleClick}>
            <span className="absolute inset-0 z-10" />
            {result.title}
          </Link>
        </h3>

        {/* Snippet */}
        {result.description && (
          <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2">
            {result.description}
          </p>
        )}

        {/* Footer Meta */}
        <div className="flex items-center justify-between border-t border-border/60 pt-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            {result.metadata?.category && (
              <span className="rounded bg-secondary/80 px-2 py-0.5 font-medium text-secondary-foreground">
                {result.metadata.category}
              </span>
            )}
            {result.metadata?.duration ? (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {result.metadata.duration} min
              </span>
            ) : null}
          </div>

          <span className="inline-flex items-center gap-1 font-semibold text-primary transition-transform group-hover:translate-x-1">
            <span>Open {result.contentType === "course" ? "Course" : "Lesson"}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </div>
  );
}
