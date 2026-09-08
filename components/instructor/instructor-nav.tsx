"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  PlusCircle,
  GraduationCap,
  ArrowLeft,
  ShieldAlert,
} from "lucide-react";

interface InstructorNavProps {
  userRole: string;
}

export function InstructorNav({ userRole }: InstructorNavProps) {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Dashboard",
      href: "/instructor",
      icon: LayoutDashboard,
      active: pathname === "/instructor",
    },
    {
      label: "My Courses",
      href: "/instructor/courses",
      icon: BookOpen,
      active: pathname === "/instructor/courses" || (pathname.startsWith("/instructor/courses/") && !pathname.endsWith("/new")),
    },
    {
      label: "Create Course",
      href: "/instructor/courses/new",
      icon: PlusCircle,
      active: pathname === "/instructor/courses/new",
    },
  ];

  return (
    <div className="border-b border-zinc-800 bg-zinc-950/60 backdrop-blur sticky top-16 z-40">
      <div className="mx-auto max-w-7xl px-6 flex items-center justify-between h-14">
        {/* Left: Brand / Mode Indicator & Tabs */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <GraduationCap className="h-4 w-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-200 hidden sm:inline-block">
              Instructor Studio
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
                      ? "bg-indigo-600 text-white shadow-sm font-semibold"
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

        {/* Right: Exit / Switch View */}
        <div className="flex items-center gap-3">
          {userRole === "admin" && (
            <Link
              href="/admin"
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-amber-950/40 text-amber-300 border border-amber-800/40 hover:bg-amber-950/60 transition-colors"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Admin Console</span>
            </Link>
          )}

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
