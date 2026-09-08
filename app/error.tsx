"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[RootErrorBoundary]", error);
  }, [error]);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-6 text-center">
      <div className="mx-auto max-w-md rounded-2xl border border-border/80 bg-card p-8 shadow-2xl backdrop-blur">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10 text-destructive border border-destructive/20">
          <AlertTriangle className="h-6 w-6" />
        </div>

        <h1 className="mt-4 text-2xl font-bold tracking-tight text-foreground">
          Something went wrong
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          We encountered an unexpected problem while loading this page. Please try again or navigate back to safety.
        </p>

        {error.digest && (
          <p className="mt-2 text-[11px] font-mono text-muted-foreground/60">
            Error Ref: {error.digest}
          </p>
        )}

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow-lg shadow-indigo-500/20 hover:bg-primary/90 transition-all hover:scale-[1.02]"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Try again
          </button>
          <Link
            href="/dashboard"
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-border bg-secondary/80 px-5 py-2.5 text-xs font-semibold text-secondary-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            <Home className="h-3.5 w-3.5" />
            Go to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
