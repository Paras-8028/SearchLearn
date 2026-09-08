import Link from "next/link";

export default function ForbiddenPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-md text-center">
        <p className="text-sm font-medium text-primary">
          403
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          Access denied
        </h1>

        <p className="mt-4 text-muted-foreground">
          You do not have permission to access this page.
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