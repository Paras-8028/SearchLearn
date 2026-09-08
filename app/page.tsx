import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Brain,
  Search,
  Sparkles,
  Zap,
  FileText,
  GraduationCap,
  Flame,
} from "lucide-react";

import { Container } from "@/components/layout/container";
import { SearchBar } from "@/components/search/search-bar";
import { Badge } from "@/components/ui/badge";

const suggestions = [
  "JavaScript Promises",
  "React useEffect",
  "Machine Learning Basics",
  "Database Normalization",
];

const values = [
  {
    icon: Search,
    title: "Search everything",
    description:
      "Find information seamlessly across courses, video transcripts, notes, and uploaded documentation.",
  },
  {
    icon: Brain,
    title: "Understand faster",
    description:
      "Get AI-powered explanations grounded directly in your syllabus with instant source citations.",
  },
  {
    icon: GraduationCap,
    title: "Learn with context",
    description:
      "Jump immediately to the exact lesson where each concept is introduced and master it in sequence.",
  },
];

const steps = [
  {
    number: "01",
    title: "Add Learning Content",
    description:
      "Enroll in structured courses or upload your own PDFs, Markdown guides, and technical documents.",
  },
  {
    number: "02",
    title: "Search Naturally",
    description:
      "Use semantic questions or keywords. Vector embeddings surface exact conceptual matches.",
  },
  {
    number: "03",
    title: "Get Grounded AI Answers",
    description:
      "Receive pedagogical explanations synthesized exclusively from your verified library.",
  },
  {
    number: "04",
    title: "Master & Track Progress",
    description:
      "Complete lessons, test yourself with AI quizzes, and maintain your learning streak.",
  },
];

const features = [
  {
    icon: Search,
    title: "Semantic Vector Search",
    badge: "AI-Powered",
    description:
      "Search across course lessons and uploaded notes using 1536-dimensional embeddings with cosine similarity fallback.",
  },
  {
    icon: Sparkles,
    title: "AI Learning Mentor",
    badge: "Grounded RAG",
    description:
      "Ask complex conceptual questions and receive comprehensive answers with inline source citations.",
  },
  {
    icon: BookOpen,
    title: "Curriculum Management",
    badge: "Modular",
    description:
      "Structured courses partitioned into sequential modules and rich video, article, and document lessons.",
  },
  {
    icon: FileText,
    title: "Document Intelligence",
    badge: "PDF / MD",
    description:
      "Drop technical papers, notes, or slides. SmartLearn extracts text, chunks content, and indexes embeddings.",
  },
  {
    icon: Flame,
    title: "Progress & Streaks",
    badge: "Analytics",
    description:
      "Track completion rates, active learning streaks, and 7-day consistency metrics directly in your workspace.",
  },
  {
    icon: Zap,
    title: "AI Lesson Tools",
    badge: "Interactive",
    description:
      "Instant summarization, conceptual simplification, and auto-generated quizzes for every lesson.",
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex flex-1 flex-col">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-border/60 py-20 lg:py-28">
          {/* Subtle ambient lighting */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 -top-24 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary/15 blur-[140px]" />
            <div className="absolute top-1/2 left-1/4 h-[350px] w-[600px] -translate-y-1/2 rounded-full bg-indigo-900/10 blur-[120px]" />
          </div>

          {/* Grid pattern */}
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]" />

          <Container className="relative flex flex-col items-center justify-center text-center">
            <Badge variant="indigo" className="mb-6 px-3.5 py-1 text-xs">
              <Sparkles className="size-3.5 text-indigo-400" />
              <span>Next-Generation AI Learning Platform</span>
            </Badge>

            <h1 className="max-w-4xl text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
              Search your knowledge. <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-indigo-400 via-primary to-indigo-300 bg-clip-text text-transparent">
                Understand anything.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg sm:leading-relaxed">
              SmartLearn connects your courses, video transcripts, notes, and documents
              with natural language search and grounded AI mentoring.
            </p>

            {/* Search Hero Box */}
            <div className="mt-10 w-full max-w-2xl">
              <div className="rounded-3xl border border-border/80 bg-card/70 p-2.5 shadow-2xl backdrop-blur-xl">
                <SearchBar placeholder="What do you want to learn today?" />
              </div>

              {/* Clickable Suggestion Chips */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
                <span className="text-muted-foreground/70">Try searching:</span>
                {suggestions.map((suggestion) => (
                  <Link
                    key={suggestion}
                    href={`/search?q=${encodeURIComponent(suggestion)}`}
                    className="rounded-lg border border-border/70 bg-card/60 px-2.5 py-1 text-xs font-medium text-foreground transition-all hover:border-primary/50 hover:bg-card hover:text-primary"
                  >
                    {suggestion}
                  </Link>
                ))}
              </div>
            </div>

            {/* Hero CTAs */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/courses"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-7 text-sm font-semibold text-primary-foreground shadow-lg shadow-indigo-500/20 transition-all hover:bg-primary/90 hover:scale-[1.02]"
              >
                <span>Start Learning</span>
                <ArrowRight className="size-4" />
              </Link>

              <Link
                href="/ask"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-card/70 px-7 text-sm font-semibold text-foreground transition-all hover:bg-card hover:border-border-hover"
              >
                <Sparkles className="size-4 text-indigo-400" />
                <span>Ask AI Mentor</span>
              </Link>
            </div>
          </Container>
        </section>

        {/* Trust & Core Values */}
        <section className="border-b border-border/60 py-16 bg-card/15">
          <Container>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {values.map((val) => {
                const Icon = val.icon;
                return (
                  <div
                    key={val.title}
                    className="group rounded-2xl border border-border/70 bg-card/50 p-6 transition-all duration-200 hover:border-primary/40 hover:bg-card"
                  >
                    <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20 mb-4 transition-transform group-hover:scale-105">
                      <Icon className="size-5 text-primary" />
                    </div>
                    <h3 className="text-base font-semibold text-foreground tracking-tight">
                      {val.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      {val.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </Container>
        </section>

        {/* How It Works Flow */}
        <section className="border-b border-border/60 py-20 lg:py-24">
          <Container>
            <div className="text-center max-w-2xl mx-auto mb-14">
              <Badge variant="secondary" className="mb-3 px-3 py-0.5 text-xs">
                Workflow
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                How SmartLearn Works
              </h2>
              <p className="mt-3 text-sm text-muted-foreground sm:text-base">
                A modern learning pipeline that converts static materials into interactive, searchable knowledge.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className="relative rounded-2xl border border-border/70 bg-card/60 p-6 backdrop-blur-sm transition-all hover:border-border-hover"
                >
                  <div className="text-2xl font-mono font-bold text-primary/80 mb-3">
                    {step.number}
                  </div>
                  <h3 className="text-base font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* Features Grid */}
        <section className="border-b border-border/60 py-20 lg:py-24 bg-card/10">
          <Container>
            <div className="text-center max-w-2xl mx-auto mb-14">
              <Badge variant="indigo" className="mb-3 px-3 py-0.5 text-xs">
                Platform Capabilities
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Engineered for Serious Learning
              </h2>
              <p className="mt-3 text-sm text-muted-foreground sm:text-base">
                Built from the ground up with vector retrieval, MongoDB native architecture, and pedagogical AI tools.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feat) => {
                const Icon = feat.icon;
                return (
                  <div
                    key={feat.title}
                    className="group rounded-2xl border border-border/70 bg-card p-6 shadow-sm transition-all duration-200 hover:border-primary/40 hover:shadow-lg hover:shadow-indigo-500/5"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex size-10 items-center justify-center rounded-xl bg-secondary ring-1 ring-border/80">
                        <Icon className="size-5 text-indigo-400" />
                      </div>
                      <span className="rounded-full bg-secondary/80 px-2.5 py-0.5 text-[10px] font-semibold text-muted-foreground border border-border/40">
                        {feat.badge}
                      </span>
                    </div>

                    <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                      {feat.title}
                    </h3>
                    <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                      {feat.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </Container>
        </section>

        {/* Final CTA Banner */}
        <section className="py-20 lg:py-24">
          <Container>
            <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-card via-card/90 to-primary/10 p-8 sm:p-12 lg:p-16 text-center shadow-2xl">
              <div className="relative z-10 max-w-2xl mx-auto space-y-4">
                <Badge variant="indigo" className="mb-2">
                  Get Started Today
                </Badge>
                <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                  Ready to learn smarter?
                </h2>
                <p className="text-sm text-muted-foreground sm:text-base leading-relaxed">
                  Start searching across our course library, uploading documents, and receiving grounded answers right now.
                </p>
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link
                    href="/sign-up"
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-8 text-sm font-semibold text-primary-foreground shadow-lg shadow-indigo-500/25 transition-all hover:bg-primary/90 hover:scale-[1.02]"
                  >
                    <span>Create Free Account</span>
                    <ArrowRight className="size-4" />
                  </Link>
                  <Link
                    href="/courses"
                    className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-card px-7 text-sm font-semibold text-foreground hover:bg-muted/70 transition-colors"
                  >
                    Browse Courses
                  </Link>
                </div>
              </div>
            </div>
          </Container>
        </section>
      </main>
    </div>
  );
}