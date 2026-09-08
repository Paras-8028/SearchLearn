import * as React from "react";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/70 bg-card/40 p-8 text-center sm:p-12 transition-colors",
        className
      )}
    >
      <div className="flex size-14 items-center justify-center rounded-2xl bg-muted/80 text-muted-foreground ring-1 ring-border/50 mb-4">
        <Icon className="size-6 text-muted-foreground" />
      </div>

      <h3 className="text-base font-semibold text-foreground tracking-tight sm:text-lg">
        {title}
      </h3>

      <p className="mt-1.5 max-w-sm text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>

      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
