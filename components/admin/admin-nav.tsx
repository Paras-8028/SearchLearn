"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShieldCheck,
  LayoutDashboard,
  Users,
  BookOpen,
  BarChart3,
  GraduationCap,
  ArrowLeft,
} from "lucide-react";

export function AdminNav() {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Overview",
      href: "/admin",
      icon: LayoutDashboard,
      active: pathname === "/admin",
    },
    {
      label: "User Management",
      href: "/admin/users",
      icon: Users,
      active: pathname.startsWith("/admin/users"),
    },
    {
      label: "All Courses",
      href: "/admin/courses",
      icon: BookOpen,
      active: pathname.startsWith("/admin/courses"),
    },
    {
      label: "Platform Analytics",
      href: "/admin/analytics",
      icon: BarChart3,
      active: pathname.startsWith("/admin/analytics"),
    },
  ];

  return (
    <div className="border-b border-zinc-800 bg-zinc-950/70 backdrop-blur sticky top-16 z-40">
      <div className="mx-auto max-w-7xl px-6 flex items-center justify-between h-14">
        {/* Left: Brand / Mode Indicator & Tabs */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <ShieldCheck className="h-4 w-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-200 hidden sm:inline-block">
              Admin Console
            </span>
          </div>

          <nav className="flex items-center gap-1 sm:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    item.active
                      ? "bg-amber-600 text-white shadow-sm font-semibold"
                      : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-850"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: Instructor & Platform Switch */}
        <div className="flex items-center gap-3">
          <Link
            href="/instructor"
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-indigo-950/50 text-indigo-300 border border-indigo-800/40 hover:bg-indigo-950/70 transition-colors"
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Instructor Studio</span>
          </Link>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Student View</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
