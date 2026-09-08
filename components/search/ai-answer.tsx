import { Sparkles, Bot, Loader2, X } from "lucide-react";
import { AiSources } from "./ai-sources";

interface AiAnswerProps {
  answer: string;
  sources: {
    id: string;
    title: string;
    contentType: string;
    courseTitle?: string;
    moduleTitle?: string;
    href: string;
  }[];
  loading: boolean;
  question: string;
  onClose?: () => void;
}

export function AiAnswer({
  answer,
  sources,
  loading,
  question,
  onClose,
}: AiAnswerProps) {
  if (!loading && !answer) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-primary/40 bg-gradient-to-b from-card via-card/90 to-primary/5 p-6 md:p-8 shadow-xl">
      {/* Background radial glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary">
              <Bot className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                <span>SmartLearn AI Answer</span>
              </div>
              {question && (
                <p className="text-xs text-muted-foreground truncate max-w-lg">
                  &quot;{question}&quot;
                </p>
              )}
            </div>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Content / Loading */}
        {loading ? (
          <div className="py-8 space-y-4">
            <div className="flex items-center gap-3 text-sm font-semibold text-primary">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Analyzing learning library and generating grounded answer...</span>
            </div>
            <div className="space-y-2 animate-pulse">
              <div className="h-4 w-full rounded bg-muted/60" />
              <div className="h-4 w-5/6 rounded bg-muted/60" />
              <div className="h-4 w-4/6 rounded bg-muted/60" />
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="prose prose-invert max-w-none text-sm leading-relaxed text-foreground whitespace-pre-line md:text-base">
              {answer}
            </div>

            <AiSources sources={sources} />
          </div>
        )}
      </div>
    </div>
  );
}
