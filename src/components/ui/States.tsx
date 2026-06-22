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
    sm: "w-5 h-5",
    md: "w-7 h-7",
    lg: "w-10 h-10",
  };

  const container = fullScreen ? "min-h-[60vh] flex" : "py-10 flex";

  return (
    <div className={cn(container, "items-center justify-center gap-3")}>
      <svg
        className={cn("animate-spin text-primary", sizeClasses[size])}
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-20"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-90"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      {text && <span className="text-muted text-sm font-medium">{text}</span>}
    </div>
  );
}

interface ErrorProps {
  title?: string;
  message: string;
  retry?: () => void;
}

export function Error({ title = "Something went wrong", message, retry }: ErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8 bg-error-soft border border-error/20 rounded-xl text-center">
      <div className="flex flex-col gap-1.5">
        <h3 className="text-base font-semibold text-error">{title}</h3>
        <p className="text-sm text-muted">{message}</p>
      </div>
      {retry && (
        <button
          onClick={retry}
          className="px-4 h-9 bg-error text-white rounded-lg hover:opacity-90 transition-opacity font-medium text-sm"
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
      {icon && <div className="text-4xl opacity-60">{icon}</div>}
      <div className="flex flex-col gap-1.5">
        <h3 className="text-lg font-semibold text-fg">{title}</h3>
        {description && (
          <p className="text-sm text-muted max-w-md">{description}</p>
        )}
      </div>
      {action && (
        <button
          onClick={action.onClick}
          className="mt-2 px-5 h-10 bg-primary text-primary-fg rounded-lg hover:bg-primary-hover transition-colors font-medium text-sm"
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
  const styles = {
    success: "bg-success-soft border-success/20 text-success",
    error: "bg-error-soft border-error/20 text-error",
    warning: "bg-warning-soft border-warning/20 text-warning",
    info: "bg-info-soft border-info/20 text-info",
  };

  return (
    <div
      className={cn(
        "p-4 border rounded-xl flex items-start justify-between gap-4",
        styles[type],
      )}
    >
      <div className="flex flex-col gap-0.5">
        {title && <h4 className="font-semibold text-sm">{title}</h4>}
        <p className="text-sm opacity-90">{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-current opacity-60 hover:opacity-100 transition-opacity shrink-0"
          aria-label="Dismiss"
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
        "bg-surface border border-border rounded-xl p-6 transition-colors",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
