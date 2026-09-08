import { Suspense } from "react";
import { auth } from "@clerk/nextjs/server";
import { getCourses } from "@/lib/db/repositories/courses";
import { getRecentSearches } from "@/lib/db/repositories/search-history";
import { SearchContainer } from "@/components/search/search-container";
import { SearchResultSkeleton } from "@/components/shared/loading-state";
import type { SearchHistoryDTO } from "@/types/search-history";

export const revalidate = 0;

export default async function SearchPage() {
  const courses = await getCourses({ publishedOnly: true });

  let recentSearches: SearchHistoryDTO[] = [];
  try {
    const { userId } = await auth();
    if (userId) {
      recentSearches = await getRecentSearches(userId, 10);
    }
  } catch {
    // Graceful fallback
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-background py-10 lg:py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <Suspense
          fallback={
            <div className="space-y-6">
              <div className="h-14 w-full rounded-2xl bg-card animate-pulse" />
              <div className="space-y-4">
                <SearchResultSkeleton />
                <SearchResultSkeleton />
                <SearchResultSkeleton />
              </div>
            </div>
          }
        >
          <SearchContainer
            initialCourses={courses}
            initialRecentSearches={recentSearches}
          />
        </Suspense>
      </div>
    </main>
  );
}