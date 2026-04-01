import { AuthStorageSource, User } from "@shared/types/types";
import axios from "axios";

const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const normalizedApiUrl = rawApiUrl.replace(/\/+$/, "");
const API_BASE_URL = /\/api$/i.test(normalizedApiUrl)
  ? normalizedApiUrl
  : `${normalizedApiUrl}/api`;

export const USER_STORAGE_KEY = "user";
export const ACCESS_TOKEN_STORAGE_KEY = "token";
export const REFRESH_TOKEN_STORAGE_KEY = "refresh_token";

export const getStorageBySource = (source: AuthStorageSource) =>
  source === "local" ? localStorage : sessionStorage;

export const getStoredAuth = () => {
  const localToken = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
  if (localToken) {
    return {
      source: "local" as const,
      token: localToken,
      refreshToken: localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY),
      savedUser: localStorage.getItem(USER_STORAGE_KEY),
    };
  }

  const sessionToken = sessionStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
  if (sessionToken) {
    return {
      source: "session" as const,
      token: sessionToken,
      refreshToken: sessionStorage.getItem(REFRESH_TOKEN_STORAGE_KEY),
      savedUser: sessionStorage.getItem(USER_STORAGE_KEY),
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
  const targetStorage = getStorageBySource(source);
  const otherStorage = getStorageBySource(
    source === "local" ? "session" : "local",
  );

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
  localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
  localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
  localStorage.removeItem(USER_STORAGE_KEY);
  sessionStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
  sessionStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
  sessionStorage.removeItem(USER_STORAGE_KEY);
};


const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:10000",
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
  shopReviews: (id: string) => `${API_BASE_URL}/shops/${id}/reviews`,
  shopTimeline: (id: string) => `${API_BASE_URL}/shops/${id}/day-timeline`,

  // Services
  services: `${API_BASE_URL}/services`,
  serviceById: (id: string) => `${API_BASE_URL}/services/${id}`,

  // Bookings
  bookings: `${API_BASE_URL}/bookings`,
  activeBookings: `${API_BASE_URL}/bookings/active`,
  bookingHistory: `${API_BASE_URL}/bookings/history`,

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
};

export default api;
