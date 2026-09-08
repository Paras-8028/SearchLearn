import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { getCourseById, getCourseBySlug } from "@/lib/db/repositories/courses";
import { getModulesByCourseId } from "@/lib/db/repositories/modules";
import { getLessonsByModuleId, getLessonsByCourseId } from "@/lib/db/repositories/lessons";
import { getEnrollment } from "@/lib/db/repositories/enrollments";
import { getCompletedLessonIds } from "@/lib/db/repositories/lesson-progress";
import { CourseHeader } from "@/components/courses/course-header";
import { ModuleList, type ModuleWithLessonsDTO } from "@/components/courses/module-list";
import { Badge } from "@/components/ui/badge";
import {
  Layers,
  BookOpen,
  Clock,
  Sparkles,
  CheckCircle2,
  User,
  PlayCircle,
  BarChart2,
} from "lucide-react";

export const revalidate = 0;

interface CourseDetailsPageProps {
  params: Promise<{
    courseId: string;
  }>;
}

export default async function CourseDetailsPage({ params }: CourseDetailsPageProps) {
  const { courseId } = await params;

  let course = await getCourseById(courseId);
  if (!course) {
    course = await getCourseBySlug(courseId);
  }

  if (!course) {
    notFound();
  }

  const { userId } = await auth();

  const modules = await getModulesByCourseId(course._id);
  const lessons = await getLessonsByCourseId(course._id);

  const totalDuration = lessons.reduce((acc, l) => acc + (l.duration || 0), 0);

  const modulesWithLessons: ModuleWithLessonsDTO[] = await Promise.all(
    modules.map(async (mod) => {
      const modLessons = await getLessonsByModuleId(mod._id);
      return {
        ...mod,
        lessons: modLessons,
      };
    })
  );

  let enrollment = null;
  let completedLessonIds: string[] = [];

  if (userId) {
    enrollment = await getEnrollment(userId, course._id);
    completedLessonIds = await getCompletedLessonIds(userId, course._id);
  }

  const firstLessonId = lessons[0]?._id;
  const isEnrolled = !!enrollment;

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-background py-10 lg:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Course Banner Header */}
        <CourseHeader
          course={course}
          moduleCount={modules.length}
          lessonCount={lessons.length}
          firstLessonId={firstLessonId}
          enrollment={enrollment}
        />

        {/* Content Layout: 2 Columns on Desktop, Stacked on Mobile */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          {/* Left Column (2/3): Course Curriculum Accordions */}
          <div className="space-y-6 lg:col-span-2">
            <div className="flex items-center justify-between border-b border-border/60 pb-4">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                  Course Curriculum
                </h2>
                <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                  {modules.length} modules • {lessons.length} lessons • {totalDuration} min total learning
                </p>
              </div>

              {completedLessonIds.length > 0 && (
                <Badge variant="indigo" className="px-3 py-1">
                  <CheckCircle2 className="size-3.5" />
                  <span>
                    {completedLessonIds.length}/{lessons.length} completed
                  </span>
                </Badge>
              )}
            </div>

            <ModuleList
              modules={modulesWithLessons}
              completedLessonIds={completedLessonIds}
            />
          </div>

          {/* Right Column (1/3): Sticky Course Information Sidebar */}
          <div className="space-y-6 lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Course Progress & Action Card */}
              <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm space-y-5">
                <h3 className="text-base font-bold text-foreground tracking-tight">
                  Course Overview
                </h3>

                {enrollment ? (
                  <div className="space-y-3 rounded-xl bg-secondary/50 p-4 border border-border/60">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground font-medium">Your Progress</span>
                      <span className="font-bold text-primary">
                        {enrollment.progressPercentage}%
                      </span>
                    </div>

                    <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${enrollment.progressPercentage}%` }}
                      />
                    </div>

                    <p className="text-[11px] text-muted-foreground">
                      {completedLessonIds.length} of {lessons.length} lessons completed
                    </p>
                  </div>
                ) : null}

                {/* Details list */}
                <div className="space-y-3 text-xs divide-y divide-border/50">
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Layers className="size-4 text-indigo-400" />
                      <span>Modules</span>
                    </span>
                    <span className="font-semibold text-foreground">{modules.length}</span>
                  </div>

                  <div className="flex items-center justify-between pt-3">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <BookOpen className="size-4 text-indigo-400" />
                      <span>Total Lessons</span>
                    </span>
                    <span className="font-semibold text-foreground">{lessons.length}</span>
                  </div>

                  <div className="flex items-center justify-between pt-3">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Clock className="size-4 text-indigo-400" />
                      <span>Duration</span>
                    </span>
                    <span className="font-semibold text-foreground">{totalDuration} minutes</span>
                  </div>

                  <div className="flex items-center justify-between pt-3">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <BarChart2 className="size-4 text-indigo-400" />
                      <span>Level</span>
                    </span>
                    <span className="font-semibold text-foreground capitalize">
                      {course.level || "Beginner"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-3">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Sparkles className="size-4 text-indigo-400" />
                      <span>AI Mentoring</span>
                    </span>
                    <span className="font-semibold text-emerald-400">Available</span>
                  </div>
                </div>

                {/* Direct Action Link */}
                <div className="pt-2">
                  <Link
                    href={
                      enrollment?.lastLessonId
                        ? `/learn/${enrollment.lastLessonId}`
                        : firstLessonId
                          ? `/learn/${firstLessonId}`
                          : `/courses/${course._id}`
                    }
                    className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-foreground shadow-md shadow-indigo-500/20 hover:bg-primary/90 transition-all"
                  >
                    <PlayCircle className="size-4" />
                    <span>{isEnrolled ? "Continue Learning" : "Start Learning Now"}</span>
                  </Link>
                </div>
              </div>

              {/* Instructor Card */}
              <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-950/60 border border-indigo-800/60 text-indigo-400">
                    <User className="size-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Instructor
                    </h4>
                    <p className="text-sm font-bold text-foreground">
                      {course.instructorId === "instructor_seed_demo"
                        ? "SmartLearn Faculty"
                        : "Verified Instructor"}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Curriculum designed and maintained with production-style engineering principles and AI-grounded explanations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
