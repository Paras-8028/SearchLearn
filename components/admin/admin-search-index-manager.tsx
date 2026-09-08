"use client";

import { useState } from "react";
import {
  Database,
  Search,
  RefreshCw,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
  BookOpen,
  Layers,
  FileText,
  X,
} from "lucide-react";
import type { GroupedSearchSource } from "@/lib/db/repositories/search";

interface AdminSearchIndexManagerProps {
  initialStats: {
    totalDocuments: number;
    totalChunks: number;
    withEmbeddings: number;
    withoutEmbeddings: number;
    byType: Record<string, number>;
  };
  initialSources: GroupedSearchSource[];
}

export function AdminSearchIndexManager({
  initialStats,
  initialSources,
}: AdminSearchIndexManagerProps) {
  const [stats, setStats] = useState(initialStats);
  const [sources, setSources] = useState<GroupedSearchSource[]>(initialSources);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [isBulkReindexing, setIsBulkReindexing] = useState(false);
  const [reindexingSourceId, setReindexingSourceId] = useState<string | null>(null);
  const [deletingSourceId, setDeletingSourceId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const filteredSources = sources.filter((s) => {
    const matchesSearch =
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.courseTitle && s.courseTitle.toLowerCase().includes(searchTerm.toLowerCase())) ||
      s.sourceId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === "all" || s.sourceType === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleBulkReindex = async () => {
    if (
      !confirm(
        "Are you sure you want to reindex all published content and documents across the entire platform? This will regenerate text chunks and vector embeddings."
      )
    ) {
      return;
    }

    setIsBulkReindexing(true);
    setStatusMessage(null);

    try {
      const res = await fetch("/api/admin/search-index", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reindex_all" }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Bulk reindex failed");
      }

      setStatusMessage({
        text: data.message || "Bulk reindexing completed successfully.",
        isError: false,
      });

      // Refresh stats
      const refreshRes = await fetch("/api/admin/search-index");
      const refreshData = await refreshRes.json();
      if (refreshData.success) {
        setStats(refreshData.data.stats);
        setSources(refreshData.data.sources);
      }
    } catch (err) {
      setStatusMessage({
        text: err instanceof Error ? err.message : "Bulk reindex failed",
        isError: true,
      });
    } finally {
      setIsBulkReindexing(false);
    }
  };

  const handleReindexSource = async (source: GroupedSearchSource) => {
    setReindexingSourceId(source.sourceId);
    setStatusMessage(null);

    try {
      const res = await fetch("/api/admin/search-index", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reindex_source",
          sourceId: source.sourceId,
          sourceType: source.sourceType,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to reindex source");
      }

      setStatusMessage({
        text: data.message || `Reindexed ${source.title} successfully.`,
        isError: false,
      });

      // Refresh stats
      const refreshRes = await fetch("/api/admin/search-index");
      const refreshData = await refreshRes.json();
      if (refreshData.success) {
        setStats(refreshData.data.stats);
        setSources(refreshData.data.sources);
      }
    } catch (err) {
      setStatusMessage({
        text: err instanceof Error ? err.message : "Reindexing failed",
        isError: true,
      });
    } finally {
      setReindexingSourceId(null);
    }
  };

  const handleDeleteIndex = async (source: GroupedSearchSource) => {
    if (
      !confirm(
        `Delete all vector search documents for "${source.title}"? Learners won't be able to find this content via semantic search until reindexed.`
      )
    ) {
      return;
    }

    setDeletingSourceId(source.sourceId);
    setStatusMessage(null);

    try {
      const res = await fetch(`/api/admin/search-index/${source.sourceId}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to delete search index chunks");
      }

      setSources((prev) => prev.filter((s) => s.sourceId !== source.sourceId));
      setStatusMessage({
        text: `Deleted ${data.deletedCount} index chunks for "${source.title}".`,
        isError: false,
      });
    } catch (err) {
      setStatusMessage({
        text: err instanceof Error ? err.message : "Deletion failed",
        isError: true,
      });
    } finally {
      setDeletingSourceId(null);
    }
  };

  const getSourceIcon = (type: string) => {
    switch (type) {
      case "course":
        return <BookOpen className="w-3.5 h-3.5 text-indigo-400" />;
      case "lesson":
        return <Layers className="w-3.5 h-3.5 text-amber-400" />;
      case "document":
        return <FileText className="w-3.5 h-3.5 text-emerald-400" />;
      default:
        return <Database className="w-3.5 h-3.5 text-zinc-400" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Feedback Banner */}
      {statusMessage && (
        <div
          className={`p-4 rounded-xl border text-xs font-medium flex items-center justify-between gap-3 ${
            statusMessage.isError
              ? "bg-red-500/10 border-red-500/20 text-red-400"
              : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
          }`}
        >
          <div className="flex items-center gap-2">
            {statusMessage.isError ? (
              <AlertCircle className="w-4 h-4 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setStatusMessage(null)}
            className="text-zinc-500 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Action Header & Summary KPIs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white">Search Vector Index</h2>
          <p className="text-xs text-zinc-400">
            Semantic search index powered by OpenAI embeddings & MongoDB vector retrieval.
          </p>
        </div>

        <button
          type="button"
          onClick={handleBulkReindex}
          disabled={isBulkReindexing}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white text-xs font-semibold shadow-sm transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isBulkReindexing ? "animate-spin" : ""}`} />
          <span>{isBulkReindexing ? "Reindexing Entire Platform..." : "Reindex All Content"}</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-1">
          <span className="text-xs text-zinc-400">Indexed Sources</span>
          <p className="text-2xl font-bold text-white">{stats.totalDocuments}</p>
          <span className="text-[10px] text-zinc-500">
            Courses, Lessons & Documents
          </span>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-1">
          <span className="text-xs text-zinc-400">Searchable Chunks</span>
          <p className="text-2xl font-bold text-white">{stats.totalChunks}</p>
          <span className="text-[10px] text-zinc-500">
            Normalized text segments
          </span>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-1">
          <span className="text-xs text-zinc-400">Vector Embeddings</span>
          <p className="text-2xl font-bold text-emerald-400">{stats.withEmbeddings}</p>
          <span className="text-[10px] text-emerald-500/80 font-medium">
            1536-dim vector indexed
          </span>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-1">
          <span className="text-xs text-zinc-400">Pending Vectorization</span>
          <p className="text-2xl font-bold text-amber-400">{stats.withoutEmbeddings}</p>
          <span className="text-[10px] text-amber-500/80">
            Fallback keyword only
          </span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Filter indexed content by title, course, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-zinc-900/80 border border-zinc-800 rounded-xl text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400 font-medium">Source Type:</span>
          <div className="inline-flex rounded-lg border border-zinc-800 bg-zinc-900/80 p-0.5">
            {["all", "course", "lesson", "document"].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setTypeFilter(type)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium capitalize transition-colors ${
                  typeFilter === type
                    ? "bg-zinc-800 text-white shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sources Table */}
      <div className="overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/60 backdrop-blur">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-zinc-950/80 text-zinc-400 uppercase text-[10px] tracking-wider border-b border-zinc-800">
              <tr>
                <th className="py-3.5 px-5 font-semibold">Content Source</th>
                <th className="py-3.5 px-5 font-semibold">Type</th>
                <th className="py-3.5 px-5 font-semibold">Course Scope</th>
                <th className="py-3.5 px-5 font-semibold">Chunks</th>
                <th className="py-3.5 px-5 font-semibold">Vector Status</th>
                <th className="py-3.5 px-5 font-semibold">Last Synced</th>
                <th className="py-3.5 px-5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filteredSources.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-500">
                    <Database className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
                    <p className="text-xs font-medium">No indexed sources found.</p>
                  </td>
                </tr>
              ) : (
                filteredSources.map((source) => {
                  const isReindexing = reindexingSourceId === source.sourceId;
                  const isDeleting = deletingSourceId === source.sourceId;

                  return (
                    <tr key={source.sourceId} className="hover:bg-zinc-850/40 transition-colors">
                      {/* Title */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-2.5">
                          <div className="p-1.5 rounded-lg bg-zinc-800/80 shrink-0">
                            {getSourceIcon(source.sourceType)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-zinc-200 truncate max-w-xs sm:max-w-sm">
                              {source.title}
                            </p>
                            <p className="font-mono text-[10px] text-zinc-500 truncate">
                              ID: {source.sourceId}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Source Type */}
                      <td className="py-4 px-5 uppercase font-mono text-[10px] text-zinc-400">
                        {source.sourceType}
                      </td>

                      {/* Course */}
                      <td className="py-4 px-5 text-zinc-400 truncate max-w-[150px]">
                        {source.courseTitle || "—"}
                      </td>

                      {/* Chunks Count */}
                      <td className="py-4 px-5 font-semibold text-zinc-200">
                        {source.chunkCount}
                      </td>

                      {/* Vector Status */}
                      <td className="py-4 px-5">
                        {source.hasEmbedding ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800/50">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Vectorized</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-950/60 text-amber-400 border border-amber-800/50">
                            <Clock className="w-3 h-3" />
                            <span>Keyword only</span>
                          </span>
                        )}
                      </td>

                      {/* Last Updated */}
                      <td className="py-4 px-5 text-zinc-400 whitespace-nowrap">
                        {new Date(source.lastUpdated).toLocaleDateString()}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleReindexSource(source)}
                            disabled={isReindexing}
                            className="p-1.5 rounded-lg text-amber-400 hover:text-amber-300 hover:bg-zinc-800 transition-colors text-xs disabled:opacity-50"
                            title="Reindex This Item"
                          >
                            <RefreshCw className={`w-3.5 h-3.5 ${isReindexing ? "animate-spin" : ""}`} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteIndex(source)}
                            disabled={isDeleting}
                            className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-zinc-800 transition-colors text-xs disabled:opacity-50"
                            title="Delete Search Chunks"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-zinc-950/60 border-t border-zinc-800 text-xs text-zinc-500 flex items-center justify-between">
          <span>Displaying {filteredSources.length} content source records</span>
          <span className="text-[11px]">Index targets: courses, lessons, and learning documents</span>
        </div>
      </div>
    </div>
  );
}
