"use client";

import { useState, useTransition } from "react";
import { sendMessage } from "./actions";

export default function Home() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    if (!input.trim()) return;
    startTransition(async () => {
      const result = await sendMessage(input);
      setResponse(result);
    });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <div className="flex w-full max-w-xl gap-2">
        <input
          className="flex-1 rounded border px-3 py-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="メッセージを入力"
        />
        <button
          className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
          onClick={handleSubmit}
          disabled={isPending}
        >
          {isPending ? "送信中..." : "送信"}
        </button>
      </div>
      {response && (
        <div className="w-full max-w-xl whitespace-pre-wrap rounded border p-4">
          {response}
        </div>
      )}
    </div>
  );
}
