import { AuthStorageSource, User } from "@shared/types/general_types";
import axios from "axios";

const rawApiUrl =
  process.env.NEXT_PUBLIC_API_URL || "http://no-q-back.vercel.app.com";
const normalizedApiUrl = rawApiUrl.replace(/\/+$/, "");
const API_BASE_URL = /\/api$/i.test(normalizedApiUrl)
  ? normalizedApiUrl
  : `${normalizedApiUrl}`;

export const USER_STORAGE_KEY = "user";
export const ACCESS_TOKEN_STORAGE_KEY = "token";
export const REFRESH_TOKEN_STORAGE_KEY = "refresh_token";

const isBrowser = () => typeof window !== "undefined";

export const getStorageBySource = (
  source: AuthStorageSource,
): Storage | null => {
  if (!isBrowser()) {
    return null;
  }
  return source === "local" ? window.localStorage : window.sessionStorage;
};

export const getStoredAuth = () => {
  if (!isBrowser()) {
    return null;
  }

  const localToken = window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
  if (localToken) {
    return {
      source: "local" as const,
      token: localToken,
      refreshToken: window.localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY),
      savedUser: window.localStorage.getItem(USER_STORAGE_KEY),
    };
  }

  const sessionToken = window.sessionStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
  if (sessionToken) {
    return {
      source: "session" as const,
      token: sessionToken,
      refreshToken: window.sessionStorage.getItem(REFRESH_TOKEN_STORAGE_KEY),
      savedUser: window.sessionStorage.getItem(USER_STORAGE_KEY),
    };
  }

  return null;
};

export const persistAuth = (
  token: string,
  refreshToken: string | null,
  userData: User,
  source: AuthStorageSource = "local",
) => {
  if (!isBrowser()) {
    return;
  }

  const targetStorage = getStorageBySource(source);
  const otherStorage = getStorageBySource(
    source === "local" ? "session" : "local",
  );

  if (!targetStorage || !otherStorage) {
    return;
  }

  targetStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, token);
  if (refreshToken) {
    targetStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, refreshToken);
  } else {
    targetStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
  }
  targetStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));

  otherStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
  otherStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
  otherStorage.removeItem(USER_STORAGE_KEY);
};

export const clearPersistedAuth = () => {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
  window.localStorage.removeItem(USER_STORAGE_KEY);
  window.sessionStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
  window.sessionStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
  window.sessionStorage.removeItem(USER_STORAGE_KEY);
};

const api = axios.create({
  baseURL: rawApiUrl,
  withCredentials: true,
});

// attach token to every request
api.interceptors.request.use((config) => {
  const storedAuth = getStoredAuth()
  if (storedAuth?.token) {
    config.headers.Authorization = `Bearer ${storedAuth.token}`;
  }
  return config;
});

export const API_ENDPOINTS = {
  // Auth
  auth: {
    signin: `${API_BASE_URL}/auth/signin`,
    signup: `${API_BASE_URL}/auth/signup`,
    me: `${API_BASE_URL}/auth/me`,
    checkEmail: `${API_BASE_URL}/auth/check-email`,
  },

  // Categories
  categories: `${API_BASE_URL}/categories`,

  // Shops
  shops: `${API_BASE_URL}/shops`,
  shops_trending: `${API_BASE_URL}/shops/trending/7days`,
  shopById: (id: string) => `${API_BASE_URL}/shops/${id}`,
  shopServices: (id: string) => `${API_BASE_URL}/shops/${id}/services`,
  shopStaff: (id: string) => `${API_BASE_URL}/shops/${id}/staff`,
  shopReviews: (id: string) => `${API_BASE_URL}/shops/${id}/reviews`,
  shopTimeline: (id: string) => `${API_BASE_URL}/shops/${id}/day-timeline`,

  // Services
  services: `${API_BASE_URL}/services`,
  services_trending: `${API_BASE_URL}/services/trending/7days`,
  serviceById: (id: string) => `${API_BASE_URL}/services/${id}`,

  // Bookings
  bookings: `${API_BASE_URL}/bookings`,
  bookingsAvailableSlots: `${API_BASE_URL}/bookings/available-slots`,
  activeBookings: `${API_BASE_URL}/bookings/active`,
  bookingHistory: `${API_BASE_URL}/bookings/history`,
  bookingsByUser: {
    active: `${API_BASE_URL}/bookings/users/active`,
    history: `${API_BASE_URL}/bookings/users/history`,
  },
  bookingCancel: (bookingId: string) => `${API_BASE_URL}/bookings/${bookingId}/cancel`,

  // Favourites
  favourites: {
    shops: `${API_BASE_URL}/favourites/shops`,
    services: `${API_BASE_URL}/favourites/services`,
    addShop: `${API_BASE_URL}/favourites/shop`,
    addService: `${API_BASE_URL}/favourites/service`,
  },

  // Reviews
  reviews: `${API_BASE_URL}/reviews`,
  reviewsByShop: (shopId: string) => `${API_BASE_URL}/reviews/${shopId}`,

  // Users
  users: {
    profile: `${API_BASE_URL}/users/profile`,
  },

  // Admin
  admin: {
    dashboardBaseInfo: `${API_BASE_URL}/admin/dashboard/base_info`,
    dashboardHistory: `${API_BASE_URL}/admin/history`,
    analytics: `${API_BASE_URL}/admin/analytics`,
    analyticsDiagramInfo: `${API_BASE_URL}/admin/analytics/diagram_info`,
    analyticsFamousServices: `${API_BASE_URL}/admin/analytics/famousServices`,
    analyticsPeakHours: `${API_BASE_URL}/admin/analytics/peak-hours`,
    services: `${API_BASE_URL}/admin/services`,
    toggleServiceActive: `${API_BASE_URL}/admin/services/isActive/toggle`,
    schedule: `${API_BASE_URL}/admin/schedule`,
    staffs: `${API_BASE_URL}/admin/staffs`,
    users: `${API_BASE_URL}/users`,
  },
};

export default api;
