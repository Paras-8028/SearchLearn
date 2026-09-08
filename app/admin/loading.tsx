export default function AdminLoading() {
  return (
    <main className="p-6 md:p-10 animate-pulse">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header Skeleton */}
        <div className="border-b border-zinc-800/80 pb-6 space-y-3">
          <div className="h-4 w-32 bg-zinc-800 rounded-md" />
          <div className="h-8 w-64 bg-zinc-800 rounded-lg" />
          <div className="h-4 w-96 bg-zinc-800/60 rounded-md" />
        </div>

        {/* Stat Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-28 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-3"
            >
              <div className="h-3 w-20 bg-zinc-800 rounded" />
              <div className="h-7 w-16 bg-zinc-800 rounded-md" />
              <div className="h-2 w-24 bg-zinc-800/50 rounded" />
            </div>
          ))}
        </div>

        {/* Charts Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-72 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-4"
            >
              <div className="h-4 w-40 bg-zinc-800 rounded" />
              <div className="h-48 w-full bg-zinc-950/60 rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
