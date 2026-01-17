import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import categoryRouter from "./routes/categories.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use("/api/categories", categoryRouter);

export default app;
