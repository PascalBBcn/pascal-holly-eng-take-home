"use client";

function Page() {
  const messages = [
    { id: "1", text: "This is ai message 1", from: "assistant" },
    {
      id: "2",
      text: "This is ai message 2 This is ai message 2 This is ai message 2",
      from: "assistant",
    },
    { id: "3", text: "This is human message 1", from: "user" },
  ];

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
      <form className=" mt-4 flex justify-center">
        <div className="relative w-[70%]">
          <input
            type="text"
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
