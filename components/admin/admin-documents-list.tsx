"use client";

import { useState } from "react";
import {
  FileText,
  Search,
  RefreshCw,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Clock,
  Loader2,
  FileCode,
  Eye,
  X,
} from "lucide-react";
import type { LearningDocumentDTO } from "@/types/document";

interface AdminDocumentsListProps {
  initialDocuments: LearningDocumentDTO[];
}

export function AdminDocumentsList({ initialDocuments }: AdminDocumentsListProps) {
  const [documents, setDocuments] = useState<LearningDocumentDTO[]>(initialDocuments);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [reprocessingId, setReprocessingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<LearningDocumentDTO | null>(null);
  const [actionMessage, setActionMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.description && doc.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === "all" || doc.processingStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleReprocess = async (doc: LearningDocumentDTO) => {
    setReprocessingId(doc._id);
    setActionMessage(null);

    try {
      const res = await fetch(`/api/admin/documents/${doc._id}/reprocess`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to reprocess document");
      }

      setDocuments((prev) =>
        prev.map((d) => (d._id === doc._id ? data.data : d))
      );

      setActionMessage({
        text: `Document "${doc.title}" reprocessed successfully (${data.chunksCount} chunks, ${data.embeddingsCount} embeddings).`,
        isError: false,
      });
    } catch (err) {
      setActionMessage({
        text: err instanceof Error ? err.message : "Reprocessing failed",
        isError: true,
      });
    } finally {
      setReprocessingId(null);
    }
  };

  const handleDelete = async (doc: LearningDocumentDTO) => {
    if (
      !confirm(
        `Are you sure you want to delete "${doc.title}"? All search embeddings and chunks will be permanently removed.`
      )
    ) {
      return;
    }

    setDeletingId(doc._id);
    setActionMessage(null);

    try {
      const res = await fetch(`/api/documents/${doc._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to delete document");
      }

      setDocuments((prev) => prev.filter((d) => d._id !== doc._id));
      setActionMessage({
        text: `Document "${doc.title}" deleted successfully.`,
        isError: false,
      });
    } catch (err) {
      setActionMessage({
        text: err instanceof Error ? err.message : "Failed to delete document",
        isError: true,
      });
    } finally {
      setDeletingId(null);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800/50">
            <CheckCircle2 className="w-3 h-3" />
            <span>Completed</span>
          </span>
        );
      case "processing":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-950/60 text-amber-400 border border-amber-800/50">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span>Processing</span>
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-950/60 text-red-400 border border-red-800/50">
            <AlertCircle className="w-3 h-3" />
            <span>Failed</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">
            <Clock className="w-3 h-3" />
            <span>Pending</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Feedback Banner */}
      {actionMessage && (
        <div
          className={`p-4 rounded-xl border text-xs font-medium flex items-center justify-between gap-3 ${
            actionMessage.isError
              ? "bg-red-500/10 border-red-500/20 text-red-400"
              : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
          }`}
        >
          <div className="flex items-center gap-2">
            {actionMessage.isError ? (
              <AlertCircle className="w-4 h-4 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            )}
            <span>{actionMessage.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setActionMessage(null)}
            className="text-zinc-500 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search documents by title, filename, or uploader..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-zinc-900/80 border border-zinc-800 rounded-xl text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400 font-medium">Status:</span>
          <div className="inline-flex rounded-lg border border-zinc-800 bg-zinc-900/80 p-0.5">
            {["all", "completed", "processing", "pending", "failed"].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium capitalize transition-colors ${
                  statusFilter === status
                    ? "bg-zinc-800 text-white shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Documents Table */}
      <div className="overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/60 backdrop-blur">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-zinc-950/80 text-zinc-400 uppercase text-[10px] tracking-wider border-b border-zinc-800">
              <tr>
                <th className="py-3.5 px-5 font-semibold">Document</th>
                <th className="py-3.5 px-5 font-semibold">Format</th>
                <th className="py-3.5 px-5 font-semibold">Size</th>
                <th className="py-3.5 px-5 font-semibold">Status</th>
                <th className="py-3.5 px-5 font-semibold">Uploaded</th>
                <th className="py-3.5 px-5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-500">
                    <FileText className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
                    <p className="text-xs font-medium">No documents match your query.</p>
                  </td>
                </tr>
              ) : (
                filteredDocs.map((doc) => {
                  const isReprocessing = reprocessingId === doc._id;
                  const isDeleting = deletingId === doc._id;

                  return (
                    <tr key={doc._id} className="hover:bg-zinc-850/40 transition-colors">
                      {/* Document Name */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-xl bg-zinc-800/70 text-indigo-400 border border-zinc-700/60 shrink-0">
                            {doc.fileType === "md" ? (
                              <FileCode className="w-4 h-4" />
                            ) : (
                              <FileText className="w-4 h-4" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-zinc-200 truncate max-w-xs sm:max-w-sm">
                              {doc.title}
                            </p>
                            <p className="text-[11px] text-zinc-500 truncate">{doc.fileName}</p>
                          </div>
                        </div>
                      </td>

                      {/* Format */}
                      <td className="py-4 px-5 uppercase font-mono text-[11px] text-zinc-400">
                        {doc.fileType}
                      </td>

                      {/* Size */}
                      <td className="py-4 px-5 text-zinc-400 whitespace-nowrap">
                        {formatFileSize(doc.fileSize)}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-5">{getStatusBadge(doc.processingStatus)}</td>

                      {/* Uploaded */}
                      <td className="py-4 px-5 text-zinc-400 whitespace-nowrap">
                        {new Date(doc.createdAt).toLocaleDateString()}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedDoc(doc)}
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors text-xs"
                            title="View Metadata"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleReprocess(doc)}
                            disabled={isReprocessing || doc.processingStatus === "processing"}
                            className="p-1.5 rounded-lg text-amber-400 hover:text-amber-300 hover:bg-zinc-800 transition-colors text-xs disabled:opacity-50"
                            title="Reprocess Document & Embeddings"
                          >
                            <RefreshCw className={`w-3.5 h-3.5 ${isReprocessing ? "animate-spin" : ""}`} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(doc)}
                            disabled={isDeleting}
                            className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-zinc-800 transition-colors text-xs disabled:opacity-50"
                            title="Delete Document"
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
          <span>Showing {filteredDocs.length} of {documents.length} documents</span>
          <span className="text-[11px]">⚡ Reprocessing recalculates chunks & semantic embeddings</span>
        </div>
      </div>

      {/* Document Inspection Drawer/Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-semibold text-white">Document Metadata</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDoc(null)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-3 gap-2 py-1 border-b border-zinc-800/50">
                <span className="text-zinc-500 font-medium">Title:</span>
                <span className="col-span-2 text-zinc-200 font-semibold">{selectedDoc.title}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 py-1 border-b border-zinc-800/50">
                <span className="text-zinc-500 font-medium">File Name:</span>
                <span className="col-span-2 text-zinc-300 font-mono text-[11px]">{selectedDoc.fileName}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 py-1 border-b border-zinc-800/50">
                <span className="text-zinc-500 font-medium">Size:</span>
                <span className="col-span-2 text-zinc-300">{formatFileSize(selectedDoc.fileSize)}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 py-1 border-b border-zinc-800/50">
                <span className="text-zinc-500 font-medium">Uploader Clerk ID:</span>
                <span className="col-span-2 text-zinc-400 font-mono text-[11px]">{selectedDoc.uploadedBy}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 py-1 border-b border-zinc-800/50">
                <span className="text-zinc-500 font-medium">Course Scope:</span>
                <span className="col-span-2 text-zinc-300">{selectedDoc.courseId || "Platform Wide"}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 py-1 border-b border-zinc-800/50">
                <span className="text-zinc-500 font-medium">Status:</span>
                <span className="col-span-2">{getStatusBadge(selectedDoc.processingStatus)}</span>
              </div>

              {selectedDoc.extractedText && (
                <div className="space-y-1 pt-2">
                  <span className="text-zinc-500 font-medium">Extracted Text Sample:</span>
                  <div className="max-h-40 overflow-y-auto p-3 bg-zinc-950 rounded-xl border border-zinc-800 text-[11px] font-mono text-zinc-400 whitespace-pre-wrap">
                    {selectedDoc.extractedText.slice(0, 800)}...
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  const doc = selectedDoc;
                  setSelectedDoc(null);
                  handleReprocess(doc);
                }}
                className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-sm transition-colors"
              >
                Reprocess Now
              </button>
              <button
                type="button"
                onClick={() => setSelectedDoc(null)}
                className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
