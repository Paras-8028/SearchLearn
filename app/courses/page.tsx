import { getCourses } from "@/lib/db/repositories/courses";
import { getModulesByCourseId } from "@/lib/db/repositories/modules";
import { getLessonsByCourseId } from "@/lib/db/repositories/lessons";
import { CourseCard } from "@/components/courses/course-card";
import { BookOpen, Search, Sparkles } from "lucide-react";

export const revalidate = 0;

interface CoursesPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    level?: string;
  }>;
}

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

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-background py-10">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-3">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Explore Course Catalog</span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
              Courses
            </h1>

            <p className="mt-2 text-base text-muted-foreground max-w-xl">
              Explore learning content, master key concepts, and continue building your software and AI skills.
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <form method="GET" action="/courses" className="mt-8">
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              name="q"
              defaultValue={q || ""}
              placeholder="Search courses by title, description, or topic..."
              className="w-full rounded-xl border border-border bg-card py-3.5 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
            />
          </div>
        </form>

        {/* Course Grid */}
        {coursesWithDetails.length > 0 ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
          <div className="mt-12 rounded-2xl border border-dashed border-border/80 p-12 text-center bg-card/20">
            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/40 mb-3" />
            <h3 className="text-lg font-bold text-foreground">No courses available yet</h3>
            <p className="mt-1 text-sm text-muted-foreground max-w-sm mx-auto">
              {q
                ? `No courses matched your query "${q}". Try searching for another keyword.`
                : "Check back soon or run the seed command to load sample courses into the database."}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}