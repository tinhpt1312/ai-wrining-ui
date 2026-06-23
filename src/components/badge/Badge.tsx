import * as React from "react";
import { cn } from "@/lib/utils";

const badgeVariants = {
  neutral: "bg-surface-2 text-fg border border-border",
  primary: "bg-primary-soft text-primary border border-primary/15",
  success: "bg-success-soft text-success border border-success/15",
  warning: "bg-warning-soft text-warning border border-warning/15",
  error: "bg-error-soft text-error border border-error/15",
  info: "bg-info-soft text-info border border-info/15",
};

type BadgeVariant = keyof typeof badgeVariants;

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

function Badge({ variant = "neutral", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
        badgeVariants[variant],
        className,
      )}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
export type { BadgeProps, BadgeVariant };
