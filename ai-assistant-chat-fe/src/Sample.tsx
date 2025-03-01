import React, { useState, useRef, useLayoutEffect, useEffect } from "react";
import {
  getAssistants,
  createChatSession,
  sendMessageToChatSession,
} from "./api/chat";
import { Assistant, ChatSession } from "./types/types";

function Sample() {
  const [userMessage, setUserMessage] = useState("");
  const [chats, setChats] = useState<{ type: string; content: string }[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSession, setActiveSession] = useState<ChatSession | null>(null);
  const [selectedAssistant, setSelectedAssistant] = useState<Assistant | null>(
    null
  );

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    // todo add error handling and abort controller
    getAssistants().then((assistants) => {
      setAssistants(assistants);
      // Optionally set the first assistant as default
      if (assistants.length > 0) {
        setSelectedAssistant(assistants[0]);
      }
    });
  }, []);

  useLayoutEffect(() => {
    scrollToBottom();
  }, [chats]); // Scroll whenever chats update

  const handleCreateNewChat = async () => {
    if (!selectedAssistant) return;

    const response = await createChatSession(selectedAssistant.id.toString());
    setSessions((prev) => [...prev, response]);
    setActiveSession(response);
    setChats([]); // Clear existing chats
  };

  const handleSendMessage = async () => {
    if (!activeSession) return;

    const currentUserMessage = {
      type: "user",
      content: userMessage.toString(),
    };
    setUserMessage("");
    let userChat = [currentUserMessage];

    setChats((prev) => [...prev, ...userChat]);
    const response = await sendMessageToChatSession(activeSession, userMessage);
    const currentAIMessage = { type: "ai", content: response.content };
    setChats((prev) => [...prev, currentAIMessage]);
  };

  const handleUserMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserMessage(e.target.value);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-950">
      {/* Main container with padding only at top and sides */}
      <div className="flex flex-col h-screen px-8 pt-4">
        {/* Header */}
        <nav className="flex justify-between mb-4 border-b border-gray-800 pb-4">
          <h3 className="text-white">Internal AI Dashboard</h3>
          <div className="flex gap-4">
            <button className="text-gray-400">
              <span>🌟</span>
            </button>
            <button className="text-gray-400">
              <span>⚙️</span>
            </button>
          </div>
        </nav>

        {/* AI Assistant Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {assistants.map((assistant) => (
            <div
              key={assistant.id}
              className={`bg-gray-900 p-4 rounded-lg cursor-pointer transition-colors ${
                selectedAssistant?.id === assistant.id
                  ? "ring-2 ring-purple-500"
                  : "hover:bg-gray-800"
              }`}
              onClick={() => setSelectedAssistant(assistant)}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 text-purple-500 bg-purple-500/10 p-2 rounded flex items-center justify-center">
                  📝
                </div>
                <div>
                  <h4 className="text-white font-medium">{assistant.name}</h4>
                  <p className="text-gray-400 text-sm">
                    {assistant.description}
                  </p>
                  <div className="text-gray-600 text-xs">
                    Model: {assistant.model}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Chat Layout - Flex container taking remaining height */}
        <div className="flex gap-4 flex-1 mb-0">
          {/* Sidebar */}
          <div className="w-64 bg-gray-900 rounded-t-lg flex flex-col">
            <div className="p-3">
              <button
                onClick={handleCreateNewChat}
                disabled={!selectedAssistant}
                className={`w-full rounded-lg p-2 flex items-center justify-center gap-2 ${
                  selectedAssistant
                    ? "bg-gray-800 text-white hover:bg-gray-700"
                    : "bg-gray-800/50 text-gray-500 cursor-not-allowed"
                }`}
              >
                <span>+</span> New Chat
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className={`px-3 py-2 hover:bg-gray-800 cursor-pointer ${
                    activeSession?.id === session.id ? "bg-gray-800" : ""
                  }`}
                  onClick={() => setActiveSession(session)}
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

          {/* Chat Area */}
          <div className=" flex-1 bg-gray-900 rounded-t-lg flex flex-col">
            {/* Messages Container */}
            <div
              ref={messagesEndRef}
              className="min-h-0 flex-1 overflow-y-auto p-4 space-y-4"
            >
              {chats.map((chat) => {
                {
                  /* AI Message */
                }
                if (chat.type === "ai") {
                  return (
                    <div key={chat.content} className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-500">
                        AI
                      </div>
                      <div className="bg-gray-800 rounded-lg p-4 max-w-[80%]">
                        <p className="text-gray-300">{chat.content}</p>
                      </div>
                    </div>
                  );
                } else {
                  {
                    /* User Message */
                  }
                  return (
                    <div
                      key={chat.content}
                      className="flex items-start gap-4 justify-end"
                    >
                      <div className="bg-purple-500/10 rounded-lg p-4 max-w-[80%]">
                        <p className="text-gray-300">{chat.content}</p>
                      </div>
                      <div className="w-8 h-8 bg-purple-500/10 rounded-full flex items-center justify-center text-purple-500">
                        U
                      </div>
                    </div>
                  );
                }
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t  bg-gray-900 p-4">
              <div className="max-w-3xl mx-auto relative">
                <input
                  type="text"
                  value={userMessage}
                  onChange={handleUserMessageChange}
                  placeholder="Type a message..."
                  className="w-full bg-gray-800 text-gray-300 rounded-lg pl-4 pr-12 py-3"
                />
                <button
                  onClick={handleSendMessage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-500 hover:text-purple-400"
                >
                  ➤
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sample;
