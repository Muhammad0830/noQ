import "dotenv/config";
import { env } from "./config/config.js";
import app from "./app.js";
import prisma from "@/db/prisma.js";

async function startServer() {
  try {
    await prisma.$connect();
    console.log("Database connected successfully");

    app.listen(env.PORT, () => {
      console.log(`Server is running on port ${env.PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    process.exit(1);
  }
}

startServer();