import type { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface AnalyticsStatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  growth?: {
    value: number;
    isPositive?: boolean;
    period?: string;
  };
  badge?: {
    label: string;
    variant?: "success" | "warning" | "info" | "neutral";
  };
  iconColor?: string;
}

export function AnalyticsStatCard({
  title,
  value,
  icon: Icon,
  description,
  growth,
  badge,
  iconColor = "text-amber-400",
}: AnalyticsStatCardProps) {
  const badgeVariants = {
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    info: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    neutral: "bg-zinc-800 text-zinc-400 border-zinc-700",
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5 backdrop-blur transition-all hover:border-zinc-700/80">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-zinc-400">{title}</span>
        <div className={`rounded-xl bg-zinc-800/80 p-2 ${iconColor}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-3xl font-extrabold tracking-tight text-white">
          {typeof value === "number" ? value.toLocaleString() : value}
        </span>

        {growth !== undefined && (
          <span
            className={`inline-flex items-center gap-0.5 text-xs font-semibold ${
              growth.isPositive !== false ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {growth.isPositive !== false ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {growth.value > 0 ? `+${growth.value}%` : `${growth.value}%`}
          </span>
        )}
      </div>

      {(description || badge) && (
        <div className="mt-3 flex items-center justify-between gap-2 border-t border-zinc-800/60 pt-2.5">
          {description && (
            <p className="text-[11px] text-zinc-500 truncate">{description}</p>
          )}
          {badge && (
            <span
              className={`inline-flex shrink-0 items-center rounded-md border px-2 py-0.5 text-[10px] font-semibold ${
                badgeVariants[badge.variant || "neutral"]
              }`}
            >
              {badge.label}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
