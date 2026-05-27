import * as React from "react";
import { cn } from "@/lib/utils";

interface LoadingProps {
  text?: string;
  size?: "sm" | "md" | "lg";
  fullScreen?: boolean;
}

export function Loading({
  text = "Loading...",
  size = "md",
  fullScreen = false,
}: LoadingProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  const container = fullScreen ? "min-h-screen flex" : "flex";

  return (
    <div className={cn(container, "items-center justify-center gap-3")}>
      <svg
        className={cn(
          "animate-spin text-black dark:text-white",
          sizeClasses[size],
        )}
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      {text && (
        <span className="text-black dark:text-white font-medium">{text}</span>
      )}
    </div>
  );
}

interface ErrorProps {
  title?: string;
  message: string;
  retry?: () => void;
}

export function Error({ title = "Error", message, retry }: ErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-6 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
      <div className="flex flex-col gap-2 text-center">
        <h3 className="text-lg font-semibold text-red-900 dark:text-red-200">
          {title}
        </h3>
        <p className="text-red-800 dark:text-red-300">{message}</p>
      </div>
      {retry && (
        <button
          onClick={retry}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm"
        >
          Try Again
        </button>
      )}
    </div>
  );
}

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-12 text-center">
      {icon && <div className="text-4xl opacity-50">{icon}</div>}
      <div className="flex flex-col gap-2">
        <h3 className="text-xl font-semibold text-black dark:text-white">
          {title}
        </h3>
        {description && (
          <p className="text-gray-600 dark:text-gray-400 max-w-md">
            {description}
          </p>
        )}
      </div>
      {action && (
        <button
          onClick={action.onClick}
          className="mt-4 px-6 py-2 bg-black text-white dark:bg-white dark:text-black rounded-lg hover:bg-black/90 dark:hover:bg-white/90 transition-colors font-medium"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

interface AlertProps {
  type: "success" | "error" | "warning" | "info";
  title?: string;
  message: string;
  onClose?: () => void;
}

export function Alert({ type, title, message, onClose }: AlertProps) {
  const bgColors = {
    success: "bg-green-50 dark:bg-green-950",
    error: "bg-red-50 dark:bg-red-950",
    warning: "bg-yellow-50 dark:bg-yellow-950",
    info: "bg-blue-50 dark:bg-blue-950",
  };

  const borderColors = {
    success: "border-green-200 dark:border-green-800",
    error: "border-red-200 dark:border-red-800",
    warning: "border-yellow-200 dark:border-yellow-800",
    info: "border-blue-200 dark:border-blue-800",
  };

  const textColors = {
    success: "text-green-900 dark:text-green-200",
    error: "text-red-900 dark:text-red-200",
    warning: "text-yellow-900 dark:text-yellow-200",
    info: "text-blue-900 dark:text-blue-200",
  };

  const descriptionColors = {
    success: "text-green-800 dark:text-green-300",
    error: "text-red-800 dark:text-red-300",
    warning: "text-yellow-800 dark:text-yellow-300",
    info: "text-blue-800 dark:text-blue-300",
  };

  return (
    <div
      className={cn(
        "p-4 border rounded-lg flex items-start justify-between gap-4",
        bgColors[type],
        borderColors[type],
      )}
    >
      <div className="flex flex-col gap-1">
        {title && (
          <h4 className={cn("font-semibold text-sm", textColors[type])}>
            {title}
          </h4>
        )}
        <p className={cn("text-sm", descriptionColors[type])}>{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          ✕
        </button>
      )}
    </div>
  );
}

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
