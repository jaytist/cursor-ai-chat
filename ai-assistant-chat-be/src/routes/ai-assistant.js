import express from "express";
import asyncErrorHandler from "../middleware/async-error-handler.js";
import AssistantBot from "../repos/ai-assistant/assistant.js";
import AssistantRepo from "../repos/ai-assistant/assistant-repo.js";

const router = express.Router();
router.post(
  "/api/chat",
  asyncErrorHandler(async (req, res, _next) => {
    const { message } = req.body;
    console.log("message", message);
    const resData = await AssistantBot.runAssistantBot(message);
    console.log("resData", resData);

    res.status(200).send(JSON.stringify(resData));
  })
);

router.get(
  "/api/assistants",
  asyncErrorHandler(async (req, res, _next) => {
    const assistants = await AssistantRepo.getAssistants();
    res.status(200).send(assistants);
  })
);

router.post(
  "/api/chat/session",
  asyncErrorHandler(async (req, res, _next) => {
    const { assistantId } = req.body;
    const chatSession = await AssistantRepo.createChatSession(assistantId);
    res.status(200).send(JSON.stringify(chatSession));
  })
);

router.post(
  "/api/chat/session/:sessionId/messages",
  asyncErrorHandler(async (req, res, _next) => {
    const { sessionId } = req.params;
    const { content } = req.body;

    // Store user message
    await pool.query(
      "INSERT INTO messages (session_id, content, role) VALUES ($1, $2, $3)",
      [sessionId, content, "user"]
    );

    // Get assistant ID
    const { rows } = await pool.query(
      "SELECT assistant_id FROM chat_sessions WHERE id = $1",
      [sessionId]
    );

    // Get OpenAI thread ID (implement thread storage as needed)
    const thread = await openai.beta.threads.create();

    // Create OpenAI message
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content,
    });

    // Create run
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: rows[0].assistant_id,
    });

    // Store assistant response
    const messages = await openai.beta.threads.messages.list(thread.id);
    const assistantResponse = messages.data[0].content[0].text.value;

    await pool.query(
      "INSERT INTO messages (session_id, content, role) VALUES ($1, $2, $3)",
      [sessionId, assistantResponse, "assistant"]
    );

    res.json({ content: assistantResponse });
  })
);
export default router;
