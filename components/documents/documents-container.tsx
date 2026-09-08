"use client";

import { useState } from "react";
import { FileUp, BookOpen, Layers, Sparkles } from "lucide-react";
import { DocumentUpload } from "@/components/documents/document-upload";
import { DocumentList } from "@/components/documents/document-list";
import type { LearningDocumentDTO } from "@/types/document";
import type { CourseDTO } from "@/types/course";

interface DocumentsContainerProps {
  initialDocuments: LearningDocumentDTO[];
  courses: CourseDTO[];
}

export function DocumentsContainer({
  initialDocuments,
  courses,
}: DocumentsContainerProps) {
  const [documents, setDocuments] = useState<LearningDocumentDTO[]>(initialDocuments);
  const [activeTab, setActiveTab] = useState<"library" | "upload">("library");

  const handleUploadSuccess = (newDoc: LearningDocumentDTO) => {
    setDocuments((prev) => [newDoc, ...prev]);
    setActiveTab("library");
  };

  const handleDelete = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d._id !== id));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-zinc-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            AI Knowledge Vault
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Document Intelligence
          </h1>
          <p className="text-sm text-zinc-400 mt-1 max-w-xl">
            Upload PDF notes, Markdown guides, and reading materials. SearchLearn
            automatically extracts, segments, generates vector embeddings, and links them to
            AI semantic search and assistant answers.
          </p>
        </div>

        {/* Action Toggle */}
        <div className="flex items-center gap-2 bg-zinc-900/90 border border-zinc-800 p-1 rounded-xl shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab("library")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
              activeTab === "library"
                ? "bg-indigo-600 text-white shadow"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Library ({documents.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("upload")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
              activeTab === "upload"
                ? "bg-indigo-600 text-white shadow"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <FileUp className="w-3.5 h-3.5" />
            Upload Document
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === "upload" ? (
        <div className="max-w-2xl mx-auto py-2">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-zinc-100">Upload New Material</h2>
            <p className="text-xs text-zinc-400">
              Attach documents to your library or associate them with a specific course.
            </p>
          </div>
          <DocumentUpload courses={courses} onUploadSuccess={handleUploadSuccess} />
        </div>
      ) : (
        <DocumentList
          documents={documents}
          courses={courses}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
