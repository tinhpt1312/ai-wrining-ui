"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const glassCardVariants = cva(
  "rounded-xl border transition-all duration-200",
  {
    variants: {
      variant: {
        default: "glass-card",
        subtle: "glass-card-subtle",
        solid: "bg-surface border-border shadow-sm",
      },
      padding: {
        none: "",
        sm: "p-4",
        md: "p-5 sm:p-6",
        lg: "p-6 sm:p-8",
      },
      hover: {
        true: "glass-card-hover",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "none",
      hover: false,
    },
  },
);

export interface GlassCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof glassCardVariants> {}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant, padding, hover, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(glassCardVariants({ variant, padding, hover }), className)}
      {...props}
    />
  ),
);
GlassCard.displayName = "GlassCard";

export { GlassCard, glassCardVariants };
