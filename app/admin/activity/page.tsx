import Link from "next/link";
import { Activity, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getPlatformActivities } from "@/lib/db/repositories/activity";
import { ActivityFeed } from "@/components/analytics/activity-feed";

export const revalidate = 0;

interface ActivityPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    page?: string;
  }>;
}

const CATEGORIES = [
  { label: "All Categories", value: "ALL" },
  { label: "Learning", value: "LEARNING" },
  { label: "Search", value: "SEARCH" },
  { label: "AI Assist", value: "AI" },
  { label: "Courses", value: "COURSE" },
  { label: "Documents", value: "DOCUMENT" },
  { label: "Users", value: "USER" },
  { label: "Admin", value: "ADMIN" },
];

export default async function AdminActivityPage({ searchParams }: ActivityPageProps) {
  await requireAdmin();

  const params = await searchParams;
  const currentCategory = (params.category || "ALL").toUpperCase();
  const currentSearch = params.search || "";
  const currentPage = Math.max(1, parseInt(params.page || "1", 10));

  const { activities, pagination } = await getPlatformActivities({
    category: currentCategory !== "ALL" ? currentCategory : undefined,
    search: currentSearch || undefined,
    page: currentPage,
    limit: 25,
  });

  return (
    <main className="p-6 md:p-10">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="border-b border-zinc-800/80 pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">
              <Activity className="h-3.5 w-3.5" />
              Platform Intelligence & Audit
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Activity & Event Logs
            </h1>
            <p className="text-sm text-zinc-400 mt-1 max-w-2xl">
              Chronological platform event log of student enrollments, course updates, search discoveries, and AI interactions.
            </p>
          </div>

          <div className="text-xs text-zinc-500 shrink-0">
            Total records: <span className="font-semibold text-zinc-300">{pagination.total.toLocaleString()}</span>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {CATEGORIES.map((cat) => {
              const isActive = currentCategory === cat.value;
              const query = new URLSearchParams();
              if (cat.value !== "ALL") query.set("category", cat.value);
              if (currentSearch) query.set("search", currentSearch);

              return (
                <Link
                  key={cat.value}
                  href={`/admin/activity?${query.toString()}`}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-amber-600 text-white font-semibold shadow-sm"
                      : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
                  }`}
                >
                  {cat.label}
                </Link>
              );
            })}
          </div>

          {/* Search Input Form */}
          <form method="GET" action="/admin/activity" className="relative w-full md:w-72">
            {currentCategory !== "ALL" && (
              <input type="hidden" name="category" value={currentCategory} />
            )}
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              name="search"
              defaultValue={currentSearch}
              placeholder="Search descriptions, users..."
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900/90 pl-9 pr-4 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:border-amber-500 focus:outline-none transition-colors"
            />
          </form>
        </div>

        {/* Main Feed Container */}
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 backdrop-blur">
          <ActivityFeed
            activities={activities}
            emptyMessage={
              currentSearch || currentCategory !== "ALL"
                ? "No activities found matching the specified filters."
                : "No platform activities logged yet."
            }
          />

          {/* Pagination Navigation */}
          {pagination.totalPages > 1 && (
            <div className="mt-8 flex items-center justify-between border-t border-zinc-800/60 pt-4 text-xs">
              <span className="text-zinc-500">
                Page {pagination.page} of {pagination.totalPages}
              </span>

              <div className="flex items-center gap-2">
                {pagination.page > 1 ? (
                  <Link
                    href={`/admin/activity?category=${currentCategory}&search=${encodeURIComponent(currentSearch)}&page=${pagination.page - 1}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                    Previous
                  </Link>
                ) : (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-zinc-900 bg-zinc-950 text-zinc-600 cursor-not-allowed">
                    <ChevronLeft className="h-3.5 w-3.5" />
                    Previous
                  </span>
                )}

                {pagination.page < pagination.totalPages ? (
                  <Link
                    href={`/admin/activity?category=${currentCategory}&search=${encodeURIComponent(currentSearch)}&page=${pagination.page + 1}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors"
                  >
                    Next
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                ) : (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-zinc-900 bg-zinc-950 text-zinc-600 cursor-not-allowed">
                    Next
                    <ChevronRight className="h-3.5 w-3.5" />
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
