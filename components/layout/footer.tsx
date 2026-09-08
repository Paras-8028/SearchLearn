import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Container } from "./container";
import { Logo } from "./logo";

export function Footer() {
  return (
    <footer className="border-t border-border/70 bg-card/20 transition-colors">
      <Container className="py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-5">
          <div className="space-y-3 md:col-span-2">
            <Logo />
            <p className="text-xs font-medium text-indigo-400">
              Learn smarter. Search deeper.
            </p>
            <p className="max-w-sm text-xs text-muted-foreground leading-relaxed">
              An enterprise-ready, AI-powered learning platform with vector search, grounded AI mentoring, and curriculum tracking.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Platform
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link href="/search" className="transition-colors hover:text-foreground">
                  Semantic Search
                </Link>
              </li>
              <li>
                <Link href="/ask" className="transition-colors hover:text-foreground flex items-center gap-1">
                  <span>Ask AI</span>
                  <Sparkles className="size-3 text-indigo-400" />
                </Link>
              </li>
              <li>
                <Link href="/courses" className="transition-colors hover:text-foreground">
                  Course Catalog
                </Link>
              </li>
              <li>
                <Link href="/documents" className="transition-colors hover:text-foreground">
                  Document Knowledge
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Learning
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link href="/learn" className="transition-colors hover:text-foreground">
                  Interactive Lessons
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="transition-colors hover:text-foreground">
                  Student Dashboard
                </Link>
              </li>
              <li>
                <Link href="/search/history" className="transition-colors hover:text-foreground">
                  Search History
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Access
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link href="/sign-in" className="transition-colors hover:text-foreground">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/sign-up" className="transition-colors hover:text-foreground">
                  Create Account
                </Link>
              </li>
              <li>
                <Link href="/instructor" className="transition-colors hover:text-foreground">
                  Instructor Studio
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/50 pt-8 sm:flex-row text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} SmartLearn. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="text-[11px] text-muted-foreground/80">Built with Next.js 16, MongoDB & OpenAI</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}