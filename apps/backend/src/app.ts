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
      "https://no-q-bay.vercel.app/",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use("/categories", userRoutes.categoryRouter);
app.use("/auth", generalRoutes.authRouter);
app.use("/users", generalRoutes.userRouter);
app.use("/bookings", userRoutes.bookingRouter);
app.use("/favourites", userRoutes.favouriteRouter);
app.use("/services", userRoutes.serviceRouter);
app.use("/shops", userRoutes.shopRouter);
app.use("/reviews", userRoutes.reviewsRouter);

app.get("/test", (req, res) => {
  res.json({ ok: true, message: "is working" });
});

app.use(
  "/admin/dashboard",
  authMiddleware,
  shopValidateMiddleware,
  adminOnly,
  adminRoutes.dashboardRouter,
);
app.use(
  "/admin/analytics",
  authMiddleware,
  shopValidateMiddleware,
  adminOnly,
  adminRoutes.analyticsRouter,
);
app.use(
  "/admin/history",
  authMiddleware,
  shopValidateMiddleware,
  adminOnly,
  adminRoutes.historyRouter,
);
app.use(
  "/admin/services",
  authMiddleware,
  shopValidateMiddleware,
  adminOnly,
  adminRoutes.adminServicePanel,
);
app.use(
  "/admin/staffs",
  authMiddleware,
  shopValidateMiddleware,
  adminOnly,
  adminRoutes.staffRouter,
);
app.use(
  "/admin/schedule",
  authMiddleware,
  shopValidateMiddleware,
  adminOnly,
  adminRoutes.scheduleRouter,
);

export default app;
