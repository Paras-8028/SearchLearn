import { notFound } from "next/navigation";
import { getUserDetailSummary } from "@/lib/db/repositories/admin";
import { UserDetailsView } from "@/components/admin/user-details-view";

export const revalidate = 0;

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const data = await getUserDetailSummary(userId);

  if (!data) {
    notFound();
  }

  return (
    <main className="p-6 md:p-10">
      <div className="mx-auto max-w-7xl">
        <UserDetailsView initialData={data} />
      </div>
    </main>
  );
}
