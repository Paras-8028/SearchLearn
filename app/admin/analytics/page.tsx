import { getAdminOverviewAnalytics } from "@/lib/db/repositories/analytics";
import { AdminAnalyticsView } from "@/components/admin/admin-analytics-view";
import type { AnalyticsPeriod } from "@/types/analytics";

export const revalidate = 0;

export default async function AdminAnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const params = await searchParams;
  const rawRange = params.range || "30d";
  const range: AnalyticsPeriod = ["7d", "30d", "90d", "all"].includes(rawRange)
    ? (rawRange as AnalyticsPeriod)
    : "30d";

  const analytics = await getAdminOverviewAnalytics(range);

  return (
    <main className="p-6 md:p-10">
      <div className="mx-auto max-w-7xl">
        <AdminAnalyticsView analytics={analytics} />
      </div>
    </main>
  );
}
