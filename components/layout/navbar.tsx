import Link from "next/link";
import { Show, UserButton } from "@clerk/nextjs";

import { Logo } from "./logo";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Logo />

        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/search"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Search
          </Link>

          <Link
            href="/ask"
            className="text-sm font-medium text-indigo-400 transition-colors hover:text-indigo-300 flex items-center gap-1.5"
          >
            Ask AI
          </Link>

          <Link
            href="/courses"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Courses
          </Link>

          <Link
            href="/documents"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Documents
          </Link>

          <Link
            href="/learn"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Learn
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Show when="signed-out">
            <Link
              href="/sign-in"
              className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Sign in
            </Link>

            <Link
              href="/sign-up"
              className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Get started
            </Link>
          </Show>

          <Show when="signed-in">
            <UserButton />
          </Show>
        </div>
      </div>
    </header>
  );
}