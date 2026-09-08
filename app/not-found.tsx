import Link from "next/link";
import { Search, BookOpen, Home, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-6 text-center">
      <div className="mx-auto max-w-lg rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8 shadow-2xl backdrop-blur">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
          <Compass className="h-7 w-7 animate-pulse" />
        </div>

        <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-amber-400">
          404 Not Found
        </p>

        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white">
          Content Not Found
        </h1>

        <p className="mt-3 text-sm text-zinc-400">
          The page, lesson, course, or resource you are looking for does not exist or may have been relocated.
        </p>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            href="/search"
            className="flex items-center gap-2.5 rounded-xl border border-zinc-800 bg-zinc-900/90 px-4 py-3 text-xs font-semibold text-zinc-200 hover:border-zinc-700 hover:text-white transition-colors"
          >
            <Search className="h-4 w-4 text-emerald-400" />
            <div className="text-left">
              <p>Search Content</p>
              <p className="text-[10px] text-zinc-500 font-normal">Find lessons & notes</p>
            </div>
          </Link>

          <Link
            href="/courses"
            className="flex items-center gap-2.5 rounded-xl border border-zinc-800 bg-zinc-900/90 px-4 py-3 text-xs font-semibold text-zinc-200 hover:border-zinc-700 hover:text-white transition-colors"
          >
            <BookOpen className="h-4 w-4 text-indigo-400" />
            <div className="text-left">
              <p>Browse Courses</p>
              <p className="text-[10px] text-zinc-500 font-normal">Explore our curriculum</p>
            </div>
          </Link>
        </div>

        <div className="mt-6 pt-6 border-t border-zinc-800/80">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
          >
            <Home className="h-3.5 w-3.5" />
            Return to SmartLearn Home
          </Link>
        </div>
      </div>
    </main>
  );
}
