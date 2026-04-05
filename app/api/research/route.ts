import { runDecomposer } from "@/lib/agents/decomposer";
import { runConflictDetector } from "@/lib/agents/conflict-detector";
import { runResearcher } from "@/lib/agents/researcher";
import { runSynthesizer } from "@/lib/agents/synthesizer";
import type { AgentEvent } from "@/lib/types";

export const maxDuration = 60;

export async function POST(req: Request) {
  const { question } = (await req.json()) as { question: string };

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const emit = (event: string, data: unknown) => {
        controller.enqueue(
          encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
        );
      };

      try {
        // 1. Decompose
        emit("agent", { type: "decompose", status: "start" } satisfies AgentEvent);
        const subQuestions = await runDecomposer(question);
        emit("agent", { type: "decompose", status: "done", data: subQuestions } satisfies AgentEvent);

        // 2. Research (parallel)
        const allFindings = await Promise.all(
          subQuestions.map((sq) =>
            runResearcher(sq.id, sq.question, (event) => emit("agent", event))
          )
        );

        // 3. Conflict detection
        emit("agent", { type: "conflict", status: "start" } satisfies AgentEvent);
        const conflicts = await runConflictDetector(allFindings);
        emit("agent", {
          type: "conflict",
          status: "done",
          count: conflicts.length,
        } satisfies AgentEvent);

        // 4. Synthesize (stream)
        emit("agent", { type: "synthesize", status: "start" } satisfies AgentEvent);
        const { textStream } = runSynthesizer(question, allFindings, conflicts);
        for await (const chunk of textStream) {
          emit("report", chunk);
        }
      } catch (err) {
        emit("error", { message: err instanceof Error ? err.message : String(err) });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
