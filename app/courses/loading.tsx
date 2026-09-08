export default function CoursesLoading() {
  return (
    <main className="p-6 md:p-10 animate-pulse">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header Skeleton */}
        <div className="space-y-3 border-b border-zinc-800/80 pb-6">
          <div className="h-4 w-28 bg-zinc-800 rounded" />
          <div className="h-8 w-56 bg-zinc-800 rounded-lg" />
          <div className="h-4 w-80 bg-zinc-800/60 rounded" />
        </div>

        {/* Filter bar Skeleton */}
        <div className="h-11 w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl" />

        {/* Course Cards Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-4"
            >
              <div className="h-36 w-full bg-zinc-800/60 rounded-xl" />
              <div className="h-5 w-3/4 bg-zinc-800 rounded" />
              <div className="h-3 w-full bg-zinc-800/50 rounded" />
              <div className="h-3 w-2/3 bg-zinc-800/50 rounded" />
              <div className="pt-3 border-t border-zinc-800/60 flex justify-between items-center">
                <div className="h-3 w-20 bg-zinc-800 rounded" />
                <div className="h-6 w-16 bg-zinc-800 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
