import express from "express";
import asyncErrorHandler from "../middleware/async-error-handler.js";
import AssistantBot from "../repos/ai-assistant/assistant.js";
import AssistantRepo from "../repos/ai-assistant/assistant-repo.js";

import OpenAI from "openai";
import dotenv from "dotenv";
import dbPool from "../db_pool.js";
dotenv.config();
const openai = new OpenAI();

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
    console.log("assistantId", assistantId);
    const chatSession = await AssistantRepo.createChatSession(
      Number(assistantId)
    );
    res.status(200).send(chatSession);
  })
);

router.post(
  "/api/chat/session/:sessionId/messages",
  asyncErrorHandler(async (req, res, _next) => {
    const { sessionId } = req.params;
    const { content } = req.body;

    console.log("sessionId", sessionId);
    console.log("content", content);

    // Store user message
    await dbPool.query(
      "INSERT INTO messages (session_id, content, role) VALUES ($1, $2, $3)",
      [sessionId.toString(), content, "user"]
    );
    console.log("error", `1`);

    // Get assistant ID
    // const { rows } = await dbPool.query(
    //   "SELECT assistant_id FROM chat_sessions WHERE id = $1",
    //   [sessionId]
    // );
    const { rows } = await dbPool.query(
      `
      SELECT a.assistant_id as openai_assistant_id 
      FROM chat_sessions cs
      JOIN assistants a ON cs.assistant_id = a.id
      WHERE cs.id = $1
    `,
      [sessionId]
    );

    console.log("error", `2`);

    // Get OpenAI thread ID (implement thread storage as needed)
    const thread = await openai.beta.threads.create();

    console.log("error", `3`, thread);
    // Create OpenAI message
    // await openai.beta.threads.messages.create(thread.id, {
    //   role: "user",
    //   content,
    // });
    const resVV = await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: content,
    });

    console.log("error", `4`, resVV);

    // Create run
    console.log("rows", rows);
    const run = await openai.beta.threads.runs.createAndPoll(thread.id, {
      assistant_id: rows[0].openai_assistant_id,
    });

    console.log("error", `5`, run);

    // Store assistant response
    const messages = await openai.beta.threads.messages.list(thread.id);
    const assistantResponse = messages.data[0].content[0].text.value;

    await dbPool.query(
      "INSERT INTO messages (session_id, content, role) VALUES ($1, $2, $3)",
      [sessionId, assistantResponse, "assistant"]
    );

    res.json({ content: assistantResponse });
  })
);
export default router;
