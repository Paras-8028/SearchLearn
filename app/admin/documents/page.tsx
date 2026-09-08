import { getDocuments } from "@/lib/db/repositories/documents";
import { AdminDocumentsList } from "@/components/admin/admin-documents-list";
import { ShieldCheck } from "lucide-react";

export const revalidate = 0;

export default async function AdminDocumentsPage() {
  const documents = await getDocuments();

  return (
    <main className="p-6 md:p-10">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-800/80 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Content Administration
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Document Management
            </h1>
            <p className="text-sm text-zinc-400 mt-1 max-w-2xl">
              Audit all uploaded platform documents, monitor AI chunking status, and trigger text extraction or vector reprocessing.
            </p>
          </div>
        </div>

        {/* Documents Table */}
        <AdminDocumentsList initialDocuments={documents} />
      </div>
    </main>
  );
}
