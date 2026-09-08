"use client";

import { useState } from "react";
import {
  Search,
  ShieldCheck,
  GraduationCap,
  User as UserIcon,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Calendar,
} from "lucide-react";
import type { SearchLearnUserDTO, UserRole } from "@/types/user";

interface AdminUsersListProps {
  initialUsers: SearchLearnUserDTO[];
  initialTotal: number;
}

export function AdminUsersList({
  initialUsers,
  initialTotal,
}: AdminUsersListProps) {
  const [users, setUsers] = useState<SearchLearnUserDTO[]>(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (u.firstName && u.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (u.lastName && u.lastName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      u.clerkId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === "all" || u.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    setUpdatingId(userId);
    setError(null);
    setMessage(null);

    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update user role");
      }

      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId || u.clerkId === userId ? { ...u, role: newRole } : u
        )
      );

      setMessage(`Role updated to ${newRole} for ${data.data.email || data.data.clerkId}`);
      setTimeout(() => setMessage(null), 3500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update role");
    } finally {
      setUpdatingId(null);
    }
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case "admin":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-950/70 text-amber-300 border border-amber-800/60">
            <ShieldCheck className="w-3 h-3 text-amber-400" />
            Admin
          </span>
        );
      case "instructor":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-indigo-950/70 text-indigo-300 border border-indigo-800/60">
            <GraduationCap className="w-3 h-3 text-indigo-400" />
            Instructor
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
            <UserIcon className="w-3 h-3 text-zinc-400" />
            Student
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {message && (
        <div className="p-4 bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-xs text-emerald-300 flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-950/40 border border-red-800/60 rounded-xl text-xs text-red-300 flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search users by name, email, or clerkId..."
            className="w-full pl-10 pr-4 py-2 bg-zinc-900/60 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        <div className="flex gap-2">
          {(["all", "student", "instructor", "admin"] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRoleFilter(r)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${
                roleFilter === r
                  ? "bg-amber-600 text-white shadow-sm"
                  : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {r === "all" ? "All Roles" : `${r}s`}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table Card */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-zinc-950/80 border-b border-zinc-800 text-[11px] uppercase tracking-wider text-zinc-400 font-semibold">
              <tr>
                <th className="py-3.5 px-5">User</th>
                <th className="py-3.5 px-5">Clerk ID</th>
                <th className="py-3.5 px-5">Current Role</th>
                <th className="py-3.5 px-5">Joined Date</th>
                <th className="py-3.5 px-5 text-right">Assign Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-zinc-500">
                    No users found matching your search.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const fullName = [u.firstName, u.lastName].filter(Boolean).join(" ");
                  const isUpdating = updatingId === u._id || updatingId === u.clerkId;

                  return (
                    <tr
                      key={u._id || u.clerkId}
                      className="hover:bg-zinc-850/50 transition-colors"
                    >
                      {/* Name & Email */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300 font-bold text-xs shrink-0">
                            {u.firstName?.[0] || u.email?.[0]?.toUpperCase() || "U"}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-zinc-100 truncate">
                              {fullName || "Anonymous Learner"}
                            </p>
                            <p className="text-zinc-400 truncate">{u.email || "No email"}</p>
                          </div>
                        </div>
                      </td>

                      {/* Clerk ID */}
                      <td className="py-4 px-5 font-mono text-[11px] text-zinc-500 truncate max-w-[140px]">
                        {u.clerkId}
                      </td>

                      {/* Role Badge */}
                      <td className="py-4 px-5">{getRoleBadge(u.role)}</td>

                      {/* Date */}
                      <td className="py-4 px-5 text-zinc-400 whitespace-nowrap">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-zinc-600" />
                          {u.createdAt
                            ? new Date(u.createdAt).toLocaleDateString()
                            : "N/A"}
                        </span>
                      </td>

                      {/* Role Selector */}
                      <td className="py-4 px-5 text-right">
                        <div className="inline-flex items-center gap-2">
                          {isUpdating && (
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                          )}
                          <select
                            value={u.role}
                            disabled={isUpdating}
                            onChange={(e) =>
                              handleRoleChange(
                                u._id || u.clerkId,
                                e.target.value as UserRole
                              )
                            }
                            className="px-2.5 py-1.5 bg-zinc-950 border border-zinc-750 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-amber-500 transition-colors capitalize disabled:opacity-50"
                          >
                            <option value="student">Student</option>
                            <option value="instructor">Instructor</option>
                            <option value="admin">Admin</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-zinc-950/60 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
          <span>
            Showing {filteredUsers.length} of {initialTotal} platform users
          </span>
          <span className="text-[11px]">
            🛡️ Changes take effect immediately across MongoDB & Clerk.
          </span>
        </div>
      </div>
    </div>
  );
}
