import {
  BookOpen,
  FilePlus2,
  BarChart3,
  Settings,
} from "lucide-react";
import Link from "next/link";

import { DashboardCard } from "@/components/dashboard/dashboard-card";

interface InstructorDashboardProps {
  firstName: string;
}

export function InstructorDashboard({
  firstName,
}: InstructorDashboardProps) {
  return (
    <div>
      <div>
        <p className="text-sm text-muted-foreground">
          Instructor workspace
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          Welcome back, {firstName}
        </h1>

        <p className="mt-3 max-w-2xl text-muted-foreground">
          Create courses, manage lessons, and understand how learners are
          engaging with your content.
        </p>
      </div>

      <section className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Create Course"
          description="Create a new course and start adding learning content."
          href="/instructor/courses/new"
          icon={FilePlus2}
        />

        <DashboardCard
          title="Manage Courses"
          description="Edit your courses, lessons, and learning materials."
          href="/instructor/courses"
          icon={BookOpen}
        />

        <DashboardCard
          title="Analytics"
          description="View learner activity and course performance."
          href="/instructor/analytics"
          icon={BarChart3}
        />

        <DashboardCard
          title="Settings"
          description="Manage your instructor profile and preferences."
          href="/instructor/settings"
          icon={Settings}
        />
      </section>

      <section className="mt-10 rounded-xl border bg-card p-6">
        <h2 className="text-lg font-semibold">
          Instructor activity
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          Your course activity, learner engagement, and recent updates will
          appear here once the database and analytics systems are connected.
        </p>

        <Link
          href="/instructor/courses"
          className="mt-6 inline-flex h-10 items-center justify-center rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Manage courses
        </Link>
      </section>
    </div>
  );
}