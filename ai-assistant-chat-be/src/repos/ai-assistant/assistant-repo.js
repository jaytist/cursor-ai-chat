import toCamelCase from "../../utils/to-camel-case.js";
import dbPool from "../../db_pool.js";

export default class AssistantRepo {
  static async getAssistants() {
    const { rows } = await dbPool.query("SELECT * FROM assistants");
    return toCamelCase(rows);
  }

  static async createChatSession(assistantId) {
    console.log("assistantId-repo", assistantId);
    const timestamp = new Date().toLocaleString();
    const { rows } = await dbPool.query(
      "INSERT INTO chat_sessions (assistant_id, title) VALUES ($1, $2) RETURNING *;",
      [assistantId, `Chat -${timestamp}`]
    );

    return toCamelCase(rows)[0];
  }

  static async getChatSessions() {
    const { rows } = await dbPool.query(
      "SELECT * FROM chat_sessions ORDER BY created_at DESC",
      []
    );
    return toCamelCase(rows);
  }
  static async getChatMessages(sessionId) {
    const { rows } = await dbPool.query(
      "SELECT * FROM messages WHERE messages.session_id = $1 ORDER BY created_at DESC",
      [sessionId]
    );
    return toCamelCase(rows);
  }
}
