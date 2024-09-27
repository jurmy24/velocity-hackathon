import { anthropic } from "@ai-sdk/anthropic";
import { streamText, convertToCoreMessages } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: anthropic("claude-3-haiku-20240307"),
    messages: convertToCoreMessages(messages),
  });

  return result.toDataStreamResponse();
}
