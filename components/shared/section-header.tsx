import * as React from "react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function SectionHeader({
  title,
  description,
  action,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between mb-4",
        className
      )}
    >
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
          {title}
        </h2>
        {description && (
          <p className="text-xs text-muted-foreground sm:text-sm mt-0.5">
            {description}
          </p>
        )}
      </div>

      {action && <div className="mt-2 sm:mt-0 flex items-center gap-2">{action}</div>}
    </div>
  );
}
