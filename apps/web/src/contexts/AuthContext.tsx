"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '@shared/types/types';
import API_ENDPOINTS from '@/lib/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    email: string,
    password: string,
    name: string,
    phone?: string,
  ) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = "user";
const ACCESS_TOKEN_STORAGE_KEY = "token";
const REFRESH_TOKEN_STORAGE_KEY = "refresh_token";

type ApiUserPayload = {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string | null;
  role?: "USER" | "ADMIN";
  createdAt?: string;
};

const mapApiUserToUser = (apiUser: ApiUserPayload): User => ({
  id: apiUser.id,
  email: apiUser.email,
  name: apiUser.name || apiUser.email?.split("@")[0] || "User",
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

const persistAuth = (
  token: string,
  refreshToken: string | null,
  userData: User,
) => {
  localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, token);
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, refreshToken);
  } else {
    localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
  }
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
};

const clearPersistedAuth = () => {
  localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
  localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
  localStorage.removeItem(USER_STORAGE_KEY);
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
      const savedUser = localStorage.getItem(USER_STORAGE_KEY);

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
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(mappedUser));
      } catch {
        clearPersistedAuth();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.auth.signin, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorPayload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(errorPayload?.error || 'Login failed');
      }

      const data = (await response.json()) as {
        access_token?: string;
        user?: { id: string; email: string };
      };

      if (!data.access_token || !data.user) {
        throw new Error('Invalid login response');
      }

      const userData: User = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.email.split('@')[0],
        role: 'USER',
        createdAt: new Date().toISOString(),
      };

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', data.access_token);
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
        id: 'google-' + Date.now(),
        email: 'user@gmail.com',
        name: 'Google User',
        avatarUrl: 'https://i.pravatar.cc/150?img=1',
        role: 'USER',
        createdAt: new Date().toISOString(),
      };
      
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('token', 'google-mock-token');
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Google login failed', error);
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
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });

      if (!response.ok) {
        const errorPayload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(errorPayload?.error || 'Signup failed');
      }

      await login(email, password);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
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
