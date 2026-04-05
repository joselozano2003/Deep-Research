"use client";

import { useState } from "react";
import { AgentTrace } from "@/components/research/AgentTrace";
import { QueryInput } from "@/components/research/QueryInput";
import { ReportView } from "@/components/research/ReportView";
import type { AgentEvent, Conflict } from "@/lib/types";

export default function ResearchPage() {
  const [events, setEvents] = useState<AgentEvent[]>([]);
  const [report, setReport] = useState("");
  const [conflicts, setConflicts] = useState<Conflict[]>([]);
  const [loading, setLoading] = useState(false);

  async function runResearch(question: string) {
    setEvents([]);
    setReport("");
    setConflicts([]);
    setLoading(true);

    try {
      const res = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      if (!res.body) return;

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const frames = buffer.split("\n\n");
        buffer = frames.pop() ?? "";

        for (const frame of frames) {
          if (!frame.trim()) continue;

          const lines = frame.split("\n");
          let eventType = "message";
          let data = "";

          for (const line of lines) {
            if (line.startsWith("event: ")) {
              eventType = line.slice(7);
            } else if (line.startsWith("data: ")) {
              data = line.slice(6);
            }
          }

          if (!data) continue;

          if (eventType === "agent") {
            const event = JSON.parse(data) as AgentEvent;
            setEvents((prev) => [...prev, event]);
            if (
              event.type === "conflict" &&
              event.status === "done" &&
              "data" in event
            ) {
              // conflicts come via the report phase; handled below
            }
          } else if (eventType === "report") {
            setReport((prev) => prev + JSON.parse(data));
          } else if (eventType === "error") {
            console.error("Research error:", JSON.parse(data));
          }
        }
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8">
      <div>
        <h1 className="mb-1 text-2xl font-semibold tracking-tight">
          Deep Research
        </h1>
        <p className="text-sm text-muted-foreground">
          Multi-agent research powered by Vercel AI SDK
        </p>
      </div>

      <QueryInput onSubmit={runResearch} loading={loading} />

      <div className="grid grid-cols-[280px_1fr] gap-6 min-h-[60vh]">
        <div className="rounded-xl border bg-card p-3">
          <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Agent Trace
          </p>
          <AgentTrace events={events} />
        </div>

        <div className="rounded-xl border bg-card overflow-auto">
          <ReportView markdown={report} conflicts={conflicts} loading={loading} />
        </div>
      </div>
    </div>
  );
}
