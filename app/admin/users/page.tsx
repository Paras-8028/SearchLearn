import { getAllUsers } from "@/lib/db/repositories/users";
import { AdminUsersList } from "@/components/admin/admin-users-list";
import { ShieldCheck } from "lucide-react";

export const revalidate = 0;

export default async function AdminUsersPage() {
  const { users, total } = await getAllUsers({ limit: 50 });

  return (
    <main className="p-6 md:p-10">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-800/80 pb-6">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Role & Permissions Management
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              User Directory
            </h1>
            <p className="text-sm text-zinc-400 mt-1 max-w-xl">
              Inspect user accounts, assign roles, and grant instructor or administrator privileges with automatic safeguards.
            </p>
          </div>
        </div>

        <AdminUsersList initialUsers={users} initialTotal={total} />
      </div>
    </main>
  );
}
