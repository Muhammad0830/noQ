import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { userRoutes, adminRoutes, generalRoutes } from "./routes/index.js";
import { adminOnly } from "@/http/middlewares/admin.middleware.js";
import { authMiddleware } from "@/http/middlewares/auth.middleware.js";
import { shopContextMiddleware } from "./http/middlewares/shopContext.middleware.js";
import { authorizeShopAcessUseCase } from "./composition/shop.js";

const app = express();

const allowedOrigins = [
  "https://no-q-bay.vercel.app",
  "http://localhost:3000"
];

app.use(
  cors({
    origin: allowedOrigins,
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

app.use(
  "/admin/dashboard",
  authMiddleware,
  shopContextMiddleware(authorizeShopAcessUseCase),
  adminOnly,
  adminRoutes.dashboardRouter,
);
app.use(
  "/admin/analytics",
  authMiddleware,
  shopContextMiddleware(authorizeShopAcessUseCase),
  adminOnly,
  adminRoutes.analyticsRouter,
);
app.use(
  "/admin/services",
  authMiddleware,
  shopContextMiddleware(authorizeShopAcessUseCase),
  adminOnly,
  adminRoutes.adminServicePanel,
);
app.use(
  "/admin/staffs",
  authMiddleware,
  shopContextMiddleware(authorizeShopAcessUseCase),
  adminOnly,
  adminRoutes.staffRouter,
);
app.use(
  "/admin/schedule",
  authMiddleware,
  shopContextMiddleware(authorizeShopAcessUseCase),
  adminOnly,
  adminRoutes.scheduleRouter,
);
app.use(
  "/admin/bookings",
  authMiddleware,
  shopContextMiddleware(authorizeShopAcessUseCase),
  adminOnly,
  adminRoutes.bookingAdminRouter,
);
app.use(
  "/admin/shops",
  authMiddleware,
  shopContextMiddleware(authorizeShopAcessUseCase),
  adminOnly,
  adminRoutes.adminShopRouter,
);

app.use(
  "/admin/blocks",
  authMiddleware,
  shopContextMiddleware(authorizeShopAcessUseCase),
  adminOnly,
  adminRoutes.shopBlockRouter
)

export default app;