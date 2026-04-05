import { generateText } from "ai";
import { getLanguageModel } from "@/lib/ai/providers";
import type { SubQuestion } from "@/lib/types";

export async function runDecomposer(question: string): Promise<SubQuestion[]> {
  const { text } = await generateText({
    model: getLanguageModel("anthropic/claude-sonnet-4-6"),
    system: `You are a research planning expert. Decompose the user's question into 3-5 focused sub-questions that together would fully answer the original question. Each sub-question should explore a distinct angle.

Respond with valid JSON only, as an array of objects with this shape:
[{ "id": "1", "question": "...", "focus": "..." }]

The "focus" field is a short label (2-5 words) describing the angle being explored.`,
    prompt: question,
  });

  const json = text.trim().replace(/^```json\n?|\n?```$/g, "");
  return JSON.parse(json) as SubQuestion[];
}
