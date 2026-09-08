import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";

interface DashboardCardProps {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
}

export function DashboardCard({
  title,
  description,
  href,
  icon: Icon,
  badge,
}: DashboardCardProps) {
  return (
    <Link
      href={href}
      className="group relative flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-6 shadow-sm transition-all duration-200 hover:border-primary/40 hover:bg-card/90 hover:shadow-lg hover:shadow-indigo-500/5"
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex size-11 items-center justify-center rounded-xl bg-secondary ring-1 ring-border/70 transition-colors group-hover:bg-primary/10 group-hover:ring-primary/30">
            <Icon className="size-5 text-indigo-400 group-hover:text-primary transition-colors" />
          </div>
          {badge && (
            <span className="rounded-full bg-secondary/80 px-2.5 py-0.5 text-[10px] font-semibold text-muted-foreground border border-border/40">
              {badge}
            </span>
          )}
        </div>

        <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
          {title}
        </h3>

        <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>

      <div className="mt-5 flex items-center text-xs font-semibold text-primary/90 group-hover:text-primary pt-2 border-t border-border/40">
        <span>Open</span>
        <ArrowRight className="ml-1.5 size-3.5 transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}