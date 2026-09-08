export default function DashboardLoading() {
  return (
    <main className="p-6 md:p-10 animate-pulse">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Welcome Header Skeleton */}
        <div className="space-y-2 border-b border-zinc-800/80 pb-6">
          <div className="h-8 w-60 bg-zinc-800 rounded-lg" />
          <div className="h-4 w-72 bg-zinc-800/60 rounded" />
        </div>

        {/* Stats Row Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-28 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-3"
            >
              <div className="h-3 w-24 bg-zinc-800 rounded" />
              <div className="h-7 w-12 bg-zinc-800 rounded-md" />
              <div className="h-2 w-28 bg-zinc-800/50 rounded" />
            </div>
          ))}
        </div>

        {/* Enrolled Courses Grid Skeleton */}
        <div className="space-y-4">
          <div className="h-5 w-40 bg-zinc-800 rounded" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-48 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-3"
              >
                <div className="h-4 w-3/4 bg-zinc-800 rounded" />
                <div className="h-3 w-full bg-zinc-800/50 rounded" />
                <div className="h-2 w-full bg-zinc-800/60 rounded-full mt-6" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
