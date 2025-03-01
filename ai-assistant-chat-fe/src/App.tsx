import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
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
import { useError } from "./contexts/ErrorContext";

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
  const [isLoadingAssistants, setIsLoadingAssistants] = useState(true);
  const { setError } = useError();

  useEffect(() => {
    // todo add error handling and abort controller
    setIsLoadingAssistants(true);
    getAssistants()
      .then((assistants) => {
        setAssistants(assistants);
        // Optionally set the first assistant as default
        if (assistants.length > 0) {
          setSelectedAssistant(assistants[0]);
        }
      })
      .catch((error: any) => {
        toast.error(error.message || "Failed to load assistants");
        // @ts-ignore
        setError(error?.message || "Failed to load assistants");
      })
      .finally(() => {
        setIsLoadingAssistants(false);
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
        // selectedAssistant?.id as number
        // @ts-ignore
        const sessions = await getChatSessions(selectedAssistant?.id as number);
        if (sessions.error) {
          throw new Error(sessions.error.message || "Failed to fetch sessions");
        }
        console.log("sessions-why", sessions);
        setSessions(sessions);
      } catch (error: any) {
        if (!abortController.signal.aborted) {
          toast.error(error?.message || "Failed to fetch sessions");
          setError(error?.message || "Failed to fetch sessions");
          // console.error("Failed to fetch sessions:", error);
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
        //activeSession?.id as string
        // @ts-ignore
        const messages = await getChatMessages(activeSession?.id as string);
        console.log("Received messages:", messages);
        if (messages.error) {
          throw new Error(messages.error.message || "Failed to fetch messages");
        }
        const formattedMessages = messages.map((msg: any) => ({
          type: msg.role === "user" ? "user" : "ai",
          content: msg.content,
        }));
        console.log("Formatted messages:", formattedMessages);
        setChats(formattedMessages);
      } catch (error: any) {
        if (!abortController.signal.aborted) {
          toast.error(error.message || "Failed to fetch messages");
          setError(error?.message || "Failed to fetch messages");
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
      const response = await createChatSession(
        selectedAssistant.id.toString(),
        selectedAssistant.name
      );
      if (response.error) {
        throw new Error(response.error.message || "Failed to create new chat");
      }
      console.log("response", response);
      setSessions((prev) => [...prev, response]);
      setActiveSession(response);
      setChats([]); // Clear chats for new session
    } catch (error: any) {
      toast.error(error.message || "Failed to create new chat");
      setError(error.message || "Failed to create new chat");
    }
  };

  const handleSendMessage = async () => {
    if (!activeSession) {
      toast.error("No active session or create a new chat first");
      setError(new Error("No active session or create a new chat first"));
      return;
    }

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
      if (response.error) {
        throw new Error(response.error.message || "Failed to send message");
      }
      const currentAIMessage = { type: "ai", content: response.content };
      setChats((prev) => [...prev, currentAIMessage]);
    } catch (error: any) {
      toast.error(error.message || "Failed to send message");
      setError(error.message || "Failed to send message");
    } finally {
      setIsAIResponding(false);
    }
  };

  const handleUserMessageChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setUserMessage(e.target.value);
  };
  //bg-gray-950
  return (
    <div>
      <Toaster position="top-right" />
      <div className="flex flex-col h-screen bg-white dark:bg-gray-950">
        <div className="flex flex-col h-screen px-8 pt-4">
          <ChatHeader />

          <div className="grid grid-cols-4 gap-4 mb-6">
            {isLoadingAssistants
              ? Array(4)
                  .fill(null)
                  .map((_, index) => <AssistantCard key={index} isLoading />)
              : assistants.map((assistant) => (
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
              isLoading={isLoadingSessions}
            />

            <ChatArea
              chats={chats}
              isAIResponding={isAIResponding}
              userMessage={userMessage}
              onUserMessageChange={handleUserMessageChange}
              onSendMessage={handleSendMessage}
              isLoadingMessages={isLoadingMessages}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
