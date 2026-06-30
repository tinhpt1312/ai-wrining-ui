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
import { suggestionsMessages } from "@/messages/suggestions";
import { commonMessages } from "@/messages/common";
import { msg } from "@/messages/format";

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
        count === 1
          ? suggestionsMessages.toast.createdOne
          : msg(suggestionsMessages.toast.createdMany, { count }),
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
          ? suggestionsMessages.toast.appliedToWriting
          : suggestionsMessages.toast.markedApplied,
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
              {suggestionsMessages.title}
            </h2>
            <p className="mt-1 text-sm text-muted">
              {suggestionsMessages.description}
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              variant="outline"
              onClick={() => setShowRefactored((current) => !current)}
              disabled={!canPreviewRefactored}
            >
              {showRefactored
                ? suggestionsMessages.preview.hide
                : suggestionsMessages.preview.show}
            </Button>
            <Button
              onClick={handleGenerateSuggestions}
              isLoading={generateSuggestions.isPending}
              disabled={generateSuggestions.isPending}
            >
              {generateSuggestions.isPending
                ? suggestionsMessages.analyze.loading
                : suggestionsMessages.analyze.label}
            </Button>
          </div>
        </div>

        <div className="mt-5">
          <p className="mb-2 text-sm font-medium text-fg">
            {suggestionsMessages.focusAreas}
          </p>
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
        <SuggestionStatCard
          label={suggestionsMessages.stats.total}
          value={statsView.totalSuggestions}
        />
        <SuggestionStatCard
          label={suggestionsMessages.stats.open}
          value={openCount}
          valueClass="text-warning"
        />
        <SuggestionStatCard
          label={suggestionsMessages.stats.applied}
          value={appliedCount}
          valueClass="text-success"
        />
        <SuggestionStatCard
          label={suggestionsMessages.stats.highConfidence}
          value={highConfidenceCount}
          valueClass="text-primary"
        />
      </div>

      <section className="bg-surface border border-border rounded-xl p-5">
        <div className="grid gap-4 md:grid-cols-4">
          <Select
            label={suggestionsMessages.filters.status}
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            options={[
              { value: "all", label: commonMessages.filter.all },
              { value: "open", label: suggestionsMessages.status.open },
              { value: "applied", label: suggestionsMessages.status.applied },
            ]}
          />
          <Select
            label={suggestionsMessages.filters.type}
            value={typeFilter}
            onChange={(event) => setTypeFilter(event.target.value)}
            options={[
              { value: "all", label: commonMessages.filter.allTypes },
              ...typeOptions.map((type) => ({
                value: type,
                label: toLabel(type),
              })),
            ]}
          />
          <Select
            label={suggestionsMessages.filters.severity}
            value={severityFilter}
            onChange={(event) => setSeverityFilter(event.target.value)}
            options={[
              { value: "all", label: suggestionsMessages.filters.allSeverity },
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
              {suggestionsMessages.filters.clear}
            </Button>
          </div>
        </div>
      </section>

      {mutationError && (
        <Alert
          type="error"
          title={suggestionsMessages.alert.mutationFailed}
          message={mutationError}
          onClose={() => setMutationError(null)}
        />
      )}

      {mutationSuccess && (
        <Alert
          type="success"
          title={suggestionsMessages.alert.updated}
          message={mutationSuccess}
          onClose={() => setMutationSuccess(null)}
        />
      )}

      {suggestionsError && (
        <Alert
          type="error"
          title={suggestionsMessages.alert.loadFailed}
          message={getErrorMessage(suggestionsError)}
        />
      )}

      {statsError && !stats && suggestions.length > 0 && (
        <Alert
          type="warning"
          title={suggestionsMessages.alert.noStats}
          message={getErrorMessage(statsError)}
        />
      )}

      {showRefactored && canPreviewRefactored && (
        <section className="bg-surface border border-border rounded-xl p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-semibold text-fg">
              {suggestionsMessages.preview.title}
            </h3>
            <span className="text-sm text-muted">
              {msg(suggestionsMessages.preview.appliedCount, {
                count: appliedCount,
              })}
            </span>
          </div>

          {isRefactoredLoading ? (
            <Loading text={suggestionsMessages.preview.loading} />
          ) : refactoredError ? (
            <Alert
              type="error"
              title={suggestionsMessages.preview.loadFailed}
              message={getErrorMessage(refactoredError)}
            />
          ) : refactoredWriting ? (
            <div className="grid gap-4 lg:grid-cols-2">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-subtle">
                  {suggestionsMessages.preview.original}
                </p>
                <pre className="max-h-96 overflow-auto whitespace-pre-wrap break-words rounded-lg border border-border bg-surface-2 p-4 text-sm leading-6 text-muted">
                  {refactoredWriting.original}
                </pre>
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-success">
                  {suggestionsMessages.preview.refactored}
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
          <Loading text={suggestionsMessages.loading} />
        </section>
      ) : suggestions.length === 0 ? (
        <section className="bg-surface border border-border rounded-xl">
          <EmptyState
            icon="💡"
            title={suggestionsMessages.empty.title}
            description={suggestionsMessages.empty.description}
            action={{
              label: generateSuggestions.isPending
                ? suggestionsMessages.analyze.loading
                : suggestionsMessages.analyze.generate,
              onClick: handleGenerateSuggestions,
            }}
          />
        </section>
      ) : filteredSuggestions.length === 0 ? (
        <section className="bg-surface border border-border rounded-xl">
          <EmptyState
            icon="🔍"
            title={suggestionsMessages.noMatches.title}
            description={suggestionsMessages.noMatches.description}
            action={{
              label: suggestionsMessages.filters.clear,
              onClick: resetFilters,
            }}
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
