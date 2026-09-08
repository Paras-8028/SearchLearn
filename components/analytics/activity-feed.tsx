import type { PlatformActivityDTO } from "@/types/activity";
import {
  GraduationCap,
  Search,
  Sparkles,
  BookOpen,
  FileText,
  User,
  ShieldAlert,
  Clock,
} from "lucide-react";

interface ActivityFeedProps {
  activities: PlatformActivityDTO[];
  emptyMessage?: string;
}

function formatRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHours = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSec < 60) return "just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  } catch {
    return dateString;
  }
}

function getCategoryMeta(category: string, type: string) {
  const cat = (category || "").toUpperCase();
  const evt = (type || "").toUpperCase();

  if (cat === "LEARNING" || evt.includes("LESSON") || evt.includes("ENROLL")) {
    return {
      icon: GraduationCap,
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      badge: "Learning",
    };
  }
  if (cat === "SEARCH" || evt.includes("SEARCH")) {
    return {
      icon: Search,
      color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
      badge: "Search",
    };
  }
  if (cat === "AI" || evt.includes("AI")) {
    return {
      icon: Sparkles,
      color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
      badge: "AI Assist",
    };
  }
  if (cat === "COURSE" || evt.includes("COURSE")) {
    return {
      icon: BookOpen,
      color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
      badge: "Course",
    };
  }
  if (cat === "DOCUMENT" || evt.includes("DOC")) {
    return {
      icon: FileText,
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
      badge: "Document",
    };
  }
  if (cat === "ADMIN" || evt.includes("ROLE") || evt.includes("INDEX")) {
    return {
      icon: ShieldAlert,
      color: "text-rose-400 bg-rose-500/10 border-rose-500/20",
      badge: "Admin",
    };
  }

  return {
    icon: User,
    color: "text-zinc-400 bg-zinc-800 border-zinc-700",
    badge: "User",
  };
}

export function ActivityFeed({
  activities,
  emptyMessage = "No recent platform activity recorded.",
}: ActivityFeedProps) {
  if (!activities || activities.length === 0) {
    return (
      <div className="py-10 text-center rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/40">
        <Clock className="h-6 w-6 text-zinc-600 mx-auto mb-2" />
        <p className="text-xs text-zinc-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-zinc-800/60">
      {activities.map((act) => {
        const meta = getCategoryMeta(act.category, act.type || act.eventType);
        const Icon = meta.icon;

        return (
          <div
            key={act._id}
            className="py-3.5 flex items-start justify-between gap-4 text-xs transition-colors hover:bg-zinc-900/30 px-2 rounded-xl"
          >
            <div className="flex items-start gap-3 min-w-0">
              <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl border ${meta.color}`}>
                <Icon className="h-3.5 w-3.5" />
              </div>

              <div className="min-w-0">
                <p className="font-medium text-zinc-200 leading-snug">
                  {act.message}
                </p>

                <div className="flex items-center gap-2 mt-1 text-[11px] text-zinc-500">
                  <span className={`inline-flex items-center rounded-md border px-1.5 py-0.2 text-[10px] font-semibold ${meta.color}`}>
                    {meta.badge}
                  </span>
                  {act.userName && (
                    <>
                      <span>•</span>
                      <span className="truncate max-w-[120px]">{act.userName}</span>
                    </>
                  )}
                  <span>•</span>
                  <span>{formatRelativeTime(act.createdAt)}</span>
                </div>
              </div>
            </div>

            <span className="shrink-0 text-[10px] text-zinc-500 mt-1 hidden sm:inline-block">
              {new Date(act.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
        );
      })}
    </div>
  );
}
