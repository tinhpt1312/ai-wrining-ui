"use client";

import { useMemo, useState } from "react";
import {
  useSuggestionsByWriting,
  useSuggestionStats,
  useGenerateSuggestions,
  useApplySuggestion,
  useRefactoredWriting,
} from "../hooks/useSuggestionsApi";
import { Alert, EmptyState, Loading } from "@/components";
import { Button } from "@/components/button";
import { Badge, type BadgeVariant } from "@/components/badge";
import { Select } from "@/components/select";
import { cn } from "@/lib/utils";
import { formatDateTime, getErrorMessage } from "@/utils/helpers";
import * as types from "@/types/api";

interface WritingSuggestionsProps {
  writingId: string;
}

type ApplyMode = "mark" | "update";

const focusAreaOptions = [
  { value: "grammar", label: "Ngữ pháp" },
  { value: "clarity", label: "Rõ ràng" },
  { value: "style", label: "Văn phong" },
  { value: "vocabulary", label: "Từ vựng" },
  { value: "punctuation", label: "Dấu câu" },
  { value: "tone", label: "Giọng điệu" },
];

const suggestionTypeLabels: Record<string, string> = {
  grammar: "Ngữ pháp",
  clarity: "Rõ ràng",
  style: "Văn phong",
  vocabulary: "Từ vựng",
  punctuation: "Dấu câu",
  tone: "Giọng điệu",
};

const severityLabels: Record<string, string> = {
  error: "Nghiêm trọng",
  warning: "Cảnh báo",
  suggestion: "Gợi ý",
  info: "Thông tin",
};

const severityVariant: Record<string, BadgeVariant> = {
  error: "error",
  warning: "warning",
  suggestion: "info",
  info: "neutral",
};

const severityMeter: Record<string, string> = {
  error: "bg-error",
  warning: "bg-warning",
  suggestion: "bg-info",
  info: "bg-subtle",
};

function normalizeValue(value?: string) {
  return value?.trim().toLowerCase() || "info";
}

function toLabel(value: string) {
  const normalized = normalizeValue(value);
  return (
    suggestionTypeLabels[normalized] ||
    severityLabels[normalized] ||
    normalized
  );
}

function getSeverityVariant(severity?: string): BadgeVariant {
  return severityVariant[normalizeValue(severity)] || "neutral";
}

function getConfidencePercent(score?: number) {
  const safeScore = Number.isFinite(score) ? score || 0 : 0;
  return Math.round(Math.min(Math.max(safeScore, 0), 1) * 100);
}

function buildStatsFromSuggestions(
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

function StatCard({
  label,
  value,
  valueClass,
}: {
  label: string;
  value: number;
  valueClass?: string;
}) {
  return (
    <div className="bg-surface border border-border rounded-xl p-4">
      <p className="text-sm font-medium text-muted">{label}</p>
      <p className={cn("mt-2 text-3xl font-semibold text-fg", valueClass)}>
        {value}
      </p>
    </div>
  );
}

export default function WritingSuggestions({
  writingId,
}: WritingSuggestionsProps) {
  const [focusAreas, setFocusAreas] = useState<string[]>([
    "grammar",
    "clarity",
    "style",
  ]);
  const [severityFilter, setSeverityFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("open");
  const [showRefactored, setShowRefactored] = useState(false);
  const [mutationError, setMutationError] = useState<string | null>(null);
  const [mutationSuccess, setMutationSuccess] = useState<string | null>(null);
  const [applyingSuggestionId, setApplyingSuggestionId] = useState<
    string | null
  >(null);
  const [applyingMode, setApplyingMode] = useState<ApplyMode | null>(null);

  const {
    data: suggestionsData,
    isLoading: isSuggestionsLoading,
    error: suggestionsError,
  } = useSuggestionsByWriting(writingId);

  const { data: stats, error: statsError } = useSuggestionStats(writingId);
  const generateSuggestions = useGenerateSuggestions();
  const applySuggestion = useApplySuggestion();

  const suggestions = useMemo(
    () => suggestionsData?.data || [],
    [suggestionsData?.data],
  );
  const fallbackStats = useMemo(
    () => buildStatsFromSuggestions(suggestions),
    [suggestions],
  );
  const statsView = stats || fallbackStats;
  const appliedCount = statsView.appliedCount;
  const openCount = Math.max(statsView.totalSuggestions - appliedCount, 0);
  const canPreviewRefactored = appliedCount > 0;

  const {
    data: refactoredWriting,
    isLoading: isRefactoredLoading,
    error: refactoredError,
  } = useRefactoredWriting(writingId, showRefactored && canPreviewRefactored);

  const typeOptions = useMemo(
    () =>
      Array.from(
        new Set(suggestions.map((s) => normalizeValue(s.type))),
      ).sort(),
    [suggestions],
  );

  const severityOptions = useMemo(
    () =>
      Array.from(
        new Set(suggestions.map((s) => normalizeValue(s.severity))),
      ).sort(),
    [suggestions],
  );

  const filteredSuggestions = useMemo(() => {
    return suggestions.filter((suggestion) => {
      const severity = normalizeValue(suggestion.severity);
      const type = normalizeValue(suggestion.type);
      const matchesSeverity =
        severityFilter === "all" || severity === severityFilter;
      const matchesType = typeFilter === "all" || type === typeFilter;
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "applied" && suggestion.isApplied) ||
        (statusFilter === "open" && !suggestion.isApplied);

      return matchesSeverity && matchesType && matchesStatus;
    });
  }, [severityFilter, statusFilter, suggestions, typeFilter]);

  const highConfidenceCount = useMemo(
    () =>
      suggestions.filter(
        (s) => getConfidencePercent(s.confidenceScore) >= 80,
      ).length,
    [suggestions],
  );

  const hasActiveFilters =
    severityFilter !== "all" || typeFilter !== "all" || statusFilter !== "all";

  const toggleFocusArea = (value: string) => {
    setFocusAreas((current) =>
      current.includes(value)
        ? current.filter((area) => area !== value)
        : [...current, value],
    );
  };

  const resetFilters = () => {
    setSeverityFilter("all");
    setTypeFilter("all");
    setStatusFilter("all");
  };

  const handleGenerateSuggestions = async () => {
    try {
      setMutationError(null);
      setMutationSuccess(null);
      setShowRefactored(false);

      const response = await generateSuggestions.mutateAsync({
        writingId,
        focusAreas: focusAreas.length > 0 ? focusAreas : undefined,
      });
      const count = response.data.length;

      setStatusFilter("open");
      setMutationSuccess(
        count === 1
          ? "Đã tạo 1 gợi ý."
          : `Đã tạo ${count} gợi ý.`,
      );
    } catch (error) {
      setMutationError(getErrorMessage(error));
    }
  };

  const handleApplySuggestion = async (
    suggestion: types.WritingSuggestion,
    updateWriting: boolean,
  ) => {
    try {
      setMutationError(null);
      setMutationSuccess(null);
      setApplyingSuggestionId(suggestion.id);
      setApplyingMode(updateWriting ? "update" : "mark");

      await applySuggestion.mutateAsync({
        suggestionId: suggestion.id,
        writingId,
        updateWriting,
      });

      setMutationSuccess(
        updateWriting
          ? "Đã áp dụng gợi ý vào bài viết."
          : "Đã đánh dấu gợi ý là đã áp dụng.",
      );
    } catch (error) {
      setMutationError(getErrorMessage(error));
    } finally {
      setApplyingSuggestionId(null);
      setApplyingMode(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <section className="bg-surface border border-border rounded-xl p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2 className="text-lg font-bold text-fg tracking-tight">
              Gợi ý sửa bài AI
            </h2>
            <p className="mt-1 text-sm text-muted">
              Xem các chỉnh sửa cụ thể, theo dõi thay đổi đã áp dụng và chạy lại
              AI khi bạn cập nhật bản nháp.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              variant="outline"
              onClick={() => setShowRefactored((current) => !current)}
              disabled={!canPreviewRefactored}
            >
              {showRefactored ? "Ẩn xem trước" : "Xem trước đã áp dụng"}
            </Button>
            <Button
              onClick={handleGenerateSuggestions}
              isLoading={generateSuggestions.isPending}
              disabled={generateSuggestions.isPending}
            >
              {generateSuggestions.isPending ? "Đang phân tích..." : "Phân tích"}
            </Button>
          </div>
        </div>

        <div className="mt-5">
          <p className="mb-2 text-sm font-medium text-fg">Lĩnh vực tập trung</p>
          <div className="flex flex-wrap gap-2">
            {focusAreaOptions.map((area) => {
              const active = focusAreas.includes(area.value);
              return (
                <button
                  key={area.value}
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggleFocusArea(area.value)}
                  className={cn(
                    "h-9 rounded-lg border px-3 text-sm font-medium transition-colors",
                    active
                      ? "border-primary bg-primary text-primary-fg"
                      : "border-border bg-surface text-muted hover:border-border-strong hover:text-fg",
                  )}
                >
                  {area.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Tổng" value={statsView.totalSuggestions} />
        <StatCard label="Chưa áp dụng" value={openCount} valueClass="text-warning" />
        <StatCard
          label="Đã áp dụng"
          value={appliedCount}
          valueClass="text-success"
        />
        <StatCard
          label="Độ tin cậy cao"
          value={highConfidenceCount}
          valueClass="text-primary"
        />
      </div>

      {/* Filters */}
      <section className="bg-surface border border-border rounded-xl p-5">
        <div className="grid gap-4 md:grid-cols-4">
          <Select
            label="Trạng thái"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            options={[
              { value: "all", label: "Tất cả" },
              { value: "open", label: "Chưa áp dụng" },
              { value: "applied", label: "Đã áp dụng" },
            ]}
          />
          <Select
            label="Loại"
            value={typeFilter}
            onChange={(event) => setTypeFilter(event.target.value)}
            options={[
              { value: "all", label: "Tất cả loại" },
              ...typeOptions.map((type) => ({
                value: type,
                label: toLabel(type),
              })),
            ]}
          />
          <Select
            label="Mức độ"
            value={severityFilter}
            onChange={(event) => setSeverityFilter(event.target.value)}
            options={[
              { value: "all", label: "Tất cả mức độ" },
              ...severityOptions.map((severity) => ({
                value: severity,
                label: toLabel(severity),
              })),
            ]}
          />
          <div className="flex items-end">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={resetFilters}
              disabled={!hasActiveFilters}
            >
              Xóa bộ lọc
            </Button>
          </div>
        </div>
      </section>

      {mutationError && (
        <Alert
          type="error"
          title="Thao tác gợi ý thất bại"
          message={mutationError}
          onClose={() => setMutationError(null)}
        />
      )}

      {mutationSuccess && (
        <Alert
          type="success"
          title="Đã cập nhật"
          message={mutationSuccess}
          onClose={() => setMutationSuccess(null)}
        />
      )}

      {suggestionsError && (
        <Alert
          type="error"
          title="Không tải được gợi ý"
          message={getErrorMessage(suggestionsError)}
        />
      )}

      {statsError && !stats && suggestions.length > 0 && (
        <Alert
          type="warning"
          title="Không có thống kê"
          message={getErrorMessage(statsError)}
        />
      )}

      {/* Applied preview */}
      {showRefactored && canPreviewRefactored && (
        <section className="bg-surface border border-border rounded-xl p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-semibold text-fg">Xem trước đã áp dụng</h3>
            <span className="text-sm text-muted">{appliedCount} đã áp dụng</span>
          </div>

          {isRefactoredLoading ? (
            <Loading text="Đang tải xem trước..." />
          ) : refactoredError ? (
            <Alert
              type="error"
              title="Không tải được xem trước"
              message={getErrorMessage(refactoredError)}
            />
          ) : refactoredWriting ? (
            <div className="grid gap-4 lg:grid-cols-2">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-subtle">
                  Bản gốc
                </p>
                <pre className="max-h-96 overflow-auto whitespace-pre-wrap break-words rounded-lg border border-border bg-surface-2 p-4 text-sm leading-6 text-muted">
                  {refactoredWriting.original}
                </pre>
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-success">
                  Đã chỉnh sửa
                </p>
                <pre className="max-h-96 overflow-auto whitespace-pre-wrap break-words rounded-lg border border-success/20 bg-success-soft p-4 text-sm leading-6 text-fg">
                  {refactoredWriting.refactored}
                </pre>
              </div>
            </div>
          ) : null}
        </section>
      )}

      {/* Suggestions list */}
      {isSuggestionsLoading && suggestions.length === 0 ? (
        <section className="bg-surface border border-border rounded-xl p-8">
          <Loading text="Đang tải gợi ý..." />
        </section>
      ) : suggestions.length === 0 ? (
        <section className="bg-surface border border-border rounded-xl">
          <EmptyState
            icon="💡"
            title="Chưa có gợi ý"
            description="Chạy phân tích AI để nhận các gợi ý cải thiện cụ thể cho bài viết này."
            action={{
              label: generateSuggestions.isPending
                ? "Đang phân tích..."
                : "Tạo gợi ý",
              onClick: handleGenerateSuggestions,
            }}
          />
        </section>
      ) : filteredSuggestions.length === 0 ? (
        <section className="bg-surface border border-border rounded-xl">
          <EmptyState
            icon="🔍"
            title="Không có gợi ý phù hợp"
            description="Hãy điều chỉnh bộ lọc để xem thêm gợi ý."
            action={{ label: "Xóa bộ lọc", onClick: resetFilters }}
          />
        </section>
      ) : (
        <div className="space-y-4">
          {filteredSuggestions.map((suggestion) => {
            const severity = normalizeValue(suggestion.severity);
            const confidencePercent = getConfidencePercent(
              suggestion.confidenceScore,
            );
            const isApplyingThis = applyingSuggestionId === suggestion.id;

            return (
              <article
                key={suggestion.id}
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
                      <Badge
                        variant={suggestion.isApplied ? "success" : "neutral"}
                      >
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
                    <p className="text-sm leading-6 text-muted">
                      {suggestion.explanation}
                    </p>
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
                        onClick={() => handleApplySuggestion(suggestion, false)}
                        isLoading={isApplyingThis && applyingMode === "mark"}
                        disabled={applySuggestion.isPending}
                      >
                        Đánh dấu đã áp dụng
                      </Button>
                      {suggestion.position && (
                        <Button
                          size="sm"
                          onClick={() =>
                            handleApplySuggestion(suggestion, true)
                          }
                          isLoading={
                            isApplyingThis && applyingMode === "update"
                          }
                          disabled={applySuggestion.isPending}
                        >
                          Áp dụng vào bài viết
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
