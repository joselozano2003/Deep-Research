import type { InferUITool, UIMessage } from "ai";
import { z } from "zod";
import type { ArtifactKind } from "@/components/chat/artifact";
import type { createDocument } from "./ai/tools/create-document";
import type { getWeather } from "./ai/tools/get-weather";
import type { requestSuggestions } from "./ai/tools/request-suggestions";
import type { updateDocument } from "./ai/tools/update-document";
import type { Suggestion } from "./db/schema";

export const messageMetadataSchema = z.object({
  createdAt: z.string(),
});

export type MessageMetadata = z.infer<typeof messageMetadataSchema>;

type weatherTool = InferUITool<typeof getWeather>;
type createDocumentTool = InferUITool<ReturnType<typeof createDocument>>;
type updateDocumentTool = InferUITool<ReturnType<typeof updateDocument>>;
type requestSuggestionsTool = InferUITool<
  ReturnType<typeof requestSuggestions>
>;

export type ChatTools = {
  getWeather: weatherTool;
  createDocument: createDocumentTool;
  updateDocument: updateDocumentTool;
  requestSuggestions: requestSuggestionsTool;
};

export type CustomUIDataTypes = {
  textDelta: string;
  imageDelta: string;
  sheetDelta: string;
  codeDelta: string;
  suggestion: Suggestion;
  appendMessage: string;
  id: string;
  title: string;
  kind: ArtifactKind;
  clear: null;
  finish: null;
  "chat-title": string;
};

export type ChatMessage = UIMessage<
  MessageMetadata,
  CustomUIDataTypes,
  ChatTools
>;

export type Attachment = {
  name: string;
  url: string;
  contentType: string;
};

// Deep Research types
export type SubQuestion = { id: string; question: string; focus: string };

export type Claim = { text: string; url: string; title: string };

export type ResearchFindings = {
  subQuestionId: string;
  question: string;
  claims: Claim[];
  summary: string;
};

export type Conflict = {
  topic: string;
  claimA: string;
  claimB: string;
  sourceA: string;
  sourceB: string;
};

export type AgentEvent =
  | { type: "decompose"; status: "start" | "done"; data?: SubQuestion[] }
  | {
      type: "research";
      status: "start" | "tool" | "done";
      subQuestion: string;
      detail?: string;
    }
  | { type: "conflict"; status: "start" | "done"; count?: number }
  | { type: "synthesize"; status: "start" };
