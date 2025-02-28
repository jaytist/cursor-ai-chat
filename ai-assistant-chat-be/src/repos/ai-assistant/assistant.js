/**
 *  This AI integeration is based on the built in assistant API.
 *
 *
 * The need for an AI here is eventually to make the bot aware of the information in the database somehow and to respond needed information to user requests
 * based on the dataset it knows.
 *
 *
 *
 */

import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();
const openai = new OpenAI();

export default class AssistantGeneralChat {
  static async runAssistantBot(userMessage, threadId) {
    // Step 1: Create a new thread
    const thread = threadId
      ? await openai.beta.threads.retrieve(threadId)
      : await openai.beta.threads.create();

    // Step 2: Add a message to the thread
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: userMessage,
    });

    // Step 3: Start a run with function calling enabled ???
    let run = await openai.beta.threads.runs.createAndPoll(thread.id, {
      assistant_id: process.env.ASSISTANT_ID_GENERAL_CHAT,
    });

    // Step 4: Retrieve messages after run completion
    const messages = await openai.beta.threads.messages.list(thread.id);

    // Get the last message (assistant's response)
    const lastMessage = messages.data[0];

    // Return the content of the assistant's message
    return { threadId: thread.id, message: lastMessage.content[0].text.value };
  }
}
