import Link from "next/link";
import { type LucideIcon, ArrowUpRight } from "lucide-react";

interface AdminStatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  badge?: {
    label: string;
    variant?: "success" | "warning" | "info" | "neutral";
  };
  href?: string;
  className?: string;
}

export function AdminStatCard({
  title,
  value,
  icon: Icon,
  description,
  badge,
  href,
  className = "",
}: AdminStatCardProps) {
  const badgeStyles = {
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    info: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    neutral: "bg-zinc-800/80 text-zinc-400 border-zinc-700/50",
  }[badge?.variant || "neutral"];

  const content = (
    <div
      className={`group relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5 backdrop-blur transition-all duration-200 hover:border-zinc-700 hover:bg-zinc-900/90 ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950 text-indigo-400 group-hover:border-zinc-700 group-hover:text-indigo-300 transition-colors">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-zinc-400">{title}</p>
            <h3 className="mt-0.5 text-2xl font-bold tracking-tight text-white">
              {typeof value === "number" ? value.toLocaleString() : value}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {badge && (
            <span
              className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-medium ${badgeStyles}`}
            >
              {badge.label}
            </span>
          )}
          {href && (
            <ArrowUpRight className="h-4 w-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
          )}
        </div>
      </div>

      {description && (
        <p className="mt-3 text-xs text-zinc-500 line-clamp-1">{description}</p>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {content}
      </Link>
    );
  }

  return content;
}
