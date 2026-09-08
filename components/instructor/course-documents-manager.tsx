"use client";

import { useState, useEffect } from "react";
import {
  FileUp,
  FileText,
  FileCode,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Clock,
  Sparkles,
  Loader2,
} from "lucide-react";
import type { CourseDTO } from "@/types/course";
import type { LearningDocumentDTO } from "@/types/document";
import { DocumentUpload } from "@/components/documents/document-upload";

interface CourseDocumentsManagerProps {
  course: CourseDTO;
}

export function CourseDocumentsManager({ course }: CourseDocumentsManagerProps) {
  const [documents, setDocuments] = useState<LearningDocumentDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const res = await fetch(`/api/documents?courseId=${course._id}`);
        const data = await res.json();
        if (!ignore && data.success && Array.isArray(data.data)) {
          setDocuments(data.data);
        }
      } catch (err) {
        console.error("Failed to load course documents:", err);
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }
    void load();
    return () => {
      ignore = true;
    };
  }, [course._id]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this document? Its search embeddings will also be removed.")) {
      return;
    }

    try {
      const res = await fetch(`/api/documents/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete document");
      }

      setDocuments((prev) => prev.filter((d) => d._id !== id));
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Failed to delete document");
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-8">
      {/* Header Info Banner */}
      <div className="p-4 bg-indigo-950/30 border border-indigo-800/40 rounded-2xl flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
        <div className="text-xs">
          <h4 className="font-semibold text-indigo-200">Course Knowledge Intelligence</h4>
          <p className="text-indigo-300/80 mt-0.5 leading-relaxed">
            Attach PDF reading packets, Markdown reference sheets, or lecture transcripts to
            &ldquo;{course.title}&rdquo;. SmartLearn automatically extracts text, creates semantic
            chunks, generates embeddings, and includes them when students query this course.
          </p>
        </div>
      </div>

      {deleteError && (
        <div className="p-3 bg-red-950/40 border border-red-800/50 rounded-lg text-xs text-red-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400" />
          <span>{deleteError}</span>
        </div>
      )}

      {/* Upload Toggle / Form */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-zinc-200">
            Attached Documents ({documents.length})
          </h3>

          <button
            type="button"
            onClick={() => setIsUploading(!isUploading)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-colors"
          >
            <FileUp className="w-3.5 h-3.5" />
            <span>{isUploading ? "Close Upload" : "Upload Document"}</span>
          </button>
        </div>

        {isUploading && (
          <div className="p-6 bg-zinc-900/90 border border-zinc-800 rounded-2xl">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-4">
              Upload New Document to {course.title}
            </h4>
            <DocumentUpload
              courses={[course]}
              onUploadSuccess={(doc) => {
                setDocuments((prev) => [doc, ...prev]);
                setIsUploading(false);
              }}
            />
          </div>
        )}
      </div>

      {/* Documents List */}
      {isLoading ? (
        <div className="p-10 text-center">
          <Loader2 className="w-6 h-6 animate-spin text-indigo-400 mx-auto mb-2" />
          <p className="text-xs text-zinc-500">Loading course materials...</p>
        </div>
      ) : documents.length === 0 ? (
        <div className="p-10 text-center border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/20 space-y-2">
          <FileText className="w-8 h-8 text-zinc-600 mx-auto mb-1" />
          <p className="text-xs text-zinc-400 font-medium">
            No documents attached to this course yet.
          </p>
          <p className="text-[11px] text-zinc-500 max-w-xs mx-auto">
            Upload PDFs or Markdown notes to give learners deep AI-searchable context.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {documents.map((doc) => (
            <div
              key={doc._id}
              className="p-4 bg-zinc-900/70 border border-zinc-800/80 rounded-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-1.5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        doc.fileType === "pdf"
                          ? "bg-red-950/50 text-red-400 border border-red-800/40"
                          : doc.fileType === "md"
                          ? "bg-blue-950/50 text-blue-400 border border-blue-800/40"
                          : "bg-emerald-950/50 text-emerald-400 border border-emerald-800/40"
                      }`}
                    >
                      {doc.fileType === "md" ? (
                        <FileCode className="w-4 h-4" />
                      ) : (
                        <FileText className="w-4 h-4" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h5 className="text-xs font-semibold text-zinc-100 truncate">
                        {doc.title}
                      </h5>
                      <p className="text-[11px] text-zinc-500 truncate">{doc.fileName}</p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="shrink-0">
                    {doc.processingStatus === "completed" && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/50">
                        <CheckCircle2 className="w-3 h-3" />
                        Ready
                      </span>
                    )}
                    {doc.processingStatus === "processing" && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-950 text-amber-400 border border-amber-800/50">
                        <Clock className="w-3 h-3 animate-spin" />
                        Processing
                      </span>
                    )}
                    {doc.processingStatus === "failed" && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-950 text-red-400 border border-red-800/50">
                        <AlertCircle className="w-3 h-3" />
                        Failed
                      </span>
                    )}
                  </div>
                </div>

                {doc.description && (
                  <p className="text-[11px] text-zinc-400 line-clamp-2 mt-1 mb-2">
                    {doc.description}
                  </p>
                )}
              </div>

              <div className="pt-2 mt-2 border-t border-zinc-800/60 flex items-center justify-between text-[11px] text-zinc-500">
                <div className="flex items-center gap-2">
                  <span>{formatFileSize(doc.fileSize)}</span>
                  <span>•</span>
                  <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleDelete(doc._id)}
                  className="text-zinc-500 hover:text-red-400 p-1 rounded transition-colors"
                  title="Delete Document"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
