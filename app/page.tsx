export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <p className="mb-4 text-sm font-medium text-primary">
          AI-Powered Learning Search
        </p>

        <h1 className="text-5xl font-bold tracking-tight">
          SearchLearn
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          Search, understand, and learn across your entire learning library
          using natural-language and semantic search.
        </p>
      </div>
    </main>
  );
}