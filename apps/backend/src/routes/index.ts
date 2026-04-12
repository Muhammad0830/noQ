import categoryRouter from "./user_panel/categories.routes.js";
import authRouter from "./auth.routes.js";
import userRouter from "./user.routes.js";
import bookingRouter from "./user_panel/bookings.routes.js";
import favouriteRouter from "./user_panel/favourites.routes.js";
import serviceRouter from "./user_panel/services.routes.js";
import adminServicePanel from "./admin_panel/services.routes.js";
import shopRouter from "./user_panel/shops.routes.js";
import reviewsRouter from "./user_panel/reviews.routes.js";
import dashboardRouter from "./admin_panel/dashboard.routes.js";
import analyticsRouter from "./admin_panel/analytics.routes.js";
import historyRouter from "./admin_panel/history.routes.js";

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
  adminServicePanel
};

export const generalRoutes = {
  authRouter,
  userRouter,
}

