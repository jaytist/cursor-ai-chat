export interface Assistant {
  id: number;
  assistantId: string;
  name: string;
  model: string;
  description: string;
}

export interface ChatSession {
  id: string;
  assistantId: string;
  title: string;
  createdAt: string;
  threadId: string;
}
