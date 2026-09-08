import { getOpenAIClient, isOpenAIConfigured } from "./openai";
import { hybridSearch } from "@/lib/search/hybrid-search";
import type { SearchResult } from "@/types/search";

export interface AiAnswerResult {
  answer: string;
  sources: {
    id: string;
    title: string;
    contentType: string;
    courseTitle?: string;
    moduleTitle?: string;
    href: string;
  }[];
}

const SYSTEM_PROMPT = `You are SearchLearn, an intelligent AI learning assistant for software engineering, computer science, and AI students.

Your task is to provide clear, accurate, and student-friendly answers based strictly on the retrieved SearchLearn learning materials provided in the Context below.

Rules:
1. Answer using ONLY the provided SearchLearn learning context.
2. If the provided context does NOT contain enough information to answer the question, clearly state: "The SearchLearn learning library does not currently contain sufficient information to answer this question."
3. Do NOT invent, assume, or hallucinate lessons, courses, modules, or external sources.
4. Keep your explanations clear, structured, and easy to understand with bullet points and code examples if helpful.
5. Highlight key takeaways for learners.`;

export async function generateGroundedAnswer(
  question: string,
  courseId?: string
): Promise<AiAnswerResult> {
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
    limit: 5,
  });

  if (retrievedDocs.length === 0) {
    return {
      answer:
        "The SearchLearn learning library does not currently contain sufficient information to answer this question. Try exploring available courses or rephrasing your search.",
      sources: [],
    };
  }

  // 2. Build Structured Context Block
  const contextSections = retrievedDocs.map((doc, idx) => {
    return `[SOURCE ${idx + 1}]
Title: ${doc.title}
Type: ${doc.contentType}
Course: ${doc.courseTitle || "N/A"}
Module: ${doc.moduleTitle || "N/A"}
Content:
${doc.content || doc.description || "No excerpt provided."}`;
  });

  const fullContext = contextSections.join("\n\n---\n\n");

  const userPrompt = `Context from SearchLearn Library:
${fullContext}

Student Question:
${cleanQuestion}

Please provide a grounded, helpful answer based on the above context:`;

  const openai = getOpenAIClient();

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.2,
  });

  const answer =
    completion.choices[0]?.message?.content ||
    "Unable to generate an answer at this time.";

  // Format verified sources
  const sources = retrievedDocs.slice(0, 3).map((doc) => ({
    id: doc.id,
    title: doc.title,
    contentType: doc.contentType,
    courseTitle: doc.courseTitle,
    moduleTitle: doc.moduleTitle,
    href: doc.href,
  }));

  return {
    answer,
    sources,
  };
}
