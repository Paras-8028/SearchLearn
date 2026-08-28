import { auth } from "@clerk/nextjs/server";

export default async function SearchPage() {
  await auth.protect();

  return (
    <main className="p-6 md:p-10">
      <h1 className="text-3xl font-bold tracking-tight">
        Search
      </h1>

      <p className="mt-3 text-muted-foreground">
        Semantic search across your learning library is coming in Section 3.
      </p>
    </main>
  );
}