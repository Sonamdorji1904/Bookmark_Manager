import dotenv from "dotenv";
import app from "./app";
import { syncDatabase } from "./utils/db";

dotenv.config();

const port = Number(process.env.PORT || 5000);

const bootstrap = async () => {
  await syncDatabase();

  app.listen(port, () => {
    // Keep startup logs explicit for local debugging and deployment probes.
    console.log(`Backend server running on http://localhost:${port}`);
  });
};

bootstrap().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
