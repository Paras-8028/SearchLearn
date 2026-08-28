import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";

interface DashboardCardProps {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
}

export function DashboardCard({
  title,
  description,
  href,
  icon: Icon,
}: DashboardCardProps) {
  return (
    <Link
      href={href}
      className="group rounded-xl border bg-card p-6 transition-colors hover:bg-muted/50"
    >
      <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
        <Icon className="size-5 text-primary" />
      </div>

      <h2 className="mt-5 font-semibold">{title}</h2>

      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {description}
      </p>

      <div className="mt-5 flex items-center text-sm font-medium text-primary">
        Open
        <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}