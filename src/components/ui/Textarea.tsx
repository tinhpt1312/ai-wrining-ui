import * as React from "react";
import { cn } from "@/lib/utils";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  charCount?: number;
  maxChars?: number;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    { className, label, error, helperText, charCount, maxChars, ...props },
    ref,
  ) => (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-black dark:text-white mb-2">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        className={cn(
          "w-full px-4 py-2 text-base border border-gray-300 rounded-lg",
          "bg-white text-black placeholder:text-gray-400",
          "focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent",
          "disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50",
          "dark:bg-black dark:border-gray-700 dark:text-white dark:placeholder:text-gray-500",
          "dark:focus:ring-white",
          "resize-none",
          error && "border-red-500 focus:ring-red-500",
          className,
        )}
        ref={ref}
        {...props}
      />
      <div className="flex justify-between items-start mt-2">
        <div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          {helperText && !error && (
            <p className="text-sm text-gray-500">{helperText}</p>
          )}
        </div>
        {maxChars && (
          <p
            className={cn(
              "text-sm",
              charCount && charCount > maxChars * 0.9
                ? "text-orange-500"
                : "text-gray-500",
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
