"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiRequest } from "@/lib/api";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: "customer" | "admin" | "landlord";
  is_active: boolean;
  is_verified: boolean;
};

type AuthContextValue = {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  refreshUser: () => Promise<AuthUser | null>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

type UserResponse = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: "customer" | "admin" | "landlord";
  is_active: boolean;
  is_verified: boolean;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function refreshUser() {
    try {
      const currentUser = await apiRequest<UserResponse>("/api/auth/me");
      setUser(currentUser);
      return currentUser;
    } catch {
      try {
        await apiRequest("/api/auth/refresh", { method: "POST" });
        const currentUser = await apiRequest<UserResponse>("/api/auth/me");
        setUser(currentUser);
        return currentUser;
      } catch {
        setUser(null);
        return null;
      }
    }
  }

  async function logout() {
    await apiRequest("/api/auth/logout", { method: "POST" }).catch(() => null);
    setUser(null);
  }

  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      const currentUser = await refreshUser();
      if (mounted) {
        setUser(currentUser);
        setIsLoading(false);
      }
    }

    loadUser();

    return () => {
      mounted = false;
    };
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: Boolean(user),
      refreshUser,
      logout,
    }),
    [user, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }
  return context;
}
