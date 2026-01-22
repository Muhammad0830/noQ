import "dotenv/config";
import dotenv from "dotenv";
dotenv.config();
import { env } from "./config/config.js";
import app from "./app.js";

app.listen(env.PORT, () => {
  console.log(`Server is running on port ${env.PORT}`);
});
