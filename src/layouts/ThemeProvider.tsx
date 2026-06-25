"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ReactNode } from "react";
import { THEME_STORAGE_KEY } from "@/constants/theme-ui.constants";

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      storageKey={THEME_STORAGE_KEY}
    >
      {children}
    </NextThemesProvider>
  );
}
