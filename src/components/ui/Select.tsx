import * as React from "react";
import { cn } from "@/lib/utils";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-base",
  lg: "h-12 px-4 text-lg",
};

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      options,
      placeholder,
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
      <select
        className={cn(
          "w-full border-2 rounded-lg transition-colors duration-200",
          "bg-bg text-fg",
          "border-border dark:border-border",
          "focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500",
          "disabled:bg-bg-secondary disabled:cursor-not-allowed disabled:opacity-60",
          "dark:bg-bg dark:text-fg",
          "dark:focus:ring-primary-400/50 dark:focus:border-primary-400",
          "appearance-none cursor-pointer",
          error &&
            "border-error focus:ring-error/50 focus:border-error dark:border-error",
          sizeClasses[size],
          className,
        )}
        ref={ref}
        {...props}
      >
        {placeholder && (
          <option value="" disabled selected hidden>
            {placeholder}
          </option>
        )}
        {options.map((option, index) => (
          <option key={`${option.value}-${index}`} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1.5 text-sm text-error font-medium">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1.5 text-sm text-fg-secondary">{helperText}</p>
      )}
    </div>
  ),
);
Select.displayName = "Select";

export { Select };
export type { SelectProps, SelectOption };
