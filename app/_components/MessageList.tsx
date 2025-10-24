import { Message } from "../chat/page";

type MessageListProps = {
  messages: Message[];
};

function MessageList({ messages }: MessageListProps) {
  return (
    <div className="min-h-[400px] max-h-[500px] border border-gray-300 rounded-md p-4 space-y-2 overflow-y-auto">
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
  );
}

export default MessageList;
