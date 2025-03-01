import toCamelCase from "../../utils/to-camel-case.js";
import dbPool from "../../db_pool.js";

export default class AssistantRepo {
  static async getAssistants() {
    const { rows } = await dbPool.query("SELECT * FROM assistants");
    return toCamelCase(rows);
  }

  static async createChatSession(assistantId) {
    console.log("assistantId-repo", assistantId);
    const { rows } = await dbPool.query(
      "INSERT INTO chat_sessions (assistant_id, title) VALUES ($1, $2) RETURNING *;",
      [assistantId, "New Chat"]
    );

    return toCamelCase(rows)[0];
  }
}
