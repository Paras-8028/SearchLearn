import { requireInstructor } from "@/lib/auth/require-user";
import { InstructorNav } from "@/components/instructor/instructor-nav";

export default async function InstructorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      <InstructorNav userRole={user.role} />
      {children}
    </div>
  );
}