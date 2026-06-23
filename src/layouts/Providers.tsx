"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppToaster } from "@/components/app-toaster";
import { AuthProvider } from "@/features/auth/context/AuthContext";
import { ThemeProvider } from "./ThemeProvider";
import { ReactNode } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      retry: 1,
    },
  },
});

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          {children}
          <AppToaster />
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
