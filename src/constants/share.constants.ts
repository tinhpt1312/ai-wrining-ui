export const APP_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
} as const;

export const FACEBOOK_SHARE = {
  BASE_URL: "https://www.facebook.com/sharer/sharer.php",
} as const;
