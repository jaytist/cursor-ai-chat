export async function getAssistants() {
  const response = await fetch("http://localhost:3000/api/assistants");
  return await response.json();
}

export async function createChatSession(assistantId: string, name: string) {
  const response = await fetch("http://localhost:3000/api/chat/session", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ assistantId, name }),
  });
  return await response.json();
}

export async function sendMessageToChatSession(session: any, message: string) {
  const response = await fetch(
    `http://localhost:3000/api/chat/session/${session.id}/messages`,
    {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ content: message, threadId: session.threadId }),
    }
  );
  return await response.json();
}

export async function getChatSessions(assistantId: number) {
  const response = await fetch(
    `http://localhost:3000/api/chat/sessions/${assistantId}`
  );
  return await response.json();
}

export async function getChatMessages(sessionId: string) {
  const response = await fetch(
    `http://localhost:3000/api/chat/session/${sessionId}/messages`
  );
  return await response.json();
}
