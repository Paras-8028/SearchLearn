import OpenAI from "openai";

let openaiInstance: OpenAI | null = null;
let cachedApiKey: string | undefined = undefined;

export function getOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "OPENAI_API_KEY is not configured in the environment. Please add it to your .env.local file."
    );
  }

  if (openaiInstance && cachedApiKey === apiKey) {
    return openaiInstance;
  }

  cachedApiKey = apiKey;
  openaiInstance = new OpenAI({
    apiKey,
  });

  return openaiInstance;
}

export function isOpenAIConfigured(): boolean {
  return !!process.env.OPENAI_API_KEY;
}
