import { ArrowRight, BookOpen, Brain, Search } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Footer } from "@/components/layout/footer";
import { SearchBar } from "@/components/search/search-bar";

const features = [
  {
    icon: Search,
    title: "Search everything",
    description:
      "Find relevant content across courses, videos, transcripts, notes, and documents.",
  },
  {
    icon: Brain,
    title: "Understand faster",
    description:
      "Get AI-powered answers and explanations for difficult concepts.",
  },
  {
    icon: BookOpen,
    title: "Learn your way",
    description:
      "Jump directly to the lesson or video timestamp where the concept is explained.",
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex flex-1 flex-col">
        {/* Hero */}
        <section className="relative flex min-h-[calc(100vh-4rem)] flex-1 items-center overflow-hidden border-b">
          {/* Background glow */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
            <div className="absolute bottom-0 left-1/4 h-[300px] w-[500px] rounded-full bg-primary/5 blur-[100px]" />
          </div>

          {/* Grid background */}
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,oklch(1_0_0_/_0.035)_1px,transparent_1px),linear-gradient(to_bottom,oklch(1_0_0_/_0.035)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_80%)]" />

          <Container className="relative flex w-full flex-col items-center justify-center px-6 py-12 text-center md:py-16">
            {/* Badge */}
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-medium text-primary sm:text-sm">
              <span className="size-1.5 rounded-full bg-primary" />
              AI-powered learning search
            </div>

            {/* Heading */}
            <h1 className="max-w-5xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Find exactly what you need to{" "}
              <span className="text-primary">learn.</span>
            </h1>

            {/* Description */}
            <p className="mt-5 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7 md:text-lg">
              Search across your entire learning library using natural
              language. Find the exact lesson, video moment, document, or note
              you need.
            </p>

            {/* Search */}
            <div className="mt-7 w-full max-w-2xl">
              <SearchBar />
            </div>

            {/* Actions */}
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/sign-up"
                className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-7 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/10 transition-all hover:scale-[1.02] hover:bg-primary/90"
              >
                Start learning
                <ArrowRight className="ml-2 size-4" />
              </Link>

              <Link
                href="/courses"
                className="inline-flex h-11 items-center justify-center rounded-lg border border-border bg-card/60 px-7 text-sm font-semibold transition-colors hover:bg-muted"
              >
                Explore courses
              </Link>
            </div>

            {/* Trust / feature strip */}
            <div className="mt-10 grid w-full max-w-4xl grid-cols-1 gap-3 sm:grid-cols-3">
              {features.map((feature) => {
                const Icon = feature.icon;

                return (
                  <div
                    key={feature.title}
                    className="group rounded-xl border border-border/70 bg-card/60 p-4 text-left backdrop-blur-sm transition-all hover:border-primary/30 hover:bg-card"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20">
                        <Icon className="size-4 text-primary" />
                      </div>

                      <h2 className="text-sm font-semibold">
                        {feature.title}
                      </h2>
                    </div>

                    <p className="mt-3 text-xs leading-5 text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </Container>
        </section>
      </main>

      <Footer />
    </div>
  );
}