"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { apiClient } from "@/api/client";
import * as types from "@/types/api";

interface AuthContextType {
  user: types.User | null;
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
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from token
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        try {
          apiClient.setToken(token);
          const userData = await apiClient.getMe();
          setUser(userData);
        } catch (error) {
          // Token is invalid, clear it
          apiClient.clearToken();
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const register = async (payload: types.RegisterPayload) => {
    setIsLoading(true);
    try {
      const response = await apiClient.register(payload);
      setUser(response.user);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (payload: types.LoginPayload) => {
    setIsLoading(true);
    try {
      const response = await apiClient.login(payload);
      setUser(response.user);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await apiClient.logout();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
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
