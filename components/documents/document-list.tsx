"use client";

import { useState } from "react";
import {
  FileText,
  FileCode,
  Trash2,
  Calendar,
  Layers,
  Search,
  AlertCircle,
  CheckCircle2,
  Clock,
  ExternalLink,
  BookOpen,
} from "lucide-react";
import type { LearningDocumentDTO } from "@/types/document";
import type { CourseDTO } from "@/types/course";

interface DocumentListProps {
  documents: LearningDocumentDTO[];
  courses: CourseDTO[];
  onDelete: (id: string) => void;
}

export function DocumentList({ documents, courses, onDelete }: DocumentListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const courseMap = new Map<string, string>();
  courses.forEach((c) => courseMap.set(c._id, c.title));

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.description && doc.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      doc.fileName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || doc.fileType === selectedType;
    return matchesSearch && matchesType;
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this document? All search embeddings will also be removed.")) {
      return;
    }

    setDeletingId(id);
    setDeleteError(null);

    try {
      const res = await fetch(`/api/documents/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to delete document");
      }

      onDelete(id);
    } catch (err: unknown) {
      setDeleteError(err instanceof Error ? err.message : "Failed to delete document");
    } finally {
      setDeletingId(null);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search documents by title or filename..."
            className="w-full pl-9 pr-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        <div className="flex gap-2">
          {["all", "pdf", "txt", "md"].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium uppercase tracking-wider transition-colors ${
                selectedType === type
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {deleteError && (
        <div className="p-3 bg-red-950/40 border border-red-800/50 rounded-lg text-sm text-red-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{deleteError}</span>
        </div>
      )}

      {/* Documents List */}
      {filteredDocs.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/20">
          <FileText className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
          <h3 className="text-zinc-300 font-medium text-base mb-1">No documents found</h3>
          <p className="text-zinc-500 text-sm max-w-sm mx-auto">
            {searchTerm || selectedType !== "all"
              ? "Try adjusting your search or filters."
              : "Upload PDF, Markdown, or text files to add them to your AI search index."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDocs.map((doc) => {
            const courseTitle = doc.courseId ? courseMap.get(doc.courseId) : null;

            return (
              <div
                key={doc._id}
                className="group relative p-5 bg-zinc-900/70 border border-zinc-800/80 hover:border-zinc-700/80 rounded-xl transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                          doc.fileType === "pdf"
                            ? "bg-red-950/50 text-red-400 border border-red-800/40"
                            : doc.fileType === "md"
                            ? "bg-blue-950/50 text-blue-400 border border-blue-800/40"
                            : "bg-emerald-950/50 text-emerald-400 border border-emerald-800/40"
                        }`}
                      >
                        {doc.fileType === "md" ? (
                          <FileCode className="w-5 h-5" />
                        ) : (
                          <FileText className="w-5 h-5" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-zinc-100 font-medium text-sm truncate group-hover:text-indigo-300 transition-colors">
                          {doc.title}
                        </h4>
                        <p className="text-zinc-500 text-xs truncate">{doc.fileName}</p>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="shrink-0">
                      {doc.processingStatus === "completed" && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800/50">
                          <CheckCircle2 className="w-3 h-3" />
                          Ready
                        </span>
                      )}
                      {doc.processingStatus === "processing" && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-amber-950/60 text-amber-400 border border-amber-800/50">
                          <Clock className="w-3 h-3 animate-spin" />
                          Processing
                        </span>
                      )}
                      {doc.processingStatus === "failed" && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-red-950/60 text-red-400 border border-red-800/50" title={doc.processingError}>
                          <AlertCircle className="w-3 h-3" />
                          Failed
                        </span>
                      )}
                    </div>
                  </div>

                  {doc.description && (
                    <p className="text-zinc-400 text-xs line-clamp-2 mt-2 mb-3">
                      {doc.description}
                    </p>
                  )}
                </div>

                <div className="pt-3 mt-3 border-t border-zinc-800/60 flex items-center justify-between text-xs text-zinc-500">
                  <div className="flex items-center gap-3">
                    <span>{formatFileSize(doc.fileSize)}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-zinc-600" />
                      {formatDate(doc.createdAt)}
                    </span>
                    {courseTitle && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-indigo-400 max-w-[120px] truncate" title={courseTitle}>
                          <BookOpen className="w-3 h-3 shrink-0" />
                          <span className="truncate">{courseTitle}</span>
                        </span>
                      </>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDelete(doc._id)}
                    disabled={deletingId === doc._id}
                    aria-label={`Delete ${doc.title}`}
                    className="text-zinc-500 hover:text-red-400 disabled:opacity-50 p-1 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
