export default function GlobalLoading() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl flex-col px-4 py-8 sm:px-6 lg:px-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="space-y-3 mb-8">
        <div className="h-4 w-28 rounded-full bg-secondary/80" />
        <div className="h-8 w-64 rounded-xl bg-secondary" />
        <div className="h-4 w-96 rounded-lg bg-secondary/60" />
      </div>

      {/* Grid Content Skeleton */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="flex flex-col justify-between rounded-2xl border border-border/60 bg-card p-6 space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-5 w-16 rounded-md bg-secondary" />
                <div className="h-5 w-20 rounded-full bg-secondary/80" />
              </div>
              <div className="aspect-video w-full rounded-xl bg-secondary/60" />
              <div className="h-5 w-3/4 rounded bg-secondary" />
              <div className="h-4 w-full rounded bg-secondary/40" />
            </div>

            <div className="flex items-center justify-between border-t border-border/40 pt-4">
              <div className="h-4 w-20 rounded bg-secondary/50" />
              <div className="h-4 w-12 rounded bg-secondary/50" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
