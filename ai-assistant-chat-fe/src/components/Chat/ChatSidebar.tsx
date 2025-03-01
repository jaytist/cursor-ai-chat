import { ChatSession } from "../../types/types";

interface ChatSidebarProps {
  sessions: ChatSession[];
  activeSession: ChatSession | null;
  onSessionSelect: (session: ChatSession) => void;
  onNewChat: () => void;
  hasSelectedAssistant: boolean;
  isLoading: boolean;
}

export function ChatSidebar({
  sessions,
  activeSession,
  onSessionSelect,
  onNewChat,
  hasSelectedAssistant,
  isLoading,
}: ChatSidebarProps) {
  return (
    <div className="w-64 bg-gray-900 rounded-t-lg flex flex-col">
      <div className="p-3">
        <button
          onClick={onNewChat}
          disabled={!hasSelectedAssistant}
          className={`w-full rounded-lg p-2 flex items-center justify-center gap-2 ${
            hasSelectedAssistant
              ? "bg-gray-800 text-white hover:bg-gray-700"
              : "bg-gray-800/50 text-gray-500 cursor-not-allowed"
          }`}
        >
          <span>+</span> New Chat
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {isLoading
          ? Array(4)
              .fill(null)
              .map((_, index) => (
                <div key={index} className="px-3 py-2">
                  <div className="h-4 bg-gray-800 rounded w-3/4 mb-1"></div>
                  <div className="h-3 bg-gray-800 rounded w-1/2"></div>
                </div>
              ))
          : sessions.map((session) => (
              <div
                key={session.id}
                className={`px-3 py-2 hover:bg-gray-800 cursor-pointer ${
                  activeSession?.id === session.id ? "bg-gray-800" : ""
                }`}
                onClick={() => onSessionSelect(session)}
              >
                <div className="text-gray-400 text-sm">
                  {session.title || "New Chat"}
                </div>
                <div className="text-gray-600 text-xs">
                  {new Date(session.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}
