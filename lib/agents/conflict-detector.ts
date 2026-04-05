import { generateText } from "ai";
import { getLanguageModel } from "@/lib/ai/providers";
import type { Conflict, ResearchFindings } from "@/lib/types";

export async function runConflictDetector(
  allFindings: ResearchFindings[]
): Promise<Conflict[]> {
  const { text } = await generateText({
    model: getLanguageModel("anthropic/claude-haiku-4-5-20251001"),
    system: `You are a critical analyst. Review research findings and identify contradictions or conflicts between claims from different sources.

Respond with valid JSON only — an array of conflicts (may be empty):
[{
  "topic": "...",
  "claimA": "...",
  "claimB": "...",
  "sourceA": "...",
  "sourceB": "..."
}]

If there are no meaningful conflicts, respond with an empty array: []`,
    prompt: JSON.stringify(allFindings, null, 2),
  });

  const json = text.trim().replace(/^```json\n?|\n?```$/g, "");
  return JSON.parse(json) as Conflict[];
}
