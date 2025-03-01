export async function sendMessage(message: string) {
  const response = await fetch("http://localhost:3000/api/chat", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ message }),
  });
  return await response.json();
}

export async function getAssistants() {
  const response = await fetch("http://localhost:3000/api/assistants");
  return await response.json();
}

export async function createChatSession(assistantId: string) {
  const response = await fetch("http://localhost:3000/api/chat/session", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ assistantId }),
  });
  return await response.json();
}

export async function sendMessageToChatSession(
  sessionId: string,
  message: string
) {
  const response = await fetch(
    `http://localhost:3000/api/chat/session/${sessionId}/messages`,
    {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ content: message }),
    }
  );
  return await response.json();
}
