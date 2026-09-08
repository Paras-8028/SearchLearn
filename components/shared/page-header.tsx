import * as React from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  badge?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  badge,
  title,
  description,
  action,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 border-b border-border/60 pb-6 sm:flex-row sm:items-end sm:justify-between",
        className
      )}
    >
      <div className="space-y-1.5 max-w-2xl">
        {badge && <div className="mb-2 inline-block">{badge}</div>}
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-muted-foreground sm:text-base leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {action && <div className="flex shrink-0 items-center gap-3">{action}</div>}
    </div>
  );
}
