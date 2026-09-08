import { z } from "zod";
import { logger } from "./logger/logger";

const serverEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  MONGODB_URI: z.string().min(1).default("mongodb://localhost:27017/searchlearn"),
  MONGODB_DB_NAME: z.string().default("searchlearn"),
  OPENAI_API_KEY: z.string().optional(),
  OPENAI_CHAT_MODEL: z.string().default("gpt-4o-mini"),
  OPENAI_EMBEDDING_MODEL: z.string().default("text-embedding-3-small"),
  AI_PROVIDER: z.string().default("openai"),
  CLERK_SECRET_KEY: z.string().optional(),
});

const clientEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().optional(),
});

export function validateEnv() {
  const serverResult = serverEnvSchema.safeParse(process.env);
  const clientResult = clientEnvSchema.safeParse({
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  });

  if (!serverResult.success) {
    logger.warn("system", "Server environment configuration warnings", {
      errors: serverResult.error.flatten().fieldErrors,
    });
  }

  if (!clientResult.success) {
    logger.warn("system", "Client environment configuration warnings", {
      errors: clientResult.error.flatten().fieldErrors,
    });
  }

  return {
    server: serverResult.data || serverEnvSchema.parse({}),
    client: clientResult.data || clientEnvSchema.parse({}),
  };
}

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost:27017/searchlearn",
  MONGODB_DB_NAME: process.env.MONGODB_DB_NAME || "searchlearn",
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  OPENAI_CHAT_MODEL: process.env.OPENAI_CHAT_MODEL || "gpt-4o-mini",
  OPENAI_EMBEDDING_MODEL: process.env.OPENAI_EMBEDDING_MODEL || "text-embedding-3-small",
  AI_PROVIDER: process.env.AI_PROVIDER || "openai",
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  isOpenAIConfigured: Boolean(process.env.OPENAI_API_KEY),
};