export const THEME_STORAGE_KEY = "ai-writing-theme";

export const THEME_OPTIONS = [
  { value: "light", label: "Sáng" },
  { value: "dark", label: "Tối" },
  { value: "system", label: "Hệ thống" },
] as const;

export type ThemeOption = (typeof THEME_OPTIONS)[number]["value"];
