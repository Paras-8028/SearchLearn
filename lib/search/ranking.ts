import type { SearchResult, RelevanceLabel } from "@/types/search";

export function getRelevanceLabel(score: number): RelevanceLabel {
  if (score >= 0.78) return "Highly Relevant";
  if (score >= 0.62) return "Relevant";
  return "Related";
}

/**
 * Combines semantic and keyword search results with normalized hybrid ranking
 */
export function rankHybridResults(
  semanticResults: SearchResult[],
  keywordResults: SearchResult[],
  query: string,
  limit: number = 20
): SearchResult[] {
  const lowerQuery = query.toLowerCase().trim();
  const mergedMap = new Map<
    string,
    {
      result: SearchResult;
      semanticScore: number;
      keywordScore: number;
    }
  >();

  // 1. Process Semantic Results (Weight: 70%)
  for (const item of semanticResults) {
    mergedMap.set(item.id, {
      result: item,
      semanticScore: item.score || 0.5,
      keywordScore: 0,
    });
  }

  // 2. Process Keyword Results (Weight: 30%)
  for (const item of keywordResults) {
    if (mergedMap.has(item.id)) {
      const existing = mergedMap.get(item.id)!;
      existing.keywordScore = item.score || 0.5;
    } else {
      mergedMap.set(item.id, {
        result: item,
        semanticScore: 0,
        keywordScore: item.score || 0.5,
      });
    }
  }

  // 3. Calculate Final Hybrid Scores
  const ranked: SearchResult[] = Array.from(mergedMap.values()).map(
    ({ result, semanticScore, keywordScore }) => {
      let combinedScore: number;

      if (semanticScore > 0 && keywordScore > 0) {
        combinedScore = semanticScore * 0.7 + keywordScore * 0.3;
      } else if (semanticScore > 0) {
        combinedScore = semanticScore * 0.85;
      } else {
        combinedScore = keywordScore * 0.75;
      }

      // Boost exact matches in title
      const lowerTitle = result.title.toLowerCase();
      if (lowerTitle === lowerQuery) {
        combinedScore = Math.min(1.0, combinedScore + 0.18);
      } else if (lowerTitle.includes(lowerQuery)) {
        combinedScore = Math.min(1.0, combinedScore + 0.08);
      }

      const finalScore = Math.round(combinedScore * 100) / 100;

      return {
        ...result,
        score: finalScore,
        relevanceLabel: getRelevanceLabel(finalScore),
      };
    }
  );

  return ranked.sort((a, b) => (b.score || 0) - (a.score || 0)).slice(0, limit);
}
