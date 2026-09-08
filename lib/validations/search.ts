import { z } from "zod";

export const SearchQuerySchema = z.object({
  query: z.string().min(1, "Search query is required").max(500),
  contentTypes: z
    .array(z.enum(["course", "module", "lesson", "document", "video", "article"]))
    .optional(),
  courseId: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(50).optional().default(20),
});

export const AskAiSchema = z.object({
  question: z.string().min(2, "Question must be at least 2 characters").max(1000),
  courseId: z.string().optional(),
});

export const CreateSearchHistorySchema = z.object({
  query: z.string().min(1, "Query is required").max(500),
  filters: z
    .object({
      contentTypes: z
        .array(z.enum(["course", "module", "lesson", "document", "video", "article"]))
        .optional(),
      courseId: z.string().optional(),
    })
    .optional(),
});

export type SearchQueryInput = z.infer<typeof SearchQuerySchema>;
export type AskAiInput = z.infer<typeof AskAiSchema>;
export type CreateSearchHistoryInput = z.infer<typeof CreateSearchHistorySchema>;
