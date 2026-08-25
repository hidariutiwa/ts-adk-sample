"use server";

import { InMemoryRunner, isFinalResponse } from "@google/adk";
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
