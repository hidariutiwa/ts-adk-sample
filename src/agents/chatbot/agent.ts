import { LlmAgent } from "@google/adk";

export const rootAgent = new LlmAgent({
  name: "chatbot",
  model: "gemini-flash-latest",
  description: "A simple conversational chatbot.",
  instruction:
    "You are a friendly, helpful assistant. Answer the user's questions concisely.",
});
