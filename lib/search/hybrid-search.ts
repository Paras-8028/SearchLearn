import { semanticSearch } from "./semantic-search";
import { keywordSearch } from "./keyword-search";
import { rankHybridResults } from "./ranking";
import { isOpenAIConfigured } from "@/lib/ai/openai";
import type { SearchOptions, SearchResult } from "@/types/search";

export async function hybridSearch(options: SearchOptions): Promise<SearchResult[]> {
  const { query, contentTypes, courseId, limit = 20 } = options;

  const cleanQuery = query.trim();
  if (!cleanQuery) return [];

  let semanticResults: SearchResult[] = [];
  let keywordResults: SearchResult[] = [];

  const promises: Promise<any>[] = [];

  // Run Keyword Search
  promises.push(
    keywordSearch({
      query: cleanQuery,
      contentTypes,
      courseId,
      limit: limit * 2,
    })
      .then((res) => {
        keywordResults = res;
      })
      .catch((err) => {
        console.error("[HybridSearch] Keyword search error:", err);
      })
  );

  // Run Semantic Search if OpenAI is configured
  if (isOpenAIConfigured()) {
    promises.push(
      semanticSearch({
        query: cleanQuery,
        contentTypes,
        courseId,
        limit: limit * 2,
      })
        .then((res) => {
          semanticResults = res;
        })
        .catch((err) => {
          console.error("[HybridSearch] Semantic search error:", err);
        })
    );
  }

  await Promise.all(promises);

  // Rank and merge
  return rankHybridResults(semanticResults, keywordResults, cleanQuery, limit);
}
