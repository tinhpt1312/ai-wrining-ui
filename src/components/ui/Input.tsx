import * as React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", label, error, helperText, ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-black dark:text-white mb-2">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        className={cn(
          "w-full px-4 py-2 text-base border border-gray-300 rounded-lg",
          "bg-white text-black placeholder:text-gray-400",
          "focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent",
          "disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50",
          "dark:bg-black dark:border-gray-700 dark:text-white dark:placeholder:text-gray-500",
          "dark:focus:ring-white",
          error && "border-red-500 focus:ring-red-500",
          className,
        )}
        ref={ref}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  ),
);
Input.displayName = "Input";

export { Input };
export type { InputProps };
