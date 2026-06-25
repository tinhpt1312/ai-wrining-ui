import type { BadgeVariant } from "@/components/badge";
import * as types from "@/types/api";

export const focusAreaOptions = [
  { value: "grammar", label: "Ngữ pháp" },
  { value: "clarity", label: "Rõ ràng" },
  { value: "style", label: "Văn phong" },
  { value: "vocabulary", label: "Từ vựng" },
  { value: "punctuation", label: "Dấu câu" },
  { value: "tone", label: "Giọng điệu" },
];

export const suggestionTypeLabels: Record<string, string> = {
  grammar: "Ngữ pháp",
  clarity: "Rõ ràng",
  style: "Văn phong",
  vocabulary: "Từ vựng",
  punctuation: "Dấu câu",
  tone: "Giọng điệu",
};

export const severityLabels: Record<string, string> = {
  error: "Nghiêm trọng",
  warning: "Cảnh báo",
  suggestion: "Gợi ý",
  info: "Thông tin",
};

export const severityVariant: Record<string, BadgeVariant> = {
  error: "error",
  warning: "warning",
  suggestion: "info",
  info: "neutral",
};

export const severityMeter: Record<string, string> = {
  error: "bg-error",
  warning: "bg-warning",
  suggestion: "bg-info",
  info: "bg-subtle",
};

export function normalizeValue(value?: string) {
  return value?.trim().toLowerCase() || "info";
}

export function toLabel(value: string) {
  const normalized = normalizeValue(value);
  return (
    suggestionTypeLabels[normalized] ||
    severityLabels[normalized] ||
    normalized
  );
}

export function getSeverityVariant(severity?: string): BadgeVariant {
  return severityVariant[normalizeValue(severity)] || "neutral";
}

export function getConfidencePercent(score?: number) {
  const safeScore = Number.isFinite(score) ? score || 0 : 0;
  return Math.round(Math.min(Math.max(safeScore, 0), 1) * 100);
}

export function buildStatsFromSuggestions(
  suggestions: types.WritingSuggestion[],
): types.WritingSuggestionStats {
  const byType: Record<string, number> = {};
  const bySeverity: Record<string, number> = {};
  const appliedCount = suggestions.filter((s) => s.isApplied).length;

  suggestions.forEach((suggestion) => {
    const type = normalizeValue(suggestion.type);
    const severity = normalizeValue(suggestion.severity);
    byType[type] = (byType[type] || 0) + 1;
    bySeverity[severity] = (bySeverity[severity] || 0) + 1;
  });

  return {
    totalSuggestions: suggestions.length,
    appliedCount,
    appliedPercentage:
      suggestions.length > 0
        ? Math.round((appliedCount / suggestions.length) * 100)
        : 0,
    byType,
    bySeverity,
  };
}
