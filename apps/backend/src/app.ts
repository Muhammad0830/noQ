import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { userRoutes, adminRoutes, generalRoutes } from "./routes/index.js";
import { validateShop } from "@/http/middlewares/validate.middleware.js";
import { adminOnly } from "@/http/middlewares/admin.middleware.js";
import { authMiddleware } from "@/http/middlewares/auth.middleware.js";

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
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
  validateShop,
  adminOnly,
  adminRoutes.dashboardRouter,
);
app.use(
  "/admin/analytics",
  authMiddleware,
  validateShop,
  adminOnly,
  adminRoutes.analyticsRouter,
);
app.use(
  "/admin/history",
  authMiddleware,
  validateShop,
  adminOnly,
  adminRoutes.historyRouter,
);
app.use(
  "/admin/services",
  authMiddleware,
  validateShop,
  adminOnly,
  adminRoutes.adminServicePanel,
);
app.use(
  "/admin/staffs",
  authMiddleware,
  validateShop,
  adminOnly,
  adminRoutes.staffRouter,
);
app.use(
  "/admin/schedule",
  authMiddleware,
  validateShop,
  adminOnly,
  adminRoutes.scheduleRouter,
);
app.use(
  "/admin/bookings",
  authMiddleware,
  validateShop,
  adminOnly,
  adminRoutes.bookingAdminRouter,
);
app.use(
  "/admin/shops",
  authMiddleware,
  validateShop,
  adminOnly,
  adminRoutes.adminShopRouter,
);

export default app;
