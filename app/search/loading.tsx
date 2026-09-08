export default function SearchLoading() {
  return (
    <main className="p-6 md:p-10 animate-pulse">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Search Header Skeleton */}
        <div className="text-center space-y-3 pt-6">
          <div className="mx-auto h-7 w-48 bg-zinc-800 rounded-lg" />
          <div className="mx-auto h-4 w-80 bg-zinc-800/60 rounded" />
        </div>

        {/* Search Bar Skeleton */}
        <div className="h-14 w-full bg-zinc-900 border border-zinc-800 rounded-2xl" />

        {/* Filter Pills Skeleton */}
        <div className="flex justify-center gap-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-8 w-20 bg-zinc-800/70 rounded-xl" />
          ))}
        </div>

        {/* Results Skeleton */}
        <div className="space-y-4 pt-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-3"
            >
              <div className="flex items-center gap-2">
                <div className="h-4 w-16 bg-zinc-800 rounded" />
                <div className="h-4 w-24 bg-zinc-800/70 rounded" />
              </div>
              <div className="h-5 w-1/2 bg-zinc-800 rounded" />
              <div className="h-3 w-full bg-zinc-800/50 rounded" />
              <div className="h-3 w-4/5 bg-zinc-800/50 rounded" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
