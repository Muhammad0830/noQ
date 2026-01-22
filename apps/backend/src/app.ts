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
  reviewsRouter
} from "./routes/index.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use("/api/categories", categoryRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/favourites", favouriteRouter);
app.use("/api/services", serviceRouter);
app.use("/api/shops", shopRouter);
app.use("/api/reviews", reviewsRouter);

export default app;
