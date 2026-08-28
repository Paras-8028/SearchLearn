import Link from "next/link";
import { Search } from "lucide-react";

export function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 font-semibold tracking-tight"
    >
      <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Search className="size-4" />
      </span>

      <span className="text-lg">SearchLearn</span>
    </Link>
  );
}