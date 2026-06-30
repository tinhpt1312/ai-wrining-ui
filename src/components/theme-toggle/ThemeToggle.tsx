"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Monitor, Moon, Sun } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { cn } from "@/lib/utils";
import { THEME_OPTIONS, type ThemeOption } from "@/constants/theme-ui.constants";
import { componentMessages } from "@/messages/components";

const themeIcons: Record<ThemeOption, typeof Sun> = {
  light: Sun,
  dark: Moon,
  system: Monitor,
};

const themeLabels: Record<ThemeOption, string> = {
  light: componentMessages.theme.light,
  dark: componentMessages.theme.dark,
  system: componentMessages.theme.system,
};

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const current = (theme ?? "system") as ThemeOption;
  const PreviewIcon =
    !mounted || current === "system"
      ? Monitor
      : resolvedTheme === "dark"
        ? Moon
        : Sun;

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className={cn(
            "inline-flex h-9 w-9 items-center justify-center rounded-lg",
            "border border-border bg-surface text-muted",
            "hover:bg-surface-2 hover:text-fg transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
            className,
          )}
          aria-label={componentMessages.theme.toggleAria}
        >
          <PreviewIcon className="h-4 w-4" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className={cn(
            "z-50 min-w-[10rem] overflow-hidden rounded-xl border border-border",
            "bg-surface p-1 shadow-lg animate-in fade-in-0 zoom-in-95",
          )}
        >
          {THEME_OPTIONS.map((option) => {
            const Icon = themeIcons[option.value];
            const active = current === option.value;

            return (
              <DropdownMenu.Item
                key={option.value}
                className={cn(
                  "flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm outline-none",
                  "text-fg hover:bg-surface-2 focus:bg-surface-2",
                  active && "bg-primary-soft text-primary font-medium",
                )}
                onSelect={() => setTheme(option.value)}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {themeLabels[option.value]}
              </DropdownMenu.Item>
            );
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
