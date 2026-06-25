import type { AnalysisFeedback, FeedbackCriterion } from "@/types/api";
import { extractAnalysisFeedback } from "./feedback.utils";

const CRITERIA_KEYS: (keyof AnalysisFeedback)[] = [
  "structure",
  "clarity",
  "tone",
  "coherence",
];

function isCriterion(value: unknown): value is FeedbackCriterion {
  return (
    typeof value === "object" &&
    value !== null &&
    "score" in value &&
    typeof (value as FeedbackCriterion).score === "number"
  );
}

export function getOverallAnalysisScore(
  feedback: Record<string, unknown> | null | undefined,
): number | null {
  const data = extractAnalysisFeedback(feedback);
  const scores = CRITERIA_KEYS.map((key) => data[key])
    .filter(isCriterion)
    .map((c) => c.score);

  if (scores.length === 0) return null;
  const avg = scores.reduce((sum, s) => sum + s, 0) / scores.length;
  return Math.round(avg * 10) / 10;
}

export function scoreTextColor(score: number) {
  if (score >= 8) return "text-success";
  if (score >= 5) return "text-warning";
  return "text-error";
}

export function scoreBgColor(score: number) {
  if (score >= 8) return "bg-success";
  if (score >= 5) return "bg-warning";
  return "bg-error";
}

export function scoreRingColor(score: number) {
  if (score >= 8) return "border-success/30 text-success";
  if (score >= 5) return "border-warning/30 text-warning";
  return "border-error/30 text-error";
}

export { CRITERIA_KEYS, isCriterion };
