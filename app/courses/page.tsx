import { auth } from "@clerk/nextjs/server";

export default async function CoursesPage() {
  await auth.protect();

  return (
    <main className="p-6 md:p-10">
      <h1 className="text-3xl font-bold tracking-tight">
        My Courses
      </h1>

      <p className="mt-3 text-muted-foreground">
        Your courses will appear here after the course database is implemented.
      </p>
    </main>
  );
}