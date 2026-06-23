import { APP_CONFIG, FACEBOOK_SHARE, ROUTES } from "@/constants";

export function getAppBaseUrl(): string {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return APP_CONFIG.BASE_URL;
}

export function buildShareWritingUrl(writingId: string): string {
  return `${getAppBaseUrl()}${ROUTES.shareWriting(writingId)}`;
}

export function buildShareAnalysisUrl(analysisId: string): string {
  return `${getAppBaseUrl()}${ROUTES.shareAnalysis(analysisId)}`;
}

export function buildFacebookShareUrl(targetUrl: string): string {
  const params = new URLSearchParams({ u: targetUrl });
  return `${FACEBOOK_SHARE.BASE_URL}?${params.toString()}`;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}…`;
}
