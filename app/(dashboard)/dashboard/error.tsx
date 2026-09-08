"use client";

import { useEffect } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[DashboardError]", error);
  }, [error]);

  return (
    <div className="p-6 md:p-10 flex min-h-[400px] items-center justify-center">
      <div className="max-w-md w-full rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 text-center backdrop-blur">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
          <AlertCircle className="h-5 w-5" />
        </div>
        <h2 className="mt-3 text-lg font-semibold text-white">
          Failed to load dashboard
        </h2>
        <p className="mt-1 text-xs text-zinc-400">
          We were unable to load your dashboard metrics and enrolled courses right now.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2 text-xs font-semibold text-white hover:bg-amber-500 transition-colors"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Retry Dashboard
        </button>
      </div>
    </div>
  );
}
