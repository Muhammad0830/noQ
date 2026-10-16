import categoryRouter from "@/routes/user_panel/categories.routes.js";
import authRouter from "@/routes/auth.routes.js";
import userRouter from "@/routes/user.routes.js";
import bookingRouter from "@/routes/user_panel/bookings.routes.js";
import favouriteRouter from "@/routes/user_panel/favourites.routes.js";
import serviceRouter from "@/routes/user_panel/services.routes.js";
import adminServicePanel from "@/routes/admin_panel/services.routes.js";
import shopRouter from "@/routes/user_panel/shops.routes.js";
import reviewsRouter from "@/routes/user_panel/reviews.routes.js";
import dashboardRouter from "@/routes/admin_panel/dashboard.routes.js";
import analyticsRouter from "@/routes/admin_panel/analytics.routes.js";
import historyRouter from "@/routes/admin_panel/history.routes.js";
import staffRouter from "@/routes/admin_panel/staff.routes.js";
import scheduleRouter from "@/routes/admin_panel/schedule.routes.js";
import bookingAdminRouter from "@/routes/admin_panel/bookings.routes.js";
import adminShopRouter from "@/routes/admin_panel/shop.routes.js";

export const userRoutes = {
  categoryRouter,
  bookingRouter,
  favouriteRouter,
  serviceRouter,
  shopRouter,
  reviewsRouter,
};

export const adminRoutes = {
  dashboardRouter,
  analyticsRouter,
  historyRouter,
  adminServicePanel,
  staffRouter,
  scheduleRouter,
  bookingAdminRouter,
  adminShopRouter,
};

export const generalRoutes = {
  authRouter,
  userRouter,
};
