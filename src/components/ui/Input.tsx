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
        <label className="block text-sm font-medium text-fg mb-1.5">
          {label}
          {props.required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        className={cn(
          "w-full h-10 px-3 text-sm rounded-lg border border-border bg-surface text-fg",
          "placeholder:text-subtle transition-colors",
          "focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20",
          "disabled:bg-surface-2 disabled:cursor-not-allowed disabled:opacity-60",
          error && "border-error focus:border-error focus:ring-error/20",
          className,
        )}
        ref={ref}
        {...props}
      />
      {error && <p className="mt-1.5 text-sm text-error">{error}</p>}
      {helperText && !error && (
        <p className="mt-1.5 text-sm text-muted">{helperText}</p>
      )}
    </div>
  ),
);
Input.displayName = "Input";

export { Input };
export type { InputProps };
