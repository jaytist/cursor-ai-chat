import React, { useState, useEffect, useRef } from "react";
import {
  getAssistants,
  createChatSession,
  sendMessageToChatSession,
  getChatSessions,
  getChatMessages,
} from "./api/chat";
import { Assistant, ChatSession } from "./types/types";
import { AssistantCard } from "./components/Chat/AssistantCard";
import { ChatHeader } from "./components/Chat/ChatHeader";
import { ChatSidebar } from "./components/Chat/ChatSidebar";
import { ChatArea } from "./components/Chat/ChatArea";

function App() {
  const [userMessage, setUserMessage] = useState("");
  const [chats, setChats] = useState<{ type: string; content: string }[]>([]);

  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSession, setActiveSession] = useState<ChatSession | null>(null);
  const [selectedAssistant, setSelectedAssistant] = useState<Assistant | null>(
    null
  );

  // Add loading states
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isAIResponding, setIsAIResponding] = useState(false);

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

  // Fetch sessions when selected assistant changes
  useEffect(() => {
    if (!selectedAssistant) return;
    console.log("selectedAssistant", selectedAssistant);

    const abortController = new AbortController();

    // Clear chats and active session when assistant changes
    setChats([]);
    setActiveSession(null);

    async function fetchSessions() {
      setIsLoadingSessions(true);
      try {
        const sessions = await getChatSessions(selectedAssistant?.id as number);
        console.log("sessions-why", sessions);
        setSessions(sessions);
      } catch (error) {
        if (!abortController.signal.aborted) {
          console.error("Failed to fetch sessions:", error);
        }
      } finally {
        setIsLoadingSessions(false);
      }
    }

    fetchSessions();
    return () => abortController.abort();
  }, [selectedAssistant]); // Added selectedAssistant as dependency

  // Fetch messages when active session changes
  useEffect(() => {
    if (!activeSession) return;

    const abortController = new AbortController();

    async function fetchMessages() {
      setIsLoadingMessages(true);
      try {
        const messages = await getChatMessages(activeSession?.id as string);
        const formattedMessages = messages.map((msg: any) => ({
          type: msg.role === "user" ? "user" : "ai",
          content: msg.content,
        }));
        setChats(formattedMessages);
      } catch (error) {
        if (!abortController.signal.aborted) {
          console.error("Failed to fetch messages:", error);
        }
      } finally {
        setIsLoadingMessages(false);
      }
    }

    fetchMessages();
    return () => abortController.abort();
  }, [activeSession]);

  const handleCreateNewChat = async () => {
    if (!selectedAssistant) return;

    try {
      const response = await createChatSession(selectedAssistant.id.toString());
      setSessions((prev) => [...prev, response]);
      setActiveSession(response);
      setChats([]); // Clear chats for new session
    } catch (error) {
      console.error("Failed to create chat session:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!activeSession) return;

    const currentUserMessage = {
      type: "user",
      content: userMessage,
    };
    setUserMessage("");

    try {
      setChats((prev) => [...prev, currentUserMessage]);
      setIsAIResponding(true);
      const response = await sendMessageToChatSession(
        activeSession,
        userMessage
      );
      const currentAIMessage = { type: "ai", content: response.content };
      setChats((prev) => [...prev, currentAIMessage]);
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsAIResponding(false);
    }
  };

  const handleUserMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserMessage(e.target.value);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-950">
      <div className="flex flex-col h-screen px-8 pt-4">
        <ChatHeader />

        <div className="grid grid-cols-4 gap-4 mb-6">
          {assistants.map((assistant) => (
            <AssistantCard
              key={assistant.id}
              assistant={assistant}
              isSelected={selectedAssistant?.id === assistant.id}
              onSelect={setSelectedAssistant}
            />
          ))}
        </div>

        <div className="flex gap-4 flex-1 mb-0">
          <ChatSidebar
            sessions={sessions}
            activeSession={activeSession}
            onSessionSelect={setActiveSession}
            onNewChat={handleCreateNewChat}
            hasSelectedAssistant={!!selectedAssistant}
          />

          <ChatArea
            chats={chats}
            isAIResponding={isAIResponding}
            userMessage={userMessage}
            onUserMessageChange={handleUserMessageChange}
            onSendMessage={handleSendMessage}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
