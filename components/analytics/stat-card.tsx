import type { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown } from "lucide-react";

export interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    label?: string;
    isPositive?: boolean;
  };
  badge?: string;
  iconClassName?: string;
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  badge,
  iconClassName = "text-amber-400 bg-amber-500/10",
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5 backdrop-blur transition-all hover:border-zinc-700/80">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-zinc-400">{title}</span>
        <div className={`rounded-xl p-2 ${iconClassName}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-3xl font-extrabold tracking-tight text-white">
          {typeof value === "number" ? value.toLocaleString() : value}
        </span>

        {trend && (
          <span
            className={`inline-flex items-center gap-0.5 text-xs font-semibold ${
              trend.isPositive !== false ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {trend.isPositive !== false ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {trend.value > 0 ? `+${trend.value}%` : `${trend.value}%`}
          </span>
        )}
      </div>

      {(description || badge) && (
        <div className="mt-3 flex items-center justify-between gap-2 border-t border-zinc-800/60 pt-2.5 text-xs">
          {description && (
            <p className="text-[11px] text-zinc-500 truncate">{description}</p>
          )}
          {badge && (
            <span className="inline-flex shrink-0 items-center rounded-md border border-zinc-700 bg-zinc-800 px-2 py-0.5 text-[10px] font-semibold text-zinc-300">
              {badge}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
