"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import type { Shop, User } from "@shared/types/general_types";
import api, {
  API_ENDPOINTS,
  clearPersistedAuth,
  getStoredAuth,
  persistAuth,
} from "@/lib/api";
import { useApiMutation } from "@/hooks/useApiMutation";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isProfileUpdating: boolean
  login: (email: string, password: string, remember?: boolean) => Promise<void>;
  signup: (
    email: string,
    password: string,
    name: string,
    phone?: string,
  ) => Promise<void>;
  logout: () => void;
  updateProfile: (data: {
    name?: string;
    phoneNumber?: string | null;
    file?: File | null;
  }) => Promise<void>;
}

interface ApiUserPayload {
  id: string;
  email: string;
  name: string;
  phoneNumber?: string | null;
  avatarUrl?: string | null;
  role?: "USER" | "ADMIN";
  createdAt?: string;
  shops?: Shop[];
};

interface SignInPayload {
  email: string;
  password: string;
};

interface SignInResponse {
  access_token?: string;
  refresh_token?: string;
  user?: ApiUserPayload;
};

interface SignUpPayload {
  email: string;
  password: string;
  name: string;
  phoneNumber?: string;
};

interface UpdateProfileData {
  name?: string;
  phoneNumber?: string | null;
  file?: File | null;
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
  localStorage.removeItem("providerMode");
  localStorage.removeItem("selected_shop_id");
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isProfileUpdating, setIsProfileUpdating] = useState(false);
  const t = useTranslations();

  useEffect(() => {
    initializeAuth();
  }, []);

  async function initializeAuth() {
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

  const { mutateAsync: signInAsync } = useApiMutation<SignInResponse, SignInPayload>(
    API_ENDPOINTS.auth.signin,
    "post",
  );
  const { mutateAsync: signUpAsync } = useApiMutation<unknown, SignUpPayload>(
    API_ENDPOINTS.auth.signup,
    "post",
  );

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const data = await signInAsync({ email, password });

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      await signUpAsync({
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

  const updateProfile = async (data: UpdateProfileData) => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    setIsProfileUpdating(true);

    const toastId = toast.loading(t("common.loading"));

    try {
      const storedAuth = getStoredAuth();

      if (!storedAuth) {
        throw new Error("No active session");
      }

      const formData = new FormData();

      if (data.name !== undefined) {
        formData.append("name", data.name)
      };

      if (data.phoneNumber !== undefined) {
        formData.append("phoneNumber", data.phoneNumber ?? "")
      };

      if (data.file) {
        formData.append("file", data.file)
      };

      const response = await api.put(API_ENDPOINTS.users.profile, formData);

      const updatedUser = mapApiUserToUser(response.data);

      setUser(updatedUser);
      persistAuth(
        storedAuth.token,
        storedAuth.refreshToken,
        updatedUser,
        storedAuth.source,
      );

      toast.success(t("common.success"), { id: toastId });
    } catch (error) {
      toast.error(t("common.error"), { id: toastId });
      throw error;
    } finally {
      setIsProfileUpdating(false);
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
        isProfileUpdating,
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
