import express from "express";
import asyncErrorHandler from "../middleware/async-error-handler.js";
import AssistantBot from "../repos/ai-assistant/assistant.js";

const router = express.Router();
router.post(
  "/api/chat",
  asyncErrorHandler(async (req, res, _next) => {
    const { message } = req.body;
    const resData = await AssistantBot.runAssistantBot(message);
    console.log("resData", resData);

    res.status(200).send(JSON.stringify(resData));
  })
);

export default router;
