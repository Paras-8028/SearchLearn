"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Search,
  Sparkles,
  BookOpen,
  FileText,
  GraduationCap,
  LayoutDashboard,
  ShieldAlert,
  UserCheck,
  LogIn,
  UserPlus,
} from "lucide-react";
import { Show, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import type { SearchLearnUserDTO } from "@/types/user";

interface MobileNavProps {
  user?: SearchLearnUserDTO | null;
}

export function MobileNav({ user }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Prevent background scroll when mobile nav is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const navLinks = [
    { href: "/search", label: "Search", icon: Search },
    { href: "/ask", label: "Ask AI", icon: Sparkles, accent: true },
    { href: "/courses", label: "Courses", icon: BookOpen },
    { href: "/documents", label: "Documents", icon: FileText },
    { href: "/learn", label: "Learn", icon: GraduationCap },
  ];

  if (user) {
    navLinks.push({
      href: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    });
  }

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close Menu" : "Open Menu"}
        className="text-foreground hover:bg-card/80"
      >
        {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
      </Button>

      {/* Backdrop overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 top-16 z-40 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="fixed inset-x-0 top-16 z-50 max-h-[calc(100vh-4rem)] overflow-y-auto border-b border-border bg-card/95 backdrop-blur-xl p-6 shadow-2xl animate-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary/15 text-primary border border-primary/20"
                      : link.accent
                        ? "text-indigo-400 hover:bg-muted/60 hover:text-indigo-300"
                        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  }`}
                >
                  <Icon className="size-4 shrink-0" />
                  <span>{link.label}</span>
                </Link>
              );
            })}

            {/* Role specific links */}
            {(user?.role === "instructor" || user?.role === "admin") && (
              <Link
                href="/instructor"
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                  pathname.startsWith("/instructor")
                    ? "bg-indigo-500/15 text-indigo-400 border border-indigo-500/20"
                    : "text-indigo-400/90 hover:bg-muted/60 hover:text-indigo-300"
                }`}
              >
                <UserCheck className="size-4 shrink-0" />
                <span>Instructor Studio</span>
              </Link>
            )}

            {user?.role === "admin" && (
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                  pathname.startsWith("/admin")
                    ? "bg-amber-500/15 text-amber-400 border border-amber-500/20"
                    : "text-amber-400/90 hover:bg-muted/60 hover:text-amber-300"
                }`}
              >
                <ShieldAlert className="size-4 shrink-0" />
                <span>Admin Console</span>
              </Link>
            )}
          </nav>

          {/* Authentication section */}
          <div className="mt-6 border-t border-border/80 pt-6">
            <Show when="signed-out">
              <div className="flex flex-col gap-3">
                <Link
                  href="/sign-in"
                  className="flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-border bg-card text-sm font-medium text-foreground hover:bg-muted"
                >
                  <LogIn className="size-4" />
                  <span>Sign in</span>
                </Link>

                <Link
                  href="/sign-up"
                  className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-medium text-primary-foreground hover:bg-primary/90 shadow-sm"
                >
                  <UserPlus className="size-4" />
                  <span>Get started free</span>
                </Link>
              </div>
            </Show>

            <Show when="signed-in">
              <div className="flex items-center justify-between px-2 py-2">
                <span className="text-sm text-muted-foreground">Account</span>
                <UserButton />
              </div>
            </Show>
          </div>
        </div>
      )}
    </div>
  );
}
