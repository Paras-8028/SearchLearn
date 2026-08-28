import { ArrowRight, BookOpen, Brain, Search } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Navbar } from "@/components/layout/navbar";
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
      "Use AI-powered answers and explanations to understand difficult concepts.",
  },
  {
    icon: BookOpen,
    title: "Learn your way",
    description:
      "Jump directly to the lesson or timestamp where the answer is explained.",
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        <section className="border-b">
          <Container className="flex flex-col items-center px-6 py-24 text-center md:py-32">
            <div className="mb-6 rounded-full border bg-muted px-4 py-2 text-sm text-muted-foreground">
              AI-powered learning search
            </div>

            <h1 className="max-w-4xl text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              Find exactly what you need to{" "}
              <span className="text-primary">learn.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              Search across your entire learning library using natural
              language. Find the exact lesson, video moment, document, or note
              you need.
            </p>

            <div className="mt-10 w-full max-w-2xl">
              <SearchBar />
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/sign-up"
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Start learning
                <ArrowRight className="ml-2 size-4" />
              </Link>

              <Link
                href="/courses"
                className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-6 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                Explore courses
              </Link>
            </div>
          </Container>
        </section>

        <section>
          <Container className="py-20">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight">
                One search. Your entire learning library.
              </h2>

              <p className="mt-4 text-muted-foreground">
                SearchLearn brings your learning resources together so you can
                spend less time searching and more time learning.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {features.map((feature) => {
                const Icon = feature.icon;

                return (
                  <div
                    key={feature.title}
                    className="rounded-xl border bg-card p-6"
                  >
                    <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="size-5 text-primary" />
                    </div>

                    <h3 className="mt-5 text-lg font-semibold">
                      {feature.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
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