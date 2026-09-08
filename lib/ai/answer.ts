import { getOpenAIClient, isOpenAIConfigured } from "./openai";
import { hybridSearch } from "@/lib/search/hybrid-search";
import { logAiRequest } from "@/lib/db/repositories/ai-request-logs";
import type { SearchResult } from "@/types/search";

export interface AiAnswerSource {
  id: string;
  title: string;
  contentType: string;
  courseTitle?: string;
  moduleTitle?: string;
  href: string;
  snippet?: string;
}

export interface AiAnswerResult {
  answer: string;
  sources: AiAnswerSource[];
  model?: string;
  tokensUsed?: number;
}

const SYSTEM_PROMPT = `You are SmartLearn, an elite educational AI mentor and computer science / software engineering learning assistant.

Your primary directive is to provide clear, high-quality, grounded explanations based STRICTLY on the retrieved learning context provided below.

CRITICAL GUIDELINES:
1. Truthfulness & Grounding: Base your response exclusively on the provided context (courses, modules, lessons, notes, and documents).
2. If the context does not contain sufficient information to answer the question, state: "The SmartLearn learning library does not currently contain sufficient information to answer this question." Then provide any related insights found in the context if helpful.
3. Citations: Reference the source titles (e.g. "[Lesson: Functions and Scope]" or "[Document: Python Data Structures]") when citing principles from the text.
4. Structure: Format your answer cleanly using Markdown with intuitive headings, concise bullet points, and code blocks with syntax highlighting where relevant.
5. Tone: Encouraging, professional, pedagogical, and precise.`;

export async function generateGroundedAnswer(
  question: string,
  courseId?: string,
  userId?: string
): Promise<AiAnswerResult> {
  const startTime = Date.now();
  const cleanQuestion = question.trim();
  if (!cleanQuestion) {
    throw new Error("Question cannot be empty");
  }

  if (!isOpenAIConfigured()) {
    return {
      answer:
        "OpenAI integration is currently not configured on this server. Please add your OPENAI_API_KEY in .env.local to enable AI answers.",
      sources: [],
    };
  }

  // 1. Retrieve top matching learning content via Hybrid Search
  const retrievedDocs: SearchResult[] = await hybridSearch({
    query: cleanQuestion,
    courseId,
    limit: 6,
  });

  if (retrievedDocs.length === 0) {
    return {
      answer:
        "The SmartLearn learning library does not currently contain sufficient information to answer this question. Try exploring available courses or rephrasing your search.",
      sources: [],
    };
  }

  // 2. Build Structured Context Block
  const contextSections = retrievedDocs.map((doc, idx) => {
    return `[SOURCE ${idx + 1}]
Title: ${doc.title}
Type: ${doc.contentType}
Course: ${doc.courseTitle || "General Knowledge"}
Module: ${doc.moduleTitle || "N/A"}
Content:
${doc.content || doc.description || "No excerpt provided."}`;
  });

  const fullContext = contextSections.join("\n\n---\n\n");

  const userPrompt = `Context from SmartLearn Library:
${fullContext}

Student Question:
${cleanQuestion}

Provide a grounded, comprehensive answer adhering to the system instructions:`;

  const model = process.env.OPENAI_CHAT_MODEL || "gpt-4o-mini";
  const openai = getOpenAIClient();

  try {
    const completion = await openai.chat.completions.create({
      model,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.2,
      max_tokens: 1000,
    });

    const answer =
      completion.choices[0]?.message?.content ||
      "Unable to generate an answer at this time.";

    const inputTokens = completion.usage?.prompt_tokens || 0;
    const outputTokens = completion.usage?.completion_tokens || 0;
    const totalTokens = completion.usage?.total_tokens || 0;

    // Log request asynchronously
    if (userId) {
      await logAiRequest({
        userId,
        feature: "ask_ai",
        model,
        inputTokens,
        outputTokens,
        totalTokens,
        success: true,
        durationMs: Date.now() - startTime,
      });
    }

    // Format verified sources
    const sources: AiAnswerSource[] = retrievedDocs.slice(0, 4).map((doc) => ({
      id: doc.id,
      title: doc.title,
      contentType: doc.contentType,
      courseTitle: doc.courseTitle,
      moduleTitle: doc.moduleTitle,
      href: doc.href,
      snippet: doc.description || (doc.content ? doc.content.slice(0, 160) + "..." : undefined),
    }));

    return {
      answer,
      sources,
      model,
      tokensUsed: totalTokens,
    };
  } catch (error: unknown) {
    if (userId) {
      await logAiRequest({
        userId,
        feature: "ask_ai",
        model,
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        durationMs: Date.now() - startTime,
      });
    }
    throw error;
  }
}

