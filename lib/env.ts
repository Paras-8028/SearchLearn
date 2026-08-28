import { z } from "zod";

const envSchema = z.object({
  MONGODB_URI: z.string().min(1),
  MONGODB_DB_NAME: z.string().min(1),
  OPENAI_API_KEY: z.string().optional(),
  AI_PROVIDER: z.string().default("openai"),
});

export const env = envSchema.parse({
  MONGODB_URI: process.env.MONGODB_URI,
  MONGODB_DB_NAME: process.env.MONGODB_DB_NAME,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  AI_PROVIDER: process.env.AI_PROVIDER,
});