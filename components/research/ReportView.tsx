"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Skeleton } from "@/components/ui/skeleton";
import type { Conflict } from "@/lib/types";
import { ConflictCard } from "./ConflictCard";

interface ReportViewProps {
  markdown: string;
  conflicts: Conflict[];
  loading: boolean;
}

export function ReportView({ markdown, conflicts, loading }: ReportViewProps) {
  if (loading && !markdown) {
    return (
      <div className="flex flex-col gap-3 p-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="mt-4 h-6 w-1/2" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    );
  }

  if (!markdown && !loading) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        Your research report will appear here.
      </div>
    );
  }

  return (
    <div className="p-4">
      <ConflictCard conflicts={conflicts} />
      <div className="prose prose-sm dark:prose-invert max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
      </div>
    </div>
  );
}
