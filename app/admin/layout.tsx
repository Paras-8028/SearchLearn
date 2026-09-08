import { requireAdmin } from "@/lib/auth/require-user";
import { AdminNav } from "@/components/admin/admin-nav";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await requireAdmin();

  if (!user) {
    return (
      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-6">
        <div className="max-w-md text-center">
          <p className="text-sm font-semibold text-destructive">403</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">
            Administrator Access Required
          </h1>
          <p className="mt-4 text-sm text-zinc-400">
            This area is restricted strictly to platform administrators.
          </p>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      <AdminNav />
      {children}
    </div>
  );
}
