"use server";

import { InMemoryRunner, isFinalResponse, StreamingMode } from "@google/adk";
import { rootAgent } from "@/agents/chatbot/agent";

const runner = new InMemoryRunner({ agent: rootAgent });

export async function sendMessage(text: string): Promise<string> {
  let responseText = "";

  for await (const event of runner.runEphemeral({
    userId: "web-user",
    newMessage: { parts: [{ text }] },
  })) {
    if (isFinalResponse(event)) {
      responseText =
        event.content?.parts?.map((p) => p.text ?? "").join("") ?? "";
    }
  }

  return responseText;
}

export async function* _sendMessage(text: string) {
  for await (const event of runner.runEphemeral({
    userId: "web-user",
    newMessage: { parts: [{ text }] },
    runConfig: { streamingMode: StreamingMode.SSE },
  })) {
    if (!event.partial) continue;
    const parts = event.content?.parts ?? [];
    for (const part of parts) {
      const chunk = part.text;
      if (chunk) yield chunk;
    }
  }
}
