import {
  getSearchIndexStats,
  getGroupedSearchSources,
} from "@/lib/db/repositories/search";
import { AdminSearchIndexManager } from "@/components/admin/admin-search-index-manager";
import { ShieldCheck } from "lucide-react";

export const revalidate = 0;

export default async function AdminSearchIndexPage() {
  const [stats, sources] = await Promise.all([
    getSearchIndexStats(),
    getGroupedSearchSources(100),
  ]);

  return (
    <main className="p-6 md:p-10">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-800/80 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Platform Administration
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Search Index Management
            </h1>
            <p className="text-sm text-zinc-400 mt-1 max-w-2xl">
              Inspect indexed content chunks and vector embeddings. Reindex individual courses and documents, or trigger platform-wide vector regeneration.
            </p>
          </div>
        </div>

        {/* Manager Component */}
        <AdminSearchIndexManager
          initialStats={stats}
          initialSources={sources}
        />
      </div>
    </main>
  );
}
