"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import type { AuthContextType, User } from "@shared/types/types";
import api, {
  API_ENDPOINTS,
  clearPersistedAuth,
  getStorageBySource,
  getStoredAuth,
  persistAuth,
  USER_STORAGE_KEY,
} from "@/lib/api";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type ApiUserPayload = {
  id: string;
  email: string;
  name?: string;
  phoneNumber?: string | null;
  avatarUrl?: string | null;
  role?: "USER" | "ADMIN";
  createdAt?: string;
};

const mapApiUserToUser = (apiUser: ApiUserPayload): User => ({
  id: apiUser.id,
  email: apiUser.email,
  name: apiUser.name || apiUser.email?.split("@")[0] || "User",
  phoneNumber: apiUser.phoneNumber || undefined,
  avatarUrl: apiUser.avatarUrl || undefined,
  role: apiUser.role || "USER",
  createdAt: apiUser.createdAt || new Date().toISOString(),
});

const parseErrorMessage = async (response: Response) => {
  try {
    const errorData = await response.json();
    return errorData?.error || errorData?.message || "So'rov bajarilmadi";
  } catch {
    return "So'rov bajarilmadi";
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedAuth = getStoredAuth();
      const token = storedAuth?.token ?? null;
      const savedUser = storedAuth?.savedUser ?? null;

      if (!token) {
        if (savedUser) {
          localStorage.removeItem(USER_STORAGE_KEY);
        }
        setIsLoading(false);
        return;
      }

      try {
        const profileResponse = await fetch(API_ENDPOINTS.auth.me, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!profileResponse.ok) {
          throw new Error("Sessiya yaroqsiz yoki muddati tugagan");
        }

        const profileData = await profileResponse.json();
        const mappedUser = mapApiUserToUser(profileData);
        setUser(mappedUser);
        const activeStorage = getStorageBySource(storedAuth?.source ?? "local");
        activeStorage?.setItem(USER_STORAGE_KEY, JSON.stringify(mappedUser));
      } catch {
        clearPersistedAuth();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string, remember = true) => {
    setIsLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.auth.signin, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorPayload = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(errorPayload?.error || "Login failed");
      }

      const data = (await response.json()) as {
        access_token?: string;
        refresh_token?: string;
        user?: {
          id: string;
          email: string;
          name?: string;
          phoneNumber?: string;
        };
      };

      if (!data.access_token || !data.user) {
        throw new Error("Invalid login response");
      }

      const userData: User = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name || data.user.email.split("@")[0],
        phoneNumber: data.user.phoneNumber || undefined,
        role: "USER",
        createdAt: new Date().toISOString(),
      };

      setUser(userData);
      persistAuth(
        data.access_token,
        data.refresh_token ?? null,
        userData,
        remember ? "local" : "session",
      );
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement Google OAuth
      // For now, mock Google login
      const mockUser: User = {
        id: "google-" + Date.now(),
        email: "user@gmail.com",
        name: "Google User",
        avatarUrl: "https://i.pravatar.cc/150?img=1",
        role: "USER",
        createdAt: new Date().toISOString(),
      };

      setUser(mockUser);
      localStorage.setItem("user", JSON.stringify(mockUser));
      localStorage.setItem("token", "google-mock-token");

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error("Google login failed", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (
    email: string,
    password: string,
    name: string,
    phone?: string,
  ) => {
    setIsLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.auth.signup, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          name,
          ...(phone ? { phoneNumber: phone } : {}),
        }),
      });

      if (!response.ok) {
        const errorPayload = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(errorPayload?.error || "Signup failed");
      }

      await login(email, password);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: {
    name?: string;
    phoneNumber?: string;
    file?: File | null;
  }) => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    try {
      const formData = new FormData();
      if (data.name) formData.append("name", data.name);
      if (data.phoneNumber) formData.append("phoneNumber", data.phoneNumber);
      if (data.file) formData.append("file", data.file);

      const response = await api.put(API_ENDPOINTS.users.profile, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const updatedData = await response.data;
      const updatedUser = mapApiUserToUser(updatedData);
      setUser(updatedUser);
      const storedAuth = getStoredAuth();
      if (!storedAuth) {
        throw new Error("No active session");
      }

      persistAuth(
        storedAuth.token,
        storedAuth.refreshToken,
        updatedUser,
        storedAuth.source,
      );
      console.log("success ✅");
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    clearPersistedAuth();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
