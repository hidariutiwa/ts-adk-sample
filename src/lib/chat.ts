import { InMemoryRunner, StreamingMode } from "@google/adk";
import { LlmAgent } from "@google/adk";
import { config } from "dotenv";

config();

const rootAgent = new LlmAgent({
	name: "chatbot",
	model: "gemini-3.5-flash",
	description: "A simple conversational chatbot.",
	instruction:
		"You are a friendly, helpful assistant. Answer the user's questions concisely.",
});

const runner = new InMemoryRunner({ agent: rootAgent });

export async function* sendMessage(text: string) {
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

(async function main() {
	const input = "pythonでFizzBuzzを書いてください。";

	for await (const chunk of sendMessage(input)) {
		console.log(chunk);
	}
})();
