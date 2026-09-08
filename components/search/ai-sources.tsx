import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";

interface AiSourceItem {
  id: string;
  title: string;
  contentType: string;
  courseTitle?: string;
  moduleTitle?: string;
  href: string;
}

interface AiSourcesProps {
  sources: AiSourceItem[];
}

export function AiSources({ sources }: AiSourcesProps) {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="space-y-3 pt-4 border-t border-border/60">
      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
        <span>Grounded in SmartLearn Sources</span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {sources.map((src, idx) => (
          <Link
            key={idx}
            href={src.href}
            className="group flex flex-col justify-between rounded-xl border border-border/80 bg-background/60 p-3.5 text-xs transition-all hover:border-primary/50 hover:bg-background"
          >
            <div>
              <span className="text-[11px] font-medium text-muted-foreground truncate block">
                {src.courseTitle} {src.moduleTitle ? `› ${src.moduleTitle}` : ""}
              </span>

              <h4 className="mt-1 font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                {src.title}
              </h4>
            </div>

            <div className="mt-3 flex items-center justify-between text-[11px] text-primary font-medium">
              <span className="capitalize">{src.contentType}</span>
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
