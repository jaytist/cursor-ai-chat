import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";
import dbPool from "./db_pool.js";

const PORT = process.env.PORT || 3000;

const serverInstance = app();

// serverInstance.listen(PORT, () => {
//   console.log(`Server is  running on http://localhost:${PORT}`);
// });

dbPool
  .connect(process.env.DATABASE_URL)
  .then((_res) => {
    console.log("🚀 Established database database connection!");
    serverInstance.listen(PORT, () => {
      console.log(`Server is  running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.log(" ❌ Connection to database failed!");
    console.log("process.env.DATABASE_URL", process.env.DATABASE_URL);
    console.error(error);
  });
