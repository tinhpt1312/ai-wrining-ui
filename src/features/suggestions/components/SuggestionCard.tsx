import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { cn } from "@/lib/utils";
import { formatDateTime } from "@/utils/helpers";
import * as types from "@/types/api";
import {
  getConfidencePercent,
  getSeverityVariant,
  normalizeValue,
  severityMeter,
  toLabel,
} from "../utils/suggestion.utils";

type ApplyMode = "mark" | "update";

interface SuggestionCardProps {
  suggestion: types.WritingSuggestion;
  isApplying: boolean;
  applyingMode: ApplyMode | null;
  isApplyPending: boolean;
  onApply: (suggestion: types.WritingSuggestion, updateWriting: boolean) => void;
}

export function SuggestionCard({
  suggestion,
  isApplying,
  applyingMode,
  isApplyPending,
  onApply,
}: SuggestionCardProps) {
  const severity = normalizeValue(suggestion.severity);
  const confidencePercent = getConfidencePercent(suggestion.confidenceScore);

  return (
    <article
      className={cn(
        "bg-surface border border-border rounded-xl p-5",
        suggestion.isApplied && "opacity-75",
      )}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="neutral">
              {toLabel(normalizeValue(suggestion.type))}
            </Badge>
            <Badge variant={getSeverityVariant(severity)}>
              {toLabel(severity)}
            </Badge>
            <Badge variant={suggestion.isApplied ? "success" : "neutral"}>
              {suggestion.isApplied ? "Đã áp dụng" : "Chưa áp dụng"}
            </Badge>
          </div>
          <p className="mt-3 text-xs text-subtle">
            Tạo lúc {formatDateTime(suggestion.createdAt)}
          </p>
        </div>

        <div className="w-full lg:w-56">
          <div className="mb-1.5 flex justify-between text-xs font-medium text-muted">
            <span>Độ tin cậy</span>
            <span>{confidencePercent}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-surface-2 overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all",
                severityMeter[severity] || "bg-subtle",
              )}
              style={{ width: `${confidencePercent}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-surface-2 p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-subtle">
            Bản gốc
          </p>
          <p className="whitespace-pre-wrap break-words text-sm leading-6 text-fg/90">
            {suggestion.originalText || "Không có văn bản gốc."}
          </p>
        </div>
        <div className="rounded-lg border border-success/20 bg-success-soft p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-success">
            Gợi ý
          </p>
          <p className="whitespace-pre-wrap break-words text-sm leading-6 text-fg/90">
            {suggestion.suggestedText || "Không có văn bản gợi ý."}
          </p>
        </div>
      </div>

      {suggestion.explanation && (
        <div className="mt-4 rounded-lg bg-surface-2 p-4">
          <p className="text-sm leading-6 text-muted">{suggestion.explanation}</p>
        </div>
      )}

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-xs text-subtle">
          {suggestion.position
            ? `Vị trí ${suggestion.position.start}-${suggestion.position.end}`
            : "Không xác định được vị trí"}
        </div>

        {!suggestion.isApplied && (
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onApply(suggestion, false)}
              isLoading={isApplying && applyingMode === "mark"}
              disabled={isApplyPending}
            >
              Đánh dấu đã áp dụng
            </Button>
            {suggestion.position && (
              <Button
                size="sm"
                onClick={() => onApply(suggestion, true)}
                isLoading={isApplying && applyingMode === "update"}
                disabled={isApplyPending}
              >
                Áp dụng vào bài viết
              </Button>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
