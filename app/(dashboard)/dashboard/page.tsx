import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { ShieldCheck } from "lucide-react";

import { InstructorDashboard } from "@/components/dashboard/instructor-dashboard";
import { StudentDashboard } from "@/components/dashboard/student-dashboard";
import { getCurrentSearchLearnUser } from "@/lib/auth/current-user";
import { getUserEnrollments } from "@/lib/db/repositories/enrollments";

export const revalidate = 0;

export default async function DashboardPage() {
  const user = await getCurrentSearchLearnUser();

  if (!user) {
    return null;
  }

  const firstName = user.firstName || "Learner";
  const enrollments = await getUserEnrollments(user.clerkId);

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-background">
      <div className="mx-auto max-w-7xl px-6 py-10 md:px-8 space-y-8">
        <div className="flex justify-end md:hidden">
          <UserButton />
        </div>

        {user.role === "admin" && (
          <div className="p-4 bg-amber-950/30 border border-amber-800/40 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <span className="text-xs font-bold text-amber-200">
                  Administrator Privileges Active
                </span>
                <p className="text-[11px] text-amber-300/80">
                  You have full platform governance access, user role control, and curriculum editing privileges.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link
                href="/admin"
                className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-sm transition-colors"
              >
                Admin Console
              </Link>
              <Link
                href="/instructor"
                className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition-colors"
              >
                Instructor Studio
              </Link>
            </div>
          </div>
        )}

        {user.role === "instructor" ? (
          <InstructorDashboard firstName={firstName} />
        ) : (
          <StudentDashboard firstName={firstName} enrollments={enrollments} />
        )}
      </div>
    </main>
  );
}