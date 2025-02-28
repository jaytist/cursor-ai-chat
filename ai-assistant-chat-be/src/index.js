import dotenv from "dotenv";
dotenv.config();

console.log("API Key:", process.env.OPENAI_API_KEY);

import app from "./app.js";

const PORT = process.env.PORT || 3000;

const serverInstance = app();

serverInstance.listen(PORT, () => {
  console.log(`Server is  running on http://localhost:${PORT}`);
});
