export type LessonAiAction =
  | "explain"
  | "summarize"
  | "key_points"
  | "quiz"
  | "simplify";

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface LessonQuizResponse {
  questions: QuizQuestion[];
}

export function buildLessonPrompt(
  action: LessonAiAction,
  lessonTitle: string,
  lessonContent: string,
  courseTitle?: string,
  moduleTitle?: string,
  userQuery?: string
): { systemPrompt: string; userPrompt: string } {
  const contextHeader = `COURSE: ${courseTitle || "General Curriculum"}
MODULE: ${moduleTitle || "N/A"}
LESSON: ${lessonTitle}

LESSON CONTENT:
${lessonContent || "No detailed text available. Use title and context."}`;

  switch (action) {
    case "explain":
      return {
        systemPrompt: `You are an expert computer science instructor and technical mentor.
Your task is to provide an in-depth, intuitive explanation of the lesson material.
Explain the core mechanism, why it was designed this way, practical software engineering context, and common pitfalls.
Format with clean Markdown headings, bullet points, and code snippets where relevant.`,
        userPrompt: `${contextHeader}

${userQuery ? `Specific focus request from student: "${userQuery}"` : "Please explain this lesson concept in depth with clear intuition, technical clarity, and real-world relevance."}`,
      };

    case "summarize":
      return {
        systemPrompt: `You are an expert technical editor.
Summarize the lesson into a cohesive, high-value 3-part summary:
1. Core Objective (What is taught)
2. Why It Matters (Practical importance)
3. Essential Takeaways (Key bullet points)`,
        userPrompt: `${contextHeader}

Please provide a concise, structured summary of this lesson.`,
      };

    case "key_points":
      return {
        systemPrompt: `You are a curriculum designer preparing exam-ready revision notes.
Extract the most critical key points, technical rules, syntax/patterns, and interview-ready takeaways from this lesson.
Format as sharp, memorable bullet points with bold keywords.`,
        userPrompt: `${contextHeader}

Extract the essential key points and takeaways from this lesson.`,
      };

    case "simplify":
      return {
        systemPrompt: `You are a master teacher known for explaining complex technical topics to total beginners (ELI5 style).
Explain this lesson's concept using simple language, everyday real-world analogies, zero unnecessary jargon, and clear progression.
Keep it fun, encouraging, and easy to grasp.`,
        userPrompt: `${contextHeader}

Please explain this lesson in simple, beginner-friendly terms with an intuitive analogy.`,
      };

    case "quiz":
      return {
        systemPrompt: `You are a senior examiner and quiz generator.
Create 3-4 high quality multiple choice questions testing the student's comprehension of the lesson material.
Each question MUST have exactly 4 plausible options, an index pointing to the correct option (0-3), and a concise explanation of why that option is correct.

You MUST output ONLY valid JSON matching this schema:
{
  "questions": [
    {
      "question": "Question text here",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "explanation": "Why this option is correct"
    }
  ]
}
Do NOT include markdown formatting or backticks around the JSON. Output raw JSON only.`,
        userPrompt: `${contextHeader}

Generate a 3-question comprehension quiz based on this lesson.`,
      };
  }
}
