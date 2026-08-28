import Link from "next/link";
import { BookOpen, LayoutDashboard, Search } from "lucide-react";

import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Search",
    href: "/search",
    icon: Search,
  },
  {
    name: "My Courses",
    href: "/courses",
    icon: BookOpen,
  },
];

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await auth.protect();

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link
            href="/dashboard"
            className="text-lg font-semibold tracking-tight"
          >
            SearchLearn
          </Link>

          <UserButton />
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl">
        <aside className="hidden w-60 shrink-0 border-r bg-background md:block">
          <nav className="sticky top-0 flex flex-col gap-1 p-4">
            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <Icon className="size-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="min-w-0 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}