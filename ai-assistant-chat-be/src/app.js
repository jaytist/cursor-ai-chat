import express from "express";
import cors from "cors";
import assistantBot from "./routes/ai-assistant.js";
import notFoundRoute from "./routes/not-found.js";
import globalErrorHandler from "./middleware/global-error-handler.js";

export default () => {
  const app = express();

  app.use(cors());

  app.use(express.json());

  app.get("/", async (_req, res) => {
    // Send a response to the client
    res.send(`
     <html>
           <head>
             <title>AI Assistant Chat</title>
           </head>
           <body>
            <h1>AI Assistant Chat</h1>
           </body>
      </html>`);
  });

  app.use(assistantBot);
  // before all other routes
  app.use(notFoundRoute);

  // before all middlewares

  app.use(globalErrorHandler);

  return app;
};
