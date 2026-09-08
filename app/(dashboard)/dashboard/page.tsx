import { UserButton } from "@clerk/nextjs";

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
      <div className="mx-auto max-w-7xl px-6 py-10 md:px-8">
        <div className="mb-8 flex justify-end md:hidden">
          <UserButton />
        </div>

        {user.role === "instructor" ? (
          <InstructorDashboard firstName={firstName} />
        ) : (
          <StudentDashboard firstName={firstName} enrollments={enrollments} />
        )}
      </div>
    </main>
  );
}