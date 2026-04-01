import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import {
  categoryRouter,
  authRouter,
  userRouter,
  bookingRouter,
  favouriteRouter,
  serviceRouter,
  shopRouter,
  reviewsRouter,
} from "./routes/index.js";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000", "http://10.20.4.57:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/categories", categoryRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/favourites", favouriteRouter);
app.use("/api/services", serviceRouter);
app.use("/api/shops", shopRouter);
app.use("/api/reviews", reviewsRouter);

export default app;
