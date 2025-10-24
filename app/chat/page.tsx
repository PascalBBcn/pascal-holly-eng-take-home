"use client";

import { useState } from "react";
import { getReply } from "../actions/getReply";

function Page() {
  const [messages, setMessages] = useState<
    { id: string; text: string; from: "user" | "assistant" }[]
  >([]);

  const [input, setInput] = useState("");

  async function handleSubmit() {
    const userMsg = input;
    if (!userMsg) return;

    // Add user's message
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), text: userMsg, from: "user" },
    ]);

    // Call server action
    const reply = await getReply(userMsg);

    if (!reply) return;

    setMessages((prev) => [
      ...prev,
      {
        id: (Date.now() + 1).toString(),
        text: reply,
        from: "assistant",
      },
    ]);

    setInput("");
  }

  return (
    <div className="w-full mx-auto p-4">
      <div className="min-h-[400px] border border-gray-300 rounded-md p-4 space-y-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`max-w-[40%] px-4 py-2 rounded-lg text-sm break-words ${
              msg.from === "user"
                ? "bg-blue-200 text-left ml-auto"
                : "bg-gray-200 text-left"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await handleSubmit();
        }}
        className="mt-4 flex justify-center"
      >
        <div className="relative w-[70%]">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Start chatting"
            className="w-full border border-gray-300 rounded-md px-3 py-2 pr-20"
          />
          <button className="absolute top-1/2 right-0 -translate-y-1/2 bg-red-600  text-white px-4 py-2 rounded-sm">
            Send
          </button>
        </div>
      </form>
    </div>
  );
}

export default Page;
