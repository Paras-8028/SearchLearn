import { searchDocumentsByKeyword } from "@/lib/db/repositories/search";
import type { SearchResult, SearchContentType } from "@/types/search";

export async function keywordSearch(options: {
  query: string;
  contentTypes?: SearchContentType[];
  courseId?: string;
  limit?: number;
}): Promise<SearchResult[]> {
  return searchDocumentsByKeyword(options);
}
