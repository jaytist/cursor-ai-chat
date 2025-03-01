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
    const { assistantId, name } = req.body;
    console.log("assistantId", assistantId);
    const chatSession = await AssistantRepo.createChatSession(
      Number(assistantId),
      name
    );
    res.status(200).send(chatSession);
  })
);
router.get(
  "/api/chat/sessions/:assistantId",
  asyncErrorHandler(async (req, res, _next) => {
    const { assistantId } = req.params;
    const chatSessions = await AssistantRepo.getChatSessions(assistantId);
    res.status(200).send(chatSessions);
  })
);
router.post(
  "/api/chat/session/:sessionId/messages",
  asyncErrorHandler(async (req, res, _next) => {
    const { sessionId } = req.params;
    const { content, threadId } = req.body;

    console.log("sessionId", sessionId);
    console.log("content", content);
    console.log("threadId", threadId);

    // Store user message
    await dbPool.query(
      "INSERT INTO messages (session_id, content, role) VALUES ($1, $2, $3)",
      [sessionId, content, "user"]
    );
    console.log("error", `1`);

    // Get assistant ID

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
    const thread = threadId
      ? { id: threadId }
      : await openai.beta.threads.create();
    console.log("thread", thread);
    if (threadId === null) {
      console.log("threadId is null");
      await dbPool.query(
        `UPDATE  chat_sessions as cs SET thread_id = $1 WHERE cs.id = $2`,
        [thread.id, sessionId]
      );
    }

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
router.get(
  "/api/chat/session/:sessionId/messages",
  asyncErrorHandler(async (req, res, _next) => {
    const { sessionId } = req.params;
    console.log("sessionId", sessionId);
    const messages = await AssistantRepo.getChatMessages(sessionId);
    res.status(200).send(messages);
  })
);

export default router;
