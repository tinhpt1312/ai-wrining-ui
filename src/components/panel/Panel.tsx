import * as React from "react";
import { cn } from "@/lib/utils";

interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  padding?: "sm" | "md" | "lg";
}

const panelPadding = {
  sm: "p-4",
  md: "p-5",
  lg: "p-6 sm:p-8",
};

export function Panel({
  children,
  className,
  padding = "md",
  ...props
}: PanelProps) {
  return (
    <div
      className={cn("card-elevated", panelPadding[padding], className)}
      {...props}
    >
      {children}
    </div>
  );
}
