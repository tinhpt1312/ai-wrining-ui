"use client";

import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import {
  resolveLayoutWidth,
  LAYOUT_WIDTH_CLASSES,
  type LayoutWidth,
} from "@/lib/layout";
import { cn } from "@/lib/utils";

interface LayoutContextValue {
  width: LayoutWidth;
  widthClassName: string;
}

const LayoutContext = createContext<LayoutContextValue | null>(null);

export function LayoutProvider({
  width: widthOverride,
  children,
}: {
  width?: LayoutWidth;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const width = widthOverride ?? resolveLayoutWidth(pathname);

  const value = useMemo(
    () => ({
      width,
      widthClassName: LAYOUT_WIDTH_CLASSES[width],
    }),
    [width],
  );

  return (
    <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>
  );
}

export function useLayout() {
  const context = useContext(LayoutContext);
  if (!context) {
    return {
      width: "default" as LayoutWidth,
      widthClassName: LAYOUT_WIDTH_CLASSES.default,
    };
  }
  return context;
}

export function LayoutMain({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const { widthClassName } = useLayout();
  return (
    <div className={cn("app-main-inner flex-1", widthClassName, className)}>
      {children}
    </div>
  );
}
