import { BookOpen, FileSearch, GraduationCap } from "lucide-react";

import { UserButton } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";

import { DashboardCard } from "@/components/dashboard/dashboard-card";

export default async function DashboardPage() {
  await auth.protect();

  const user = await currentUser();

  const firstName = user?.firstName || "Learner";

  return (
    <div className="p-6 md:p-10">
      <div className="flex items-start justify-between gap-6">
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

        <div className="md:hidden">
          <UserButton />
        </div>
      </div>

      <section className="mt-10 grid gap-6 md:grid-cols-3">
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