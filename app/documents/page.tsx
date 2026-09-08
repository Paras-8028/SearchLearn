import { Metadata } from "next";
import { getDocuments } from "@/lib/db/repositories/documents";
import { getCourses } from "@/lib/db/repositories/courses";
import { DocumentsContainer } from "@/components/documents/documents-container";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Documents | SearchLearn Knowledge Intelligence",
  description:
    "Upload, process, and semantically search PDF, Markdown, and text learning documents on SearchLearn.",
};

export default async function DocumentsPage() {
  const [documents, courses] = await Promise.all([
    getDocuments(),
    getCourses({ publishedOnly: true }),
  ]);

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-background py-10">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <DocumentsContainer
          initialDocuments={documents}
          courses={courses}
        />
      </div>
    </main>
  );
}
