import toCamelCase from "../../utils/to-camel-case.js";
import dbPool from "../../db_pool.js";

export default class AssistantRepo {
  static async getAssistants() {
    try {
      const { rows } = await dbPool.query("SELECT * FROM assistants");
      return toCamelCase(rows);
    } catch (error) {
      console.error("Error fetching assistants:", error);
      throw new Error("Failed to fetch assistants from database");
    }
  }

  static async createChatSession(assistantId) {
    try {
      if (!assistantId) {
        throw new Error("Assistant ID is required");
      }

      const timestamp = new Date().toLocaleString();
      const { rows } = await dbPool.query(
        "INSERT INTO chat_sessions (assistant_id, title) VALUES ($1, $2) RETURNING *;",
        [assistantId, `Chat -${timestamp}`]
      );

      if (!rows.length) {
        throw new Error("Failed to create chat session");
      }

      return toCamelCase(rows)[0];
    } catch (error) {
      console.error("Error creating chat session:", error);
      throw new Error(`Failed to create chat session: ${error.message}`);
    }
  }

  static async getChatSessions(assistantId) {
    try {
      if (!assistantId) {
        throw new Error("Assistant ID is required");
      }

      const { rows } = await dbPool.query(
        "SELECT * FROM chat_sessions WHERE assistant_id = $1 ORDER BY created_at DESC",
        [assistantId]
      );
      return toCamelCase(rows);
    } catch (error) {
      console.error("Error fetching chat sessions:", error);
      throw new Error(`Failed to fetch chat sessions: ${error.message}`);
    }
  }

  static async getChatMessages(sessionId) {
    try {
      if (!sessionId) {
        throw new Error("Session ID is required");
      }

      const { rows } = await dbPool.query(
        "SELECT * FROM messages WHERE messages.session_id = $1 ORDER BY created_at ASC",
        [sessionId]
      );
      return toCamelCase(rows);
    } catch (error) {
      console.error("Error fetching chat messages:", error);
      throw new Error(`Failed to fetch chat messages: ${error.message}`);
    }
  }
}
