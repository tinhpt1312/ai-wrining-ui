"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      className={cn("flex flex-col gap-4", className)}
      {...props}
    />
  );
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      className={cn(
        "flex w-full items-stretch gap-1 rounded-xl border border-border/60 bg-surface/60 backdrop-blur-sm p-1 overflow-x-auto scrollbar-none",
        className,
      )}
      {...props}
    />
  );
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        "inline-flex flex-1 items-center justify-center whitespace-nowrap rounded-lg px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-muted transition-all",
        "hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
        "data-[state=active]:bg-primary/15 data-[state=active]:text-primary data-[state=active]:font-semibold",
        "data-[state=active]:shadow-[0_0_16px_var(--glow-primary)] data-[state=active]:ring-1 data-[state=active]:ring-primary/25",
        className,
      )}
      {...props}
    />
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      className={cn("focus-visible:outline-none animate-in fade-in-0", className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
