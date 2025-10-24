type MessageFormProps = {
  input: string;
  setInput: (value: string) => void;
  handleSubmit: () => Promise<void>;
  isPending: boolean;
};

function MessageForm({
  input,
  setInput,
  handleSubmit,
  isPending,
}: MessageFormProps) {
  return (
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
        <button
          disabled={isPending}
          className="absolute top-1/2 right-0 -translate-y-1/2 bg-red-600  text-white px-4 py-2 rounded-sm hover:bg-accent-600 transition-all disabled:cursor-not-allowed disabled:bg-gray-500 disabled:text-gray-300"
        >
          Send
        </button>
      </div>
    </form>
  );
}

export default MessageForm;
