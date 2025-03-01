interface ChatMessageProps {
  type: "user" | "ai";
  content: string;
}

export default function ChatMessage({ type, content }: ChatMessageProps) {
  if (type === "ai") {
    return (
      <div className="flex items-start gap-4">
        <div className="w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-500">
          AI
        </div>
        <div className="bg-gray-800 rounded-lg p-4 max-w-[80%]">
          <p className="text-gray-300">{content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-4 justify-end">
      <div className="bg-purple-500/10 rounded-lg p-4 max-w-[80%]">
        <p className="text-gray-300">{content}</p>
      </div>
      <div className="w-8 h-8 bg-purple-500/10 rounded-full flex items-center justify-center text-purple-500">
        U
      </div>
    </div>
  );
}
