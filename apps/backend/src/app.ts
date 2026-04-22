import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { userRoutes, adminRoutes, generalRoutes } from "./routes/index.js";
import { shopValidateMiddleware } from "./middlewares/shopValidate.middleware.js";
import { adminOnly } from "./middlewares/admin.middleware.js";
import { authMiddleware } from "./middlewares/auth.middleware.js";
import shopRouter from "./routes/user_panel/shops.routes.js";

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://10.20.20.15:3000",
      "https://no-q-bay.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/categories", userRoutes.categoryRouter);
app.use("/api/auth", generalRoutes.authRouter);
app.use("/api/users", generalRoutes.userRouter);
app.use("/api/bookings", userRoutes.bookingRouter);
app.use("/api/favourites", userRoutes.favouriteRouter);
app.use("/api/services", userRoutes.serviceRouter);
// app.use("/api/shops", userRoutes.shopRouter);
app.use("/api/reviews", userRoutes.reviewsRouter);

app.get("/test", (req, res) => {
  res.json({ ok: true, message: "is working" });
});

app.use("/api/shops", shopRouter);

app.get("/api/test", (req, res) => {
  res.json({ ok: true, message: "is working" });
});

app.use("/shops", shopRouter);

app.use(
  "/api/admin/dashboard",
  authMiddleware,
  shopValidateMiddleware,
  adminOnly,
  adminRoutes.dashboardRouter,
);
app.use(
  "/api/admin/analytics",
  authMiddleware,
  shopValidateMiddleware,
  adminOnly,
  adminRoutes.analyticsRouter,
);
app.use(
  "/api/admin/history",
  authMiddleware,
  shopValidateMiddleware,
  adminOnly,
  adminRoutes.historyRouter,
);
app.use(
  "/api/admin/services",
  authMiddleware,
  shopValidateMiddleware,
  adminOnly,
  adminRoutes.adminServicePanel,
);
app.use(
  "/api/admin/staffs",
  authMiddleware,
  shopValidateMiddleware,
  adminOnly,
  adminRoutes.staffRouter,
);
app.use(
  "/api/admin/schedule",
  authMiddleware,
  shopValidateMiddleware,
  adminOnly,
  adminRoutes.scheduleRouter,
);

export default app;
