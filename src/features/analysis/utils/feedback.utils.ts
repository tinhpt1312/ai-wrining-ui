import type { AnalysisFeedback } from "@/types/api";

export function extractAnalysisFeedback(
  feedback: Record<string, unknown> | null | undefined,
): AnalysisFeedback {
  if (!feedback) return {};
  const nested = feedback.aiAnalytics;
  if (nested && typeof nested === "object") {
    return nested as AnalysisFeedback;
  }
  return feedback as AnalysisFeedback;
}

export function getAnalysisSummary(
  feedback: Record<string, unknown> | null | undefined,
): string | undefined {
  return extractAnalysisFeedback(feedback).overallFeedback;
}
