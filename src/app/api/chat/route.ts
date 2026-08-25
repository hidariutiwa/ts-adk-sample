import { NextRequest } from "next/server";
import { _sendMessage } from "@/app/actions";

export async function POST(req: NextRequest) {
  const { text } = await req.json();

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      for await (const chunk of _sendMessage(text)) {
        controller.enqueue(encoder.encode(chunk));
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
