"use client";

import type { AgentEvent } from "@/lib/types";

interface AgentTraceProps {
  events: AgentEvent[];
}

const statusIcon: Record<string, string> = {
  start: "⏳",
  tool: "🔍",
  done: "✅",
};

function getLabel(event: AgentEvent): string {
  switch (event.type) {
    case "decompose":
      return event.status === "done"
        ? `Decomposed into ${event.data?.length ?? 0} sub-questions`
        : "Decomposing question...";
    case "research":
      if (event.status === "tool") return event.detail ?? "Searching...";
      if (event.status === "done") return `Done: ${event.subQuestion}`;
      return `Researching: ${event.subQuestion}`;
    case "conflict":
      return event.status === "done"
        ? `Found ${event.count ?? 0} conflicts`
        : "Detecting conflicts...";
    case "synthesize":
      return "Synthesizing report...";
  }
}

export function AgentTrace({ events }: AgentTraceProps) {
  if (events.length === 0) {
    return (
      <div className="text-sm text-muted-foreground px-2 pt-4">
        Agent activity will appear here.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1 overflow-y-auto">
      {events.map((event, i) => (
        <div
          key={i}
          className="flex items-start gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-muted/50"
        >
          <span className="shrink-0 text-base leading-snug">
            {statusIcon[event.status] ?? "•"}
          </span>
          <span className="text-foreground/80 leading-snug">{getLabel(event)}</span>
        </div>
      ))}
    </div>
  );
}
