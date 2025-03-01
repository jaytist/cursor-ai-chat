import { useRef, useLayoutEffect } from "react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import Loading from "../UI/loading";

interface ChatAreaProps {
  chats: { type: string; content: string }[];
  isAIResponding: boolean;
  userMessage: string;
  onUserMessageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSendMessage: () => void;
}

export function ChatArea({
  chats,
  isAIResponding,
  userMessage,
  onUserMessageChange,
  onSendMessage,
}: ChatAreaProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [chats]);

  return (
    <div className="flex-1 dark:bg-gray-900 bg-gray-100 rounded-t-lg flex flex-col">
      <div
        ref={messagesEndRef}
        className="min-h-0 flex-1 overflow-y-auto p-4 space-y-4"
      >
        {chats.map((chat, index) => (
          <ChatMessage
            key={index}
            type={chat.type as "user" | "ai"}
            content={chat.content}
          />
        ))}
        {isAIResponding && (
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-500">
              AI
            </div>
            <div className="bg-gray-800 rounded-lg p-4 max-w-[80%]">
              <Loading />
            </div>
          </div>
        )}
      </div>
      <ChatInput
        value={userMessage}
        onChange={onUserMessageChange}
        onSend={onSendMessage}
      />
    </div>
  );
}
