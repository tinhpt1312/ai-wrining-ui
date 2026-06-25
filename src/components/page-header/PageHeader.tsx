"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  variant?: "default" | "glass";
}

function PageHeader({
  title,
  description,
  actions,
  className,
  variant = "default",
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 md:flex-row md:items-start md:justify-between",
        variant === "glass" && "page-header-glass p-5 sm:p-6",
        variant === "default" && "pb-1",
        className,
      )}
    >
      <div className="min-w-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-fg tracking-tight">
          {title}
        </h1>
        {description && (
          <div className="text-sm text-muted mt-1.5 leading-relaxed max-w-2xl">
            {description}
          </div>
        )}
      </div>
      {actions && (
        <div className="flex flex-wrap gap-2 shrink-0">{actions}</div>
      )}
    </div>
  );
}

export { PageHeader };
export type { PageHeaderProps };
