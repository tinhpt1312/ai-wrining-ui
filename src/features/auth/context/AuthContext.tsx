"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  authService,
  clearAccessToken,
  getAccessToken,
  setAccessToken,
  usersService,
} from "@/api";
import * as types from "@/types/api";

interface AuthContextType {
  user: types.User | null;
  isInitializing: boolean;
  /** @deprecated Dùng isInitializing */
  isLoading: boolean;
  isAuthenticated: boolean;
  register: (payload: types.RegisterPayload) => Promise<void>;
  login: (payload: types.LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: types.User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<types.User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = getAccessToken();
      if (token) {
        try {
          setAccessToken(token);
          const userData = await usersService.getMe();
          setUser(userData);
        } catch {
          clearAccessToken();
          setUser(null);
        }
      }
      setIsInitializing(false);
    };

    initializeAuth();
  }, []);

  const register = async (payload: types.RegisterPayload) => {
    const response = await authService.register(payload);
    if (response.user) {
      setUser(response.user);
    }
  };

  const login = async (payload: types.LoginPayload) => {
    const response = await authService.login(payload);
    setUser(response.user);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isInitializing,
    isLoading: isInitializing,
    isAuthenticated: !!user,
    register,
    login,
    logout,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
