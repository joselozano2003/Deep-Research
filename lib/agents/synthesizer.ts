import { streamText } from "ai";
import { getLanguageModel } from "@/lib/ai/providers";
import type { Conflict, ResearchFindings } from "@/lib/types";

export function runSynthesizer(
  question: string,
  allFindings: ResearchFindings[],
  conflicts: Conflict[]
) {
  return streamText({
    model: getLanguageModel("anthropic/claude-sonnet-4-6"),
    system: `You are an expert research synthesizer. Write a comprehensive, well-structured report answering the user's question based on the provided research findings.

Use markdown formatting with clear headings and sections. Cite sources inline using [Title](URL) format. Where conflicts exist between sources, acknowledge them objectively. Be factual, balanced, and thorough.`,
    prompt: `Question: ${question}

Research Findings:
${JSON.stringify(allFindings, null, 2)}

Conflicts Detected:
${conflicts.length > 0 ? JSON.stringify(conflicts, null, 2) : "None"}`,
  });
}
