"use client";

import { useState } from "react";
import { getReply } from "../actions/getReply";
import MessageList from "../_components/MessageList";
import MessageForm from "../_components/MessageForm";

export type Message = {
  id: string;
  text: string;
  from: "user" | "assistant";
};

function Page() {
  const [isPending, setIsPending] = useState(false);

  const [messages, setMessages] = useState<Message[]>([]);

  const [input, setInput] = useState("");

  async function handleSubmit() {
    const userMsg = input;
    if (!userMsg) return;

    // Add user's message
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), text: userMsg, from: "user" },
    ]);
    setIsPending(true);

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
    setIsPending(false);
  }

  return (
    <div className="w-full mx-auto p-4">
      <MessageList messages={messages} />
      <MessageForm
        input={input}
        setInput={setInput}
        handleSubmit={handleSubmit}
        isPending={isPending}
      />
    </div>
  );
}

export default Page;
