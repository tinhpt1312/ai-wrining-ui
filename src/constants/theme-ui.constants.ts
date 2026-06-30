import { componentMessages } from "@/messages/components";

export const THEME_STORAGE_KEY = "ai-writing-theme";

export const THEME_OPTIONS = [
  { value: "light", label: componentMessages.theme.light },
  { value: "dark", label: componentMessages.theme.dark },
  { value: "system", label: componentMessages.theme.system },
] as const;

export type ThemeOption = (typeof THEME_OPTIONS)[number]["value"];
