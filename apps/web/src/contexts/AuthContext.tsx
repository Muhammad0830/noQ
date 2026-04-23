"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import type { AuthContextType, Shop, User } from "@shared/types/general_types";
import api, {
  API_ENDPOINTS,
  clearPersistedAuth,
  getStoredAuth,
  persistAuth,
} from "@/lib/api";
import { useApiMutation } from "@/hooks/useApiMutation";
import { supabase } from "@/lib/supabaseClient";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type ApiUserPayload = {
  id: string;
  email: string;
  name?: string;
  phoneNumber?: string | null;
  avatarUrl?: string | null;
  role?: "USER" | "ADMIN";
  createdAt?: string;
  shops?: Shop[];
};

type SignInPayload = {
  email: string;
  password: string;
};

type SignInResponse = {
  access_token?: string;
  refresh_token?: string;
  user?: ApiUserPayload;
};

type SignUpPayload = {
  email: string;
  password: string;
  name: string;
  phoneNumber?: string;
};

const mapApiUserToUser = (apiUser: ApiUserPayload): User => ({
  id: apiUser.id,
  email: apiUser.email,
  name: apiUser.name || apiUser.email?.split("@")[0] || "User",
  phoneNumber: apiUser.phoneNumber || undefined,
  avatarUrl: apiUser.avatarUrl || undefined,
  role: apiUser.role || "USER",
  createdAt: apiUser.createdAt || new Date().toISOString(),
  shops: apiUser.shops || [],
});

function clearProviderSessionState() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem("providerMode");
  window.localStorage.removeItem("selected_shop_id");
}

function readCachedUser(): User | null {
  if (typeof window === "undefined") return null;
  const storedAuth = getStoredAuth();
  if (!storedAuth?.token || !storedAuth?.savedUser) return null;
  try {
    return JSON.parse(storedAuth.savedUser) as User;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(readCachedUser);
  const [isLoading, setIsLoading] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    const storedAuth = getStoredAuth();
    return !!storedAuth?.token && !storedAuth?.savedUser;
  });

  const signInMutation = useApiMutation<SignInResponse, SignInPayload>(
    API_ENDPOINTS.auth.signin,
    "post",
  );
  const signUpMutation = useApiMutation<unknown, SignUpPayload>(
    API_ENDPOINTS.auth.signup,
    "post",
  );

  useEffect(() => {
    const initializeAuth = async () => {
      const storedAuth = getStoredAuth();

      if (!storedAuth?.token || !storedAuth?.refreshToken) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase.auth.setSession({
          access_token: storedAuth.token,
          refresh_token: storedAuth.refreshToken,
        });

        if (error || !data.session) {
          throw error;
        }

        const newAccessToken = data.session.access_token;
        const newRefreshToken = data.session.refresh_token;

        persistAuth(
          newAccessToken,
          newRefreshToken,
          JSON.parse(storedAuth.savedUser || "{}"),
          storedAuth.source,
        );

        const profileResponse = await api.get(API_ENDPOINTS.auth.me, {
          headers: {
            Authorization: `Bearer ${newAccessToken}`,
          },
        });

        const mappedUser = mapApiUserToUser(profileResponse.data);
        setUser(mappedUser);
      } catch {
        clearPersistedAuth();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          persistAuth(
            session.access_token,
            session.refresh_token,
            user!,
            "local",
          );
        }
      },
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [user]);

  const login = async (email: string, password: string, remember = true) => {
    setIsLoading(true);
    try {
      const data = await signInMutation.mutateAsync({ email, password });

      if (!data.access_token || !data.user) {
        throw new Error("Invalid login response");
      }

      const profileResponse = await api.get<ApiUserPayload>(
        API_ENDPOINTS.auth.me,
        {
          headers: {
            Authorization: `Bearer ${data.access_token}`,
          },
        },
      );

      const profileData = profileResponse.data;
      const mappedUser = mapApiUserToUser(profileData);
      if (mappedUser.role !== "ADMIN") {
        clearProviderSessionState();
      }

      setUser(mappedUser);
      persistAuth(
        data.access_token,
        data.refresh_token ?? null,
        mappedUser,
        "local",
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
      await signUpMutation.mutateAsync({
        email,
        password,
        name,
        ...(phone ? { phoneNumber: phone } : {}),
      });

      await login(email, password);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: {
    name?: string;
    email?: string;
    phoneNumber?: string;
    file?: File | null;
  }) => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    try {
      const formData = new FormData();
      if (data.name !== undefined) formData.append("name", data.name);
      if (data.email !== undefined) formData.append("email", data.email);
      if (data.phoneNumber !== undefined)
        formData.append("phoneNumber", data.phoneNumber);
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
    clearProviderSessionState();
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
