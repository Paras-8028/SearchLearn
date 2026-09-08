import { auth } from "@clerk/nextjs/server";
import { getCourses } from "@/lib/db/repositories/courses";
import { getRecentSearches } from "@/lib/db/repositories/search-history";
import { SearchContainer } from "@/components/search/search-container";
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
    <main className="min-h-[calc(100vh-4rem)] bg-background py-10">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <SearchContainer
          initialCourses={courses}
          initialRecentSearches={recentSearches}
        />
      </div>
    </main>
  );
}