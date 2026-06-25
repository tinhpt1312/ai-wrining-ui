"use client";

import * as React from "react";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import type { InputProps } from "@/components/input";

const PasswordInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, ...props }, ref) => {
    const [visible, setVisible] = useState(false);

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-fg mb-1.5">
            {label}
            {props.required && <span className="text-error ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <input
            type={visible ? "text" : "password"}
            className={cn(
              "w-full h-10 px-3 pr-10 text-sm rounded-lg border border-border text-fg input-glass",
              "placeholder:text-subtle/80 transition-all duration-200",
              "focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20",
              "disabled:bg-surface-2 disabled:cursor-not-allowed disabled:opacity-60",
              error && "border-error focus:border-error focus:ring-error/20",
              className,
            )}
            ref={ref}
            {...props}
          />
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setVisible((prev) => !prev)}
            className={cn(
              "absolute right-2 top-1/2 -translate-y-1/2",
              "inline-flex h-8 w-8 items-center justify-center rounded-md",
              "text-muted hover:text-fg hover:bg-surface-2 transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
            )}
            aria-label={visible ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
          >
            {visible ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {error && <p className="mt-1.5 text-sm text-error">{error}</p>}
        {helperText && !error && (
          <p className="mt-1.5 text-sm text-muted">{helperText}</p>
        )}
      </div>
    );
  },
);
PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
