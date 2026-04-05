import { tavily } from "@tavily/core";
import { tool } from "ai";
import { z } from "zod";

const client = tavily({ apiKey: process.env.TAVILY_API_KEY ?? "" });

export const tavilySearch = tool({
  description: "Search the web for current information on a topic",
  inputSchema: z.object({
    query: z.string().describe("The search query"),
    maxResults: z.number().optional().default(5),
  }),
  execute: async (input) => {
    const response = await client.search(input.query, {
      maxResults: input.maxResults,
    });
    return response.results.map((r) => ({
      title: r.title,
      url: r.url,
      content: r.content,
    }));
  },
});
