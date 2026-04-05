import { generateText, stepCountIs } from "ai";
import { getLanguageModel } from "@/lib/ai/providers";
import { tavilySearch } from "@/lib/ai/tools/tavily-search";
import type { AgentEvent, ResearchFindings } from "@/lib/types";

export async function runResearcher(
  subQuestionId: string,
  question: string,
  emit: (event: AgentEvent) => void
): Promise<ResearchFindings> {
  emit({ type: "research", status: "start", subQuestion: question });

  const { text } = await generateText({
    model: getLanguageModel("anthropic/claude-haiku-4-5-20251001"),
    stopWhen: stepCountIs(6),
    tools: { tavilySearch },
    system: `You are a meticulous web researcher. Use the tavilySearch tool to find relevant, up-to-date information to answer the question. Gather claims from multiple sources.

After researching, respond with valid JSON only:
{
  "subQuestionId": "<id>",
  "question": "<the question>",
  "claims": [{ "text": "...", "url": "...", "title": "..." }],
  "summary": "..."
}`,
    prompt: `Sub-question ID: ${subQuestionId}\nQuestion: ${question}`,
    onStepFinish({ toolCalls }) {
      for (const call of toolCalls) {
        if (call.toolName === "tavilySearch") {
          const input = call.input as { query: string };
          emit({
            type: "research",
            status: "tool",
            subQuestion: question,
            detail: `Searching: "${input.query}"`,
          });
        }
      }
    },
  });

  emit({ type: "research", status: "done", subQuestion: question });

  const json = text.trim().replace(/^```json\n?|\n?```$/g, "");
  return JSON.parse(json) as ResearchFindings;
}
