/**
 * SmartLearn Production AI Limits & Safeguards
 * Configurable thresholds to protect against runaway API costs,
 * context overflow, and resource exhaustion.
 */

export const AI_CONFIG = {
  // Maximum character length for user questions to the AI tutor
  MAX_QUESTION_LENGTH: Number(process.env.MAX_AI_QUESTION_LENGTH) || 1000,

  // Maximum document file upload size (in bytes)
  MAX_DOCUMENT_SIZE_MB: Number(process.env.MAX_DOCUMENT_SIZE_MB) || 10,

  // Maximum number of chunks allowed per document during embedding extraction
  MAX_CHUNKS_PER_DOCUMENT: Number(process.env.MAX_CHUNKS_PER_DOCUMENT) || 300,

  // Target token length per text chunk for vector indexing
  CHUNK_SIZE_TOKENS: 500,

  // Overlap between consecutive chunks to preserve semantic context
  CHUNK_OVERLAP_TOKENS: 100,

  // Maximum number of vector search contexts passed to prompt augmentation
  MAX_RAG_SOURCES: 5,

  // Models
  DEFAULT_CHAT_MODEL: process.env.OPENAI_CHAT_MODEL || "gpt-4o-mini",
  DEFAULT_EMBEDDING_MODEL: process.env.OPENAI_EMBEDDING_MODEL || "text-embedding-3-small",

  // Rate Limiting (Requests per minute per user/IP)
  RATE_LIMITS: {
    AI_REQUESTS_PER_MINUTE: 10,
    SEARCH_REQUESTS_PER_MINUTE: 30,
    DOCUMENT_UPLOADS_PER_MINUTE: 5,
  },
} as const;
