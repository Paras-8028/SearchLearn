"use client";

import { useState } from "react";
import {
  Sparkles,
  Lightbulb,
  FileText,
  ListOrdered,
  HelpCircle,
  Baby,
  Loader2,
  Copy,
  Check,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Send,
} from "lucide-react";
import type { LessonAiAction, QuizQuestion } from "@/lib/ai/prompts/lesson-actions";

interface LessonAiToolsProps {
  lessonId: string;
  lessonTitle: string;
}

export function LessonAiTools({ lessonId, lessonTitle }: LessonAiToolsProps) {
  const [activeAction, setActiveAction] = useState<LessonAiAction | null>(null);
  const [customQuery, setCustomQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState<string | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[] | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  const actions: { id: LessonAiAction; label: string; icon: typeof Lightbulb; desc: string }[] = [
    { id: "explain", label: "Explain", icon: Lightbulb, desc: "In-depth conceptual breakdown" },
    { id: "summarize", label: "Summarize", icon: FileText, desc: "Executive 3-part summary" },
    { id: "key_points", label: "Key Points", icon: ListOrdered, desc: "Revision cheat sheet" },
    { id: "quiz", label: "Quiz Me", icon: HelpCircle, desc: "3 interactive MCQs" },
    { id: "simplify", label: "Simplify", icon: Baby, desc: "Explain like I'm five (ELI5)" },
  ];

  const handleTriggerAction = async (action: LessonAiAction, queryOverride?: string) => {
    setActiveAction(action);
    setIsLoading(true);
    setError(null);
    setContent(null);
    setQuizQuestions(null);
    setSelectedAnswers({});

    try {
      const res = await fetch("/api/ai/lesson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId,
          action,
          userQuery: queryOverride || (action === "explain" && customQuery ? customQuery : undefined),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to execute AI tool");
      }

      if (action === "quiz") {
        setQuizQuestions(data.data.quiz || []);
      } else {
        setContent(data.data.content || "");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!content) return;
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOptionSelect = (questionIndex: number, optionIndex: number) => {
    if (selectedAnswers[questionIndex] !== undefined) return; // Prevent changing after answer
    setSelectedAnswers((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  };

  return (
    <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-b from-indigo-950/20 via-zinc-900/60 to-zinc-900/80 p-5 shadow-xl space-y-4">
      {/* Header with Accordion Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
              Lesson AI Mentor
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-400 border border-indigo-800/60">
                Interactive
              </span>
            </h3>
            <p className="text-xs text-zinc-400">
              Get on-demand explanations, summaries, or test your comprehension.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="text-zinc-400 hover:text-zinc-200 p-1.5 rounded-lg hover:bg-zinc-800/60 transition-colors"
          aria-label={isOpen ? "Collapse AI tools" : "Expand AI tools"}
        >
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {isOpen && (
        <div className="space-y-4 pt-2">
          {/* Action Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {actions.map((act) => {
              const Icon = act.icon;
              const isSelected = activeAction === act.id && !isLoading;
              return (
                <button
                  key={act.id}
                  type="button"
                  onClick={() => handleTriggerAction(act.id)}
                  disabled={isLoading}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                    isSelected
                      ? "bg-indigo-600/20 border-indigo-500 text-indigo-200 shadow-sm"
                      : "bg-zinc-900/80 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/60 text-zinc-300"
                  } disabled:opacity-50`}
                >
                  <Icon className="w-4 h-4 mb-1.5 text-indigo-400" />
                  <span className="text-xs font-semibold">{act.label}</span>
                  <span className="text-[10px] text-zinc-500 line-clamp-1 mt-0.5">
                    {act.desc}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Optional specific question for explain */}
          <div className="flex gap-2">
            <input
              type="text"
              value={customQuery}
              onChange={(e) => setCustomQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (customQuery.trim()) {
                    handleTriggerAction("explain", customQuery.trim());
                  }
                }
              }}
              placeholder="Ask a specific question about this lesson..."
              className="flex-1 px-3.5 py-2 bg-zinc-950/60 border border-zinc-800 rounded-xl text-xs text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
            <button
              type="button"
              onClick={() => {
                if (customQuery.trim()) {
                  handleTriggerAction("explain", customQuery.trim());
                }
              }}
              disabled={isLoading || !customQuery.trim()}
              className="px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 rounded-xl text-xs text-zinc-200 font-medium flex items-center gap-1.5 transition-colors"
            >
              <span>Ask</span>
              <Send className="w-3 h-3" />
            </button>
          </div>

          {/* Loading Indicator */}
          {isLoading && (
            <div className="p-8 text-center rounded-xl bg-zinc-950/50 border border-zinc-800/80 space-y-3">
              <Loader2 className="w-6 h-6 animate-spin text-indigo-400 mx-auto" />
              <p className="text-xs text-zinc-400 font-medium">
                Analyzing lesson &ldquo;{lessonTitle}&rdquo; and generating AI response...
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-950/40 border border-red-800/60 rounded-xl text-xs text-red-300 flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Text Result Display */}
          {content && !isLoading && (
            <div className="p-5 bg-zinc-950/80 border border-zinc-800 rounded-xl space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  AI {activeAction?.replace("_", " ")}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="p-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg transition-colors text-xs flex items-center gap-1"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setContent(null);
                      setActiveAction(null);
                    }}
                    className="p-1.5 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 rounded-lg transition-colors text-xs"
                    title="Dismiss"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="prose prose-invert max-w-none text-zinc-200 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                {content}
              </div>
            </div>
          )}

          {/* Interactive Quiz Display */}
          {quizQuestions && quizQuestions.length > 0 && !isLoading && (
            <div className="p-5 bg-zinc-950/80 border border-zinc-800 rounded-xl space-y-6">
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5" />
                  Knowledge Check Quiz ({quizQuestions.length} Questions)
                </span>

                <button
                  type="button"
                  onClick={() => handleTriggerAction("quiz")}
                  className="inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Regenerate Quiz</span>
                </button>
              </div>

              <div className="space-y-6">
                {quizQuestions.map((q, qIdx) => {
                  const userAnswer = selectedAnswers[qIdx];
                  const hasAnswered = userAnswer !== undefined;
                  const isCorrect = hasAnswered && userAnswer === q.correctIndex;

                  return (
                    <div
                      key={qIdx}
                      className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3"
                    >
                      <h4 className="text-xs sm:text-sm font-semibold text-zinc-100">
                        {qIdx + 1}. {q.question}
                      </h4>

                      <div className="space-y-2">
                        {q.options.map((opt, optIdx) => {
                          let btnStyle =
                            "bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700";

                          if (hasAnswered) {
                            if (optIdx === q.correctIndex) {
                              btnStyle =
                                "bg-emerald-950/50 border-emerald-600 text-emerald-300 font-medium";
                            } else if (optIdx === userAnswer) {
                              btnStyle =
                                "bg-red-950/50 border-red-600 text-red-300 font-medium";
                            } else {
                              btnStyle = "bg-zinc-900/40 border-zinc-850 text-zinc-500 opacity-60";
                            }
                          }

                          return (
                            <button
                              key={optIdx}
                              type="button"
                              onClick={() => handleOptionSelect(qIdx, optIdx)}
                              disabled={hasAnswered}
                              className={`w-full p-2.5 rounded-lg border text-left text-xs transition-all flex items-start gap-2.5 ${btnStyle}`}
                            >
                              <span className="font-bold text-zinc-400 uppercase text-[11px] mt-0.5">
                                {String.fromCharCode(65 + optIdx)}.
                              </span>
                              <span className="flex-1">{opt}</span>
                            </button>
                          );
                        })}
                      </div>

                      {hasAnswered && (
                        <div
                          className={`p-3 rounded-lg text-xs leading-relaxed ${
                            isCorrect
                              ? "bg-emerald-950/40 text-emerald-300 border border-emerald-800/40"
                              : "bg-amber-950/40 text-amber-300 border border-amber-800/40"
                          }`}
                        >
                          <span className="font-semibold block mb-0.5">
                            {isCorrect ? "✓ Correct!" : "✗ Review Explanation:"}
                          </span>
                          {q.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
