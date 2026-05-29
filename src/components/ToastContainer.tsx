import * as React from "react";
import { useToast } from "@/context/ToastContext";
import { ToastComponent } from "@/components/ui/Toast";
import { Z_INDEX } from "@/constants/theme";

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div
      className="pointer-events-none fixed right-0 top-0 z-toast flex flex-col gap-3 p-4 md:p-6"
      style={{ zIndex: Z_INDEX.tooltip }}
      aria-live="polite"
      aria-atomic="false"
    >
      {toasts.map((toast) => (
        <ToastComponent
          key={toast.id}
          {...toast}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}
