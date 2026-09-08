import {
  BookOpen,
  FileSearch,
  GraduationCap,
  History,
} from "lucide-react";

import { DashboardCard } from "@/components/dashboard/dashboard-card";

interface StudentDashboardProps {
  firstName: string;
}

export function StudentDashboard({
  firstName,
}: StudentDashboardProps) {
  return (
    <div>
      <div>
        <p className="text-sm text-muted-foreground">
          Your learning workspace
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          Welcome back, {firstName}
        </h1>

        <p className="mt-3 max-w-2xl text-muted-foreground">
          Search your learning library, continue your courses, and discover
          exactly where concepts are explained.
        </p>
      </div>

      <section className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Search Learning Content"
          description="Find concepts across courses, videos, transcripts, notes, and documents."
          href="/search"
          icon={FileSearch}
        />

        <DashboardCard
          title="My Courses"
          description="Browse your enrolled courses and continue learning."
          href="/courses"
          icon={BookOpen}
        />

        <DashboardCard
          title="Continue Learning"
          description="Return to lessons and keep your learning progress moving."
          href="/learn"
          icon={GraduationCap}
        />

        <DashboardCard
          title="Search History"
          description="Review your previous searches and discoveries."
          href="/search/history"
          icon={History}
        />
      </section>

      <section className="mt-10 rounded-xl border bg-card p-6">
        <h2 className="text-lg font-semibold">
          Your learning activity
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          Your recent searches, course progress, and learning activity will
          appear here once the database is connected.
        </p>
      </section>
    </div>
  );
}