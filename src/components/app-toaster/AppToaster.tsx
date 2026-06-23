"use client";

import { useTheme } from "next-themes";
import { Toaster } from "sonner";

export function AppToaster() {
  const { resolvedTheme } = useTheme();

  return (
    <Toaster
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      richColors
      closeButton
      position="top-right"
      toastOptions={{
        classNames: {
          toast: "bg-surface border border-border text-fg shadow-lg rounded-xl",
        },
      }}
    />
  );
}
