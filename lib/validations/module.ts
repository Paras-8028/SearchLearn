import { z } from "zod";

export const CreateModuleSchema = z.object({
  courseId: z.string().min(1, "courseId is required"),
  title: z.string().min(1, "Title is required").max(120),
  description: z.string().optional(),
  order: z.number().int().min(0),
});

export const UpdateModuleSchema = CreateModuleSchema.partial();

export type CreateModuleInput = z.infer<typeof CreateModuleSchema>;
export type UpdateModuleInput = z.infer<typeof UpdateModuleSchema>;
