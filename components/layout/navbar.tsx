import Link from "next/link";
import { Show, UserButton } from "@clerk/nextjs";
import { Sparkles, ArrowRight } from "lucide-react";

import { Logo } from "./logo";
import { MobileNav } from "./mobile-nav";
import { getCurrentSearchLearnUser } from "@/lib/auth/current-user";
import { serializeUser } from "@/lib/db/repositories/users";

export async function Navbar() {
  let user = null;
  try {
    user = await getCurrentSearchLearnUser();
  } catch {
    // Unauthenticated or guest
  }

  const serializedUser = user ? serializeUser(user) : null;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/80 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Logo />

          <nav className="hidden items-center gap-1 md:flex">
            <Link
              href="/search"
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
            >
              Search
            </Link>

            <Link
              href="/ask"
              className="group flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-indigo-400 transition-colors hover:bg-indigo-950/40 hover:text-indigo-300"
            >
              <Sparkles className="size-3.5 text-indigo-400 transition-transform group-hover:scale-110" />
              <span>Ask AI</span>
            </Link>

            <Link
              href="/courses"
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
            >
              Courses
            </Link>

            <Link
              href="/documents"
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
            >
              Documents
            </Link>

            <Link
              href="/learn"
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
            >
              Learn
            </Link>

            {user && (
              <Link
                href="/dashboard"
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
              >
                Dashboard
              </Link>
            )}

            {(user?.role === "instructor" || user?.role === "admin") && (
              <Link
                href="/instructor"
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-indigo-400 transition-colors hover:bg-indigo-950/40 hover:text-indigo-300"
              >
                Instructor
              </Link>
            )}

            {user?.role === "admin" && (
              <Link
                href="/admin"
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-amber-400 transition-colors hover:bg-amber-950/40 hover:text-amber-300"
              >
                Admin
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex sm:items-center sm:gap-2.5">
            <Show when="signed-out">
              <Link
                href="/sign-in"
                className="inline-flex h-9 items-center justify-center rounded-xl border border-border bg-card/60 px-4 text-xs font-medium text-foreground transition-colors hover:bg-card hover:border-border-hover"
              >
                Sign in
              </Link>

              <Link
                href="/sign-up"
                className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-primary px-4 text-xs font-semibold text-primary-foreground shadow-sm shadow-indigo-500/25 transition-all hover:bg-primary/90 hover:scale-[1.02]"
              >
                <span>Get started</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </Show>

            <Show when="signed-in">
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: "size-8 border border-border/80",
                  },
                }}
              />
            </Show>
          </div>

          {/* Responsive Mobile Drawer Trigger */}
          <MobileNav user={serializedUser} />
        </div>
      </div>
    </header>
  );
}