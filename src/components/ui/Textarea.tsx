import * as React from "react";
import { cn } from "@/lib/utils";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  charCount?: number;
  maxChars?: number;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "min-h-20 px-3 py-2 text-sm",
  md: "min-h-24 px-4 py-2 text-base",
  lg: "min-h-32 px-4 py-3 text-lg",
};

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      charCount,
      maxChars,
      size = "md",
      ...props
    },
    ref,
  ) => (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-fg dark:text-fg mb-2">
          {label}
          {props.required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      <textarea
        className={cn(
          "w-full border-2 rounded-lg transition-colors duration-200",
          "bg-bg text-fg placeholder:text-fg-tertiary",
          "border-border dark:border-border",
          "focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500",
          "disabled:bg-bg-secondary disabled:cursor-not-allowed disabled:opacity-60",
          "dark:bg-bg dark:text-fg dark:placeholder:text-fg-tertiary",
          "dark:focus:ring-primary-400/50 dark:focus:border-primary-400",
          "resize-none",
          error &&
            "border-error focus:ring-error/50 focus:border-error dark:border-error",
          sizeClasses[size],
          className,
        )}
        ref={ref}
        {...props}
      />
      <div className="flex justify-between items-start mt-2">
        <div>
          {error && <p className="text-sm text-error font-medium">{error}</p>}
          {helperText && !error && (
            <p className="text-sm text-fg-secondary">{helperText}</p>
          )}
        </div>
        {maxChars && (
          <p
            className={cn(
              "text-sm font-medium",
              charCount && charCount > maxChars * 0.9
                ? "text-warning"
                : "text-fg-tertiary",
            )}
          >
            {charCount || 0} / {maxChars}
          </p>
        )}
      </div>
    </div>
  ),
);
Textarea.displayName = "Textarea";

export { Textarea };
export type { TextareaProps };
