import { Metadata } from "next";
import { getCourses } from "@/lib/db/repositories/courses";
import { AskAi } from "@/components/ai/ask-ai";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Ask AI | SearchLearn Grounded Learning Assistant",
  description:
    "Ask conceptual questions and receive grounded answers synthesized directly from SearchLearn courses, lessons, and documents.",
};

export default async function AskPage() {
  const courses = await getCourses({ publishedOnly: true });

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-background py-10">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <AskAi courses={courses} />
      </div>
    </main>
  );
}
