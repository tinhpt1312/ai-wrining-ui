/**
 * Design System Theme Tokens
 * Centralized color, spacing, and typography values
 */

export const THEME = {
  // Color Palette
  colors: {
    // Primary - Indigo
    primary: {
      50: "hsl(220 100% 96%)",
      100: "hsl(220 98% 91%)",
      200: "hsl(220 95% 84%)",
      300: "hsl(220 94% 71%)",
      400: "hsl(220 91% 55%)",
      500: "hsl(220 90% 50%)",
      600: "hsl(220 85% 45%)",
      700: "hsl(220 80% 38%)",
      800: "hsl(220 75% 32%)",
      900: "hsl(220 70% 25%)",
    },
    // Secondary - Slate
    secondary: {
      50: "hsl(215 28% 97%)",
      100: "hsl(215 16% 92%)",
      200: "hsl(215 14% 86%)",
      300: "hsl(215 13% 74%)",
      400: "hsl(215 12% 59%)",
      500: "hsl(215 11% 50%)",
      600: "hsl(215 12% 42%)",
      700: "hsl(215 13% 34%)",
      800: "hsl(215 14% 26%)",
      900: "hsl(215 16% 16%)",
    },
    // Accent - Cyan
    accent: {
      50: "hsl(188 94% 95%)",
      100: "hsl(188 93% 88%)",
      200: "hsl(188 88% 78%)",
      300: "hsl(188 83% 62%)",
      400: "hsl(188 77% 48%)",
      500: "hsl(188 74% 41%)",
      600: "hsl(188 73% 35%)",
      700: "hsl(188 70% 29%)",
      800: "hsl(188 67% 23%)",
      900: "hsl(188 63% 18%)",
    },
    // Status
    success: "hsl(142 76% 36%)",
    warning: "hsl(38 92% 50%)",
    error: "hsl(0 84% 60%)",
    info: "hsl(217 91% 60%)",
    // Background & Text
    light: "hsl(0 0% 100%)",
    dark: "hsl(0 0% 10%)",
  },

  // Spacing Scale (4px base)
  spacing: {
    xs: "0.25rem", // 4px
    sm: "0.5rem", // 8px
    md: "1rem", // 16px
    lg: "1.5rem", // 24px
    xl: "2rem", // 32px
    "2xl": "3rem", // 48px
    "3xl": "4rem", // 64px
  },

  // Typography Scale
  fontSize: {
    xs: "0.75rem", // 12px - small labels, captions
    sm: "0.875rem", // 14px - secondary text
    base: "1rem", // 16px - body text
    lg: "1.125rem", // 18px - subheadings
    xl: "1.25rem", // 20px - headings
    "2xl": "1.5rem", // 24px - section headings
    "3xl": "1.875rem", // 30px - page headings
    "4xl": "2.25rem", // 36px - display text
  },

  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  // Border Radius
  borderRadius: {
    xs: "0.25rem", // 4px
    sm: "0.375rem", // 6px
    md: "0.5rem", // 8px
    lg: "0.75rem", // 12px
    xl: "1rem", // 16px
    "2xl": "1.5rem", // 24px
    full: "9999px",
  },

  // Shadows
  shadow: {
    xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    sm: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
    "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
  },

  // Transitions
  transition: {
    fast: "150ms",
    base: "200ms",
    slow: "300ms",
  },

  // Breakpoints
  breakpoints: {
    xs: "320px",
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },
} as const;

// Button size presets
export const BUTTON_SIZES = {
  sm: {
    height: "2rem", // 32px
    padding: "0.5rem 0.75rem",
    fontSize: "0.875rem",
    gap: "0.5rem",
  },
  md: {
    height: "2.5rem", // 40px
    padding: "0.625rem 1rem",
    fontSize: "1rem",
    gap: "0.625rem",
  },
  lg: {
    height: "3rem", // 48px
    padding: "0.75rem 1.5rem",
    fontSize: "1.125rem",
    gap: "0.75rem",
  },
} as const;

// Input/Form size presets
export const INPUT_SIZES = {
  sm: {
    height: "2rem", // 32px
    padding: "0.5rem 0.75rem",
    fontSize: "0.875rem",
  },
  md: {
    height: "2.5rem", // 40px
    padding: "0.625rem 1rem",
    fontSize: "1rem",
  },
  lg: {
    height: "3rem", // 48px
    padding: "0.75rem 1.5rem",
    fontSize: "1.125rem",
  },
} as const;

// Z-index scale
export const Z_INDEX = {
  hide: -1,
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modal_backdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
} as const;
