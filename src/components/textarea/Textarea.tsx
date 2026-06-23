import * as React from "react";
import { cn } from "@/lib/utils";

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  charCount?: number;
  maxChars?: number;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "min-h-20 px-3 py-2 text-sm",
  md: "min-h-24 px-3 py-2.5 text-sm",
  lg: "min-h-32 px-4 py-3 text-base",
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
        <label className="block text-sm font-medium text-fg mb-1.5">
          {label}
          {props.required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      <textarea
        className={cn(
          "w-full rounded-lg border border-border bg-surface text-fg transition-colors",
          "placeholder:text-subtle resize-y leading-relaxed",
          "focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20",
          "disabled:bg-surface-2 disabled:cursor-not-allowed disabled:opacity-60",
          error && "border-error focus:border-error focus:ring-error/20",
          sizeClasses[size],
          className,
        )}
        ref={ref}
        {...props}
      />
      <div className="flex justify-between items-start mt-1.5 gap-4">
        <div>
          {error && <p className="text-sm text-error">{error}</p>}
          {helperText && !error && (
            <p className="text-sm text-muted">{helperText}</p>
          )}
        </div>
        {maxChars && (
          <p
            className={cn(
              "text-xs font-medium shrink-0",
              charCount && charCount > maxChars * 0.9
                ? "text-warning"
                : "text-subtle",
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
