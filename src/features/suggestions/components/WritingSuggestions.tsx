"use client";

import { useMemo, useState } from "react";
import {
  useSuggestionsByWriting,
  useSuggestionStats,
  useGenerateSuggestions,
  useApplySuggestion,
  useRefactoredWriting,
} from "../hooks/useSuggestionsApi";
import { Alert } from "@/components/alert";
import { EmptyState } from "@/components/empty-state";
import { Loading } from "@/components/loading";
import { Button } from "@/components/button";
import { Select } from "@/components/select";
import { cn } from "@/lib/utils";
import { getErrorMessage } from "@/utils/helpers";
import * as types from "@/types/api";
import { SuggestionCard } from "./SuggestionCard";
import { SuggestionStatCard } from "./SuggestionStatCard";
import {
  buildStatsFromSuggestions,
  focusAreaOptions,
  getConfidencePercent,
  normalizeValue,
  toLabel,
} from "../utils/suggestion.utils";

interface WritingSuggestionsProps {
  writingId: string;
}

type ApplyMode = "mark" | "update";

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
        count === 1 ? "Đã tạo 1 gợi ý." : `Đã tạo ${count} gợi ý.`,
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

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <SuggestionStatCard label="Tổng" value={statsView.totalSuggestions} />
        <SuggestionStatCard
          label="Chưa áp dụng"
          value={openCount}
          valueClass="text-warning"
        />
        <SuggestionStatCard
          label="Đã áp dụng"
          value={appliedCount}
          valueClass="text-success"
        />
        <SuggestionStatCard
          label="Độ tin cậy cao"
          value={highConfidenceCount}
          valueClass="text-primary"
        />
      </div>

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
          {filteredSuggestions.map((suggestion) => (
            <SuggestionCard
              key={suggestion.id}
              suggestion={suggestion}
              isApplying={applyingSuggestionId === suggestion.id}
              applyingMode={applyingMode}
              isApplyPending={applySuggestion.isPending}
              onApply={handleApplySuggestion}
            />
          ))}
        </div>
      )}
    </div>
  );
}
