import Link from "next/link";
import { getCourses } from "@/lib/db/repositories/courses";
import { getModulesByCourseId } from "@/lib/db/repositories/modules";
import { getLessonsByCourseId } from "@/lib/db/repositories/lessons";
import { CourseCard } from "@/components/courses/course-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Search, Sparkles, SlidersHorizontal, X } from "lucide-react";

export const revalidate = 0;

interface CoursesPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    level?: string;
  }>;
}

const CATEGORIES = [
  "Web Development",
  "Machine Learning",
  "Systems & Cloud",
  "Data Engineering",
];

const LEVELS = ["beginner", "intermediate", "advanced"];

export default async function CoursesPage({ searchParams }: CoursesPageProps) {
  const { q, category, level } = await searchParams;

  const courses = await getCourses({
    publishedOnly: true,
    search: q,
    category,
    level,
  });

  const coursesWithDetails = await Promise.all(
    courses.map(async (course) => {
      const modules = await getModulesByCourseId(course._id);
      const lessons = await getLessonsByCourseId(course._id);
      const totalDuration = lessons.reduce((acc, l) => acc + (l.duration || 0), 0);

      return {
        course,
        moduleCount: modules.length,
        lessonCount: lessons.length,
        totalDuration,
      };
    })
  );

  const hasActiveFilters = Boolean(q || category || level);

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-background py-10 lg:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Page Header */}
        <div className="flex flex-col gap-3 border-b border-border/60 pb-6">
          <Badge variant="indigo" className="w-fit">
            <Sparkles className="size-3.5" />
            <span>Curated Curriculum</span>
          </Badge>

          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Explore Courses
          </h1>

          <p className="text-sm text-muted-foreground sm:text-base max-w-2xl leading-relaxed">
            Discover production-style courses, deep-dive into modular lessons, and build verified engineering and AI skills.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="space-y-4 rounded-2xl border border-border/80 bg-card/60 p-4 sm:p-6 backdrop-blur-sm shadow-sm">
          <form method="GET" action="/courses" className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                name="q"
                defaultValue={q || ""}
                placeholder="Search courses by topic, concept, or title..."
                className="h-10 w-full rounded-xl border border-border bg-card pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {category && <input type="hidden" name="category" value={category} />}
            {level && <input type="hidden" name="level" value={level} />}

            <button
              type="submit"
              className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-primary px-5 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors cursor-pointer"
            >
              <Search className="size-3.5" />
              <span>Filter</span>
            </button>

            {hasActiveFilters && (
              <Link
                href="/courses"
                className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-4 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="size-3.5" />
                <span>Reset</span>
              </Link>
            )}
          </form>

          {/* Category Filter Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/40 text-xs">
            <span className="text-muted-foreground font-medium mr-1 flex items-center gap-1">
              <SlidersHorizontal className="size-3.5" />
              <span>Category:</span>
            </span>

            <Link
              href={`/courses?${new URLSearchParams({
                ...(q && { q }),
                ...(level && { level }),
              }).toString()}`}
              className={`rounded-lg px-3 py-1 font-medium transition-all ${
                !category
                  ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                  : "bg-secondary/70 text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              All Categories
            </Link>

            {CATEGORIES.map((cat) => {
              const isActive = category === cat;
              return (
                <Link
                  key={cat}
                  href={`/courses?${new URLSearchParams({
                    ...(q && { q }),
                    category: cat,
                    ...(level && { level }),
                  }).toString()}`}
                  className={`rounded-lg px-3 py-1 font-medium transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                      : "bg-secondary/70 text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  {cat}
                </Link>
              );
            })}
          </div>

          {/* Level Filter Chips */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-muted-foreground font-medium mr-1">Level:</span>
            <Link
              href={`/courses?${new URLSearchParams({
                ...(q && { q }),
                ...(category && { category }),
              }).toString()}`}
              className={`rounded-lg px-2.5 py-0.5 capitalize transition-all ${
                !level
                  ? "bg-indigo-950/60 text-indigo-300 border border-indigo-800/60 font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              All Levels
            </Link>

            {LEVELS.map((lvl) => {
              const isActive = level === lvl;
              return (
                <Link
                  key={lvl}
                  href={`/courses?${new URLSearchParams({
                    ...(q && { q }),
                    ...(category && { category }),
                    level: lvl,
                  }).toString()}`}
                  className={`rounded-lg px-2.5 py-0.5 capitalize transition-all ${
                    isActive
                      ? "bg-indigo-950/60 text-indigo-300 border border-indigo-800/60 font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {lvl}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Course Grid or Empty State */}
        {coursesWithDetails.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {coursesWithDetails.map(({ course, moduleCount, lessonCount, totalDuration }) => (
              <CourseCard
                key={course._id}
                course={course}
                moduleCount={moduleCount}
                lessonCount={lessonCount}
                totalDuration={totalDuration}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={BookOpen}
            title="No matching courses found"
            description={
              hasActiveFilters
                ? `No courses matched your current filter selection. Try adjusting your query or resetting filters.`
                : "No published courses are currently available in the catalog."
            }
            action={
              hasActiveFilters ? (
                <Link
                  href="/courses"
                  className="inline-flex h-9 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
                >
                  <span>Clear All Filters</span>
                </Link>
              ) : null
            }
          />
        )}
      </div>
    </main>
  );
}