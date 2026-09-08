import { z } from "zod";

export const LessonAiActionSchema = z.object({
  lessonId: z.string().min(1, "Lesson ID is required"),
  action: z.enum(["explain", "summarize", "key_points", "quiz", "simplify"]),
  userQuery: z.string().max(500).optional(),
});

export type LessonAiActionInput = z.infer<typeof LessonAiActionSchema>;
