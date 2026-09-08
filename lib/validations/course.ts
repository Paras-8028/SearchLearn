import { z } from "zod";

export const CreateCourseSchema = z.object({
  title: z.string().min(1, "Title is required").max(120),
  description: z.string().min(1, "Description is required"),
  thumbnail: z.string().url().optional().or(z.literal("")),
  category: z.string().optional(),
  level: z.enum(["beginner", "intermediate", "advanced"]).optional().default("beginner"),
  published: z.boolean().optional().default(false),
});

export const UpdateCourseSchema = CreateCourseSchema.partial();

export type CreateCourseInput = z.infer<typeof CreateCourseSchema>;
export type UpdateCourseInput = z.infer<typeof UpdateCourseSchema>;
