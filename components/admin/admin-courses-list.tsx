"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Settings2,
  Trash2,
  Eye,
  AlertCircle,
} from "lucide-react";
import type { CourseDTO } from "@/types/course";

interface AdminCoursesListProps {
  initialCourses: CourseDTO[];
}

export function AdminCoursesList({ initialCourses }: AdminCoursesListProps) {
  const [courses, setCourses] = useState<CourseDTO[]>(initialCourses);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.category && c.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
      c.instructorId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "published" && c.published) ||
      (statusFilter === "draft" && !c.published);

    return matchesSearch && matchesStatus;
  });

  const handleDeleteCourse = async (id: string, title: string) => {
    if (
      !confirm(
        `[ADMIN ACTION]: Are you sure you want to permanently delete course "${title}"? This will cascade to all modules, lessons, documents, and search index chunks.`
      )
    ) {
      return;
    }

    setDeletingId(id);
    setDeleteError(null);

    try {
      const res = await fetch(`/api/courses/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to delete course");
      }

      setCourses((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Failed to delete course");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {deleteError && (
        <div className="p-4 bg-red-950/40 border border-red-800/60 rounded-xl text-xs text-red-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{deleteError}</span>
        </div>
      )}

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search all platform courses by title, instructorId, or category..."
            className="w-full pl-10 pr-4 py-2 bg-zinc-900/60 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        <div className="flex gap-2">
          {(["all", "published", "draft"] as const).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${
                statusFilter === status
                  ? "bg-amber-600 text-white shadow-sm"
                  : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Courses Table */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-zinc-950/80 border-b border-zinc-800 text-[11px] uppercase tracking-wider text-zinc-400 font-semibold">
              <tr>
                <th className="py-3.5 px-5">Course</th>
                <th className="py-3.5 px-5">Instructor ID</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5">Level</th>
                <th className="py-3.5 px-5">Created</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filteredCourses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-500">
                    No courses match your filter.
                  </td>
                </tr>
              ) : (
                filteredCourses.map((c) => (
                  <tr key={c._id} className="hover:bg-zinc-850/50 transition-colors">
                    <td className="py-4 px-5">
                      <div className="min-w-0 max-w-sm">
                        <span className="text-[10px] uppercase font-bold text-indigo-400">
                          {c.category || "General"}
                        </span>
                        <p className="font-semibold text-zinc-100 truncate text-sm">
                          {c.title}
                        </p>
                        <p className="text-zinc-400 text-xs line-clamp-1 mt-0.5">
                          {c.description}
                        </p>
                      </div>
                    </td>

                    <td className="py-4 px-5 font-mono text-[11px] text-zinc-500 truncate max-w-[140px]">
                      {c.instructorId}
                    </td>

                    <td className="py-4 px-5">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                          c.published
                            ? "bg-emerald-950/60 text-emerald-400 border-emerald-800/50"
                            : "bg-amber-950/60 text-amber-400 border-amber-800/50"
                        }`}
                      >
                        {c.published ? "Published" : "Draft"}
                      </span>
                    </td>

                    <td className="py-4 px-5 capitalize text-zinc-400">
                      {c.level || "Beginner"}
                    </td>

                    <td className="py-4 px-5 text-zinc-400 whitespace-nowrap">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-4 px-5 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        {c.published && (
                          <Link
                            href={`/courses/${c._id}`}
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors text-xs"
                            title="Preview Course"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>
                        )}

                        <Link
                          href={`/instructor/courses/${c._id}`}
                          className="p-1.5 rounded-lg text-indigo-400 hover:text-indigo-300 hover:bg-zinc-800 transition-colors text-xs"
                          title="Manage Curriculum & Content"
                        >
                          <Settings2 className="w-3.5 h-3.5" />
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleDeleteCourse(c._id, c.title)}
                          disabled={deletingId === c._id}
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-zinc-800 transition-colors text-xs"
                          title="Delete Course (Admin)"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-zinc-950/60 border-t border-zinc-800 text-xs text-zinc-500">
          Total Courses Managed: {filteredCourses.length}
        </div>
      </div>
    </div>
  );
}
