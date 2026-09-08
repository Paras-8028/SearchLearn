import type { ObjectId } from "mongodb";

export type AIFeature =
  | "search_answer"
  | "ask"
  | "ask_ai"
  | "lesson_explain"
  | "lesson_summary"
  | "lesson_key_points"
  | "lesson_quiz"
  | "lesson_simplify"
  | "embedding"
  | "document_process";

export interface AIRequestLog {
  _id?: ObjectId;
  userId: string;
  feature: AIFeature;
  model?: string;
  inputTokens?: number;
  outputTokens?: number;
  totalTokens?: number;
  success: boolean;
  error?: string;
  durationMs?: number;
  createdAt: Date;
}

export interface AIRequestLogDTO {
  _id: string;
  userId: string;
  feature: AIFeature;
  model?: string;
  inputTokens?: number;
  outputTokens?: number;
  totalTokens?: number;
  success: boolean;
  error?: string;
  durationMs?: number;
  createdAt: string;
}
