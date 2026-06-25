"use client";

import * as React from "react";

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
    <div className="card-elevated flex flex-col items-center justify-center gap-4 p-10 sm:p-12 text-center">
      {icon && <div className="text-muted">{icon}</div>}
      <div className="flex flex-col gap-1.5">
        <h3 className="text-base font-semibold text-fg">{title}</h3>
        {description && (
          <p className="text-sm text-muted max-w-md leading-relaxed">
            {description}
          </p>
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
