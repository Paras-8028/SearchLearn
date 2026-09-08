import Link from "next/link";

import { requireInstructor } from "@/lib/auth/require-user";

export default async function InstructorPage() {
  const user = await requireInstructor();

  if (!user) {
    return (
      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-6">
        <div className="max-w-md text-center">
          <p className="text-sm font-medium text-destructive">
            403
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Instructor access required
          </h1>

          <p className="mt-4 text-muted-foreground">
            Your current account does not have instructor permissions.
          </p>

          <Link
            href="/dashboard"
            className="mt-8 inline-flex h-10 items-center justify-center rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Back to dashboard
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="p-6 md:p-10">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm text-primary">
          Instructor
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          Instructor Workspace
        </h1>

        <p className="mt-3 max-w-2xl text-muted-foreground">
          Welcome, {user.firstName || "Instructor"}. Your course management
          workspace will be built here.
        </p>
      </div>
    </main>
  );
}