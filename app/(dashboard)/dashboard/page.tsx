import { UserButton } from "@clerk/nextjs";

import { InstructorDashboard } from "@/components/dashboard/instructor-dashboard";
import { StudentDashboard } from "@/components/dashboard/student-dashboard";
import { getCurrentSearchLearnUser } from "@/lib/auth/current-user";

export default async function DashboardPage() {
  const user = await getCurrentSearchLearnUser();

  if (!user) {
    return null;
  }

  const firstName = user.firstName || "Learner";

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-background">
      <div className="mx-auto max-w-7xl px-6 py-10 md:px-8">
        <div className="mb-8 flex justify-end md:hidden">
          <UserButton />
        </div>

        {user.role === "instructor" ? (
          <InstructorDashboard firstName={firstName} />
        ) : (
          <StudentDashboard firstName={firstName} />
        )}
      </div>
    </main>
  );
}