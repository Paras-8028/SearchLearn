import { z } from "zod";

export const CreateLessonSchema = z.object({
  courseId: z.string().min(1, "courseId is required"),
  moduleId: z.string().min(1, "moduleId is required"),
  title: z.string().min(1, "Title is required").max(150),
  description: z.string().optional(),
  contentType: z.enum(["video", "article", "document", "quiz"]),
  content: z.string().optional(),
  videoUrl: z.string().url().optional().or(z.literal("")),
  duration: z.number().int().min(0).optional(),
  order: z.number().int().min(0),
  published: z.boolean().optional().default(true),
});

export const UpdateLessonSchema = CreateLessonSchema.partial();

export type CreateLessonInput = z.infer<typeof CreateLessonSchema>;
export type UpdateLessonInput = z.infer<typeof UpdateLessonSchema>;
