"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  User as UserIcon,
  Mail,
  Calendar,
  GraduationCap,
  BookOpen,
  Search,
  Sparkles,
  Activity,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
} from "lucide-react";
import type { UserDetailSummary } from "@/lib/db/repositories/admin";
import type { UserRole } from "@/types/user";

interface UserDetailsViewProps {
  initialData: UserDetailSummary;
}

export function UserDetailsView({ initialData }: UserDetailsViewProps) {
  const router = useRouter();
  const [data, setData] = useState<UserDetailSummary>(initialData);
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);
  const [roleMessage, setRoleMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const handleRoleChange = async (newRole: UserRole) => {
    if (newRole === data.user.role) return;

    if (
      data.user.role === "admin" &&
      newRole !== "admin" &&
      !confirm("Are you sure you want to demote this Administrator? Platform policies prevent demoting the last admin.")
    ) {
      return;
    }

    setIsUpdatingRole(true);
    setRoleMessage(null);

    try {
      const res = await fetch(`/api/admin/users/${data.user._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to update user role");
      }

      setData((prev) => ({
        ...prev,
        user: json.data,
      }));

      setRoleMessage({
        text: `Role successfully updated to ${newRole}. Synced with Clerk.`,
        isError: false,
      });
      router.refresh();
    } catch (err) {
      setRoleMessage({
        text: err instanceof Error ? err.message : "Failed to update role",
        isError: true,
      });
    } finally {
      setIsUpdatingRole(false);
    }
  };

  const { user, enrollments, createdCourses, searchStats, aiStats, activities } = data;

  return (
    <div className="space-y-8">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/users"
          className="inline-flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to User Directory</span>
        </Link>
      </div>

      {/* Role Feedback Banner */}
      {roleMessage && (
        <div
          className={`p-4 rounded-xl border text-xs font-medium flex items-center gap-2.5 ${
            roleMessage.isError
              ? "bg-red-500/10 border-red-500/20 text-red-400"
              : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
          }`}
        >
          {roleMessage.isError ? (
            <AlertCircle className="w-4 h-4 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          )}
          <span>{roleMessage.text}</span>
        </div>
      )}

      {/* Profile Overview Card */}
      <div className="p-6 md:p-8 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="h-16 w-16 rounded-2xl bg-zinc-800 border border-zinc-700/60 flex items-center justify-center text-zinc-300 text-xl font-bold shrink-0">
              {user.firstName ? (
                <span>{user.firstName[0].toUpperCase()}</span>
              ) : (
                <UserIcon className="w-8 h-8 text-zinc-400" />
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-white">
                  {user.firstName || user.lastName
                    ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
                    : "Unnamed User"}
                </h1>
                <span
                  className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                    user.role === "admin"
                      ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                      : user.role === "instructor"
                      ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/30"
                      : "bg-zinc-800 text-zinc-400 border-zinc-700"
                  }`}
                >
                  {user.role.toUpperCase()}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-zinc-500" />
                  {user.email || "No email provided"}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                  Joined {user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "N/A"}
                </span>
                <span className="text-[11px] font-mono text-zinc-600">
                  Clerk ID: {user.clerkId}
                </span>
              </div>
            </div>
          </div>

          {/* Role Changer Dropdown */}
          <div className="flex items-center gap-3 p-3 bg-zinc-950/60 rounded-xl border border-zinc-800/80 shrink-0">
            <span className="text-xs text-zinc-400 font-medium">Assign Role:</span>
            <div className="relative">
              <select
                value={user.role}
                disabled={isUpdatingRole}
                onChange={(e) => handleRoleChange(e.target.value as UserRole)}
                className="bg-zinc-900 border border-zinc-700 text-xs font-semibold text-zinc-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500 disabled:opacity-50 cursor-pointer"
              >
                <option value="student">Student</option>
                <option value="instructor">Instructor</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
            {isUpdatingRole && <Loader2 className="w-4 h-4 animate-spin text-amber-400" />}
          </div>
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/80 space-y-1">
          <div className="flex items-center gap-1.5 text-zinc-400 text-xs">
            <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
            <span>Enrolled Courses</span>
          </div>
          <p className="text-2xl font-bold text-white">{enrollments.length}</p>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/80 space-y-1">
          <div className="flex items-center gap-1.5 text-zinc-400 text-xs">
            <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
            <span>Created Courses</span>
          </div>
          <p className="text-2xl font-bold text-white">{createdCourses.length}</p>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/80 space-y-1">
          <div className="flex items-center gap-1.5 text-zinc-400 text-xs">
            <Search className="w-3.5 h-3.5 text-emerald-400" />
            <span>Search Queries</span>
          </div>
          <p className="text-2xl font-bold text-white">{searchStats.totalSearches}</p>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/80 space-y-1">
          <div className="flex items-center gap-1.5 text-zinc-400 text-xs">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>AI Requests</span>
          </div>
          <p className="text-2xl font-bold text-white">{aiStats.totalRequests}</p>
          <span className="text-[10px] text-zinc-500 block">
            {aiStats.totalTokens.toLocaleString()} tokens
          </span>
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Enrolled Courses & Created Courses */}
        <div className="space-y-8">
          {/* Enrolled Courses */}
          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-semibold text-white">Enrolled Courses & Progress</h3>
              </div>
              <span className="text-xs text-zinc-500">{enrollments.length} active</span>
            </div>

            {enrollments.length === 0 ? (
              <p className="text-xs text-zinc-500 py-4 text-center border border-dashed border-zinc-800 rounded-xl">
                This user has not enrolled in any courses yet.
              </p>
            ) : (
              <div className="divide-y divide-zinc-800/60">
                {enrollments.map((enr) => (
                  <div key={enr._id} className="py-3 flex items-center justify-between gap-4">
                    <div className="min-w-0 space-y-1">
                      <Link
                        href={`/courses/${enr.courseId}`}
                        className="text-xs font-semibold text-zinc-200 hover:text-indigo-400 flex items-center gap-1.5 truncate"
                      >
                        <span>{enr.courseTitle}</span>
                        <ExternalLink className="w-3 h-3 text-zinc-500 shrink-0" />
                      </Link>
                      <div className="flex items-center gap-2 text-[11px] text-zinc-500">
                        <span>Enrolled {new Date(enr.enrolledAt).toLocaleDateString()}</span>
                        {enr.completed && (
                          <span className="text-emerald-400 font-medium">Completed</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="w-24 bg-zinc-800 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-indigo-500 h-full rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(100, Math.max(0, enr.progressPercentage))}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-zinc-300 min-w-[2.5rem] text-right">
                        {enr.progressPercentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Created Courses (Instructors/Admins) */}
          {createdCourses.length > 0 && (
            <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-semibold text-white">Authored Courses</h3>
                </div>
                <span className="text-xs text-zinc-500">{createdCourses.length} authored</span>
              </div>

              <div className="divide-y divide-zinc-800/60">
                {createdCourses.map((c) => (
                  <div key={c._id} className="py-3 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <Link
                        href={`/instructor/courses/${c._id}`}
                        className="text-xs font-semibold text-zinc-200 hover:text-amber-400 truncate block"
                      >
                        {c.title}
                      </Link>
                      <p className="text-[11px] text-zinc-500">
                        {c.category} • Level: {c.level}
                      </p>
                    </div>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                        c.published
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-zinc-800 text-zinc-400 border-zinc-700"
                      }`}
                    >
                      {c.published ? "Published" : "Draft"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Search, AI & Platform Activity */}
        <div className="space-y-8">
          {/* Search Queries */}
          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-semibold text-white">Recent Search Activity</h3>
              </div>
              <span className="text-xs text-zinc-500">{searchStats.totalSearches} total queries</span>
            </div>

            {searchStats.recentQueries.length === 0 ? (
              <p className="text-xs text-zinc-500 py-3 text-center border border-dashed border-zinc-800 rounded-xl">
                No search queries recorded for this user.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {searchStats.recentQueries.map((query, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 font-medium"
                  >
                    &ldquo;{query}&rdquo;
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* AI Usage Activity */}
          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-semibold text-white">Recent AI Requests</h3>
              </div>
              <span className="text-xs text-zinc-500">{aiStats.totalRequests} total</span>
            </div>

            {aiStats.recentRequests.length === 0 ? (
              <p className="text-xs text-zinc-500 py-3 text-center border border-dashed border-zinc-800 rounded-xl">
                No AI requests logged for this user.
              </p>
            ) : (
              <div className="divide-y divide-zinc-800/60">
                {aiStats.recentRequests.map((ai) => (
                  <div key={ai._id} className="py-2.5 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold text-zinc-200">
                        {ai.feature.replace(/_/g, " ")}
                      </p>
                      <p className="text-[11px] text-zinc-500">
                        {new Date(ai.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <div className="text-right space-y-0.5">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded border inline-block ${
                          ai.success
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-red-500/10 text-red-400 border-red-500/20"
                        }`}
                      >
                        {ai.success ? "Success" : "Failed"}
                      </span>
                      {ai.totalTokens && (
                        <p className="text-[10px] text-zinc-400 font-mono">
                          {ai.totalTokens} tokens
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Platform Activity Feed for User */}
          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-semibold text-white">Audit Trail & Activities</h3>
              </div>
              <span className="text-xs text-zinc-500">{activities.length} recorded</span>
            </div>

            {activities.length === 0 ? (
              <p className="text-xs text-zinc-500 py-3 text-center border border-dashed border-zinc-800 rounded-xl">
                No administrative or platform activity recorded yet.
              </p>
            ) : (
              <div className="space-y-2.5">
                {activities.map((act) => (
                  <div
                    key={act._id}
                    className="p-3 rounded-xl bg-zinc-950/70 border border-zinc-800/60 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-zinc-200">
                        {act.type.replace(/_/g, " ")}
                      </span>
                      <span className="text-[10px] text-zinc-500">
                        {new Date(act.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-zinc-400 text-[11px]">{act.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
