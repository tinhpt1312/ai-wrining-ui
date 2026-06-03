"use client";

import { useMemo, useState } from "react";
import {
  useSuggestionsByWriting,
  useSuggestionStats,
  useGenerateSuggestions,
  useApplySuggestion,
  useRefactoredWriting,
} from "@/hooks/useApi";
import { Alert, EmptyState, Loading } from "@/components/ui/States";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { formatDateTime, getErrorMessage } from "@/utils/helpers";
import * as types from "@/types/api";

interface WritingSuggestionsProps {
  writingId: string;
}

type ApplyMode = "mark" | "update";

const focusAreaOptions = [
  { value: "grammar", label: "Grammar" },
  { value: "clarity", label: "Clarity" },
  { value: "style", label: "Style" },
  { value: "vocabulary", label: "Vocabulary" },
  { value: "punctuation", label: "Punctuation" },
  { value: "tone", label: "Tone" },
];

const severityStyles: Record<
  string,
  {
    badge: string;
    border: string;
    surface: string;
    meter: string;
  }
> = {
  error: {
    badge: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200",
    border: "border-red-200 dark:border-red-900",
    surface: "bg-red-50/70 dark:bg-red-950/20",
    meter: "bg-red-500",
  },
  warning: {
    badge:
      "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200",
    border: "border-amber-200 dark:border-amber-900",
    surface: "bg-amber-50/70 dark:bg-amber-950/20",
    meter: "bg-amber-500",
  },
  suggestion: {
    badge: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200",
    border: "border-blue-200 dark:border-blue-900",
    surface: "bg-blue-50/70 dark:bg-blue-950/20",
    meter: "bg-blue-500",
  },
  info: {
    badge: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
    border: "border-gray-200 dark:border-gray-800",
    surface: "bg-gray-50 dark:bg-gray-950",
    meter: "bg-gray-500",
  },
};

function normalizeValue(value?: string) {
  return value?.trim().toLowerCase() || "info";
}

function toLabel(value: string) {
  return value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getSeverityStyle(severity?: string) {
  return severityStyles[normalizeValue(severity)] || severityStyles.info;
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
  const appliedCount = suggestions.filter((suggestion) => {
    return suggestion.isApplied;
  }).length;

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

  const suggestions = useMemo(() => {
    return suggestionsData?.data || [];
  }, [suggestionsData?.data]);
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
  } = useRefactoredWriting(
    writingId,
    showRefactored && canPreviewRefactored,
  );

  const typeOptions = useMemo(() => {
    return Array.from(
      new Set(suggestions.map((suggestion) => normalizeValue(suggestion.type))),
    ).sort();
  }, [suggestions]);

  const severityOptions = useMemo(() => {
    return Array.from(
      new Set(
        suggestions.map((suggestion) => normalizeValue(suggestion.severity)),
      ),
    ).sort();
  }, [suggestions]);

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

  const typeEntries = useMemo(() => {
    return Object.entries(statsView.byType).sort((a, b) => b[1] - a[1]);
  }, [statsView.byType]);

  const severityEntries = useMemo(() => {
    return Object.entries(statsView.bySeverity).sort((a, b) => b[1] - a[1]);
  }, [statsView.bySeverity]);

  const highConfidenceCount = useMemo(() => {
    return suggestions.filter((suggestion) => {
      return getConfidencePercent(suggestion.confidenceScore) >= 80;
    }).length;
  }, [suggestions]);

  const hasActiveFilters =
    severityFilter !== "all" || typeFilter !== "all" || statusFilter !== "all";

  const toggleFocusArea = (value: string) => {
    setFocusAreas((current) => {
      if (current.includes(value)) {
        return current.filter((area) => area !== value);
      }

      return [...current, value];
    });
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
          ? "Generated 1 suggestion."
          : `Generated ${count} suggestions.`,
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
          ? "Suggestion applied to the writing."
          : "Suggestion marked as applied.",
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
      <section className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-black dark:text-white">
              Writing Suggestions
            </h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Review specific edits, track applied changes, and generate a new
              AI pass when the draft changes.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              variant="outline"
              onClick={() => setShowRefactored((current) => !current)}
              disabled={!canPreviewRefactored}
            >
              {showRefactored ? "Hide Preview" : "Preview Applied"}
            </Button>
            <Button
              onClick={handleGenerateSuggestions}
              isLoading={generateSuggestions.isPending}
              disabled={generateSuggestions.isPending}
            >
              {generateSuggestions.isPending ? "Analyzing..." : "Analyze"}
            </Button>
          </div>
        </div>

        <div className="mt-5">
          <div className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Focus areas
          </div>
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
                    "h-9 rounded-md border px-3 text-sm font-medium transition-colors",
                    active
                      ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-gray-500",
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
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Total
          </p>
          <p className="mt-2 text-3xl font-bold text-black dark:text-white">
            {statsView.totalSuggestions}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Open
          </p>
          <p className="mt-2 text-3xl font-bold text-amber-600 dark:text-amber-300">
            {openCount}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Applied
          </p>
          <p className="mt-2 text-3xl font-bold text-emerald-600 dark:text-emerald-300">
            {appliedCount}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            High confidence
          </p>
          <p className="mt-2 text-3xl font-bold text-blue-600 dark:text-blue-300">
            {highConfidenceCount}
          </p>
        </div>
      </div>

      <section className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <div className="grid gap-4 md:grid-cols-4">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Status
            </span>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="h-10 rounded-md border border-gray-300 bg-white px-3 text-sm text-black outline-none focus:border-black dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:border-white"
            >
              <option value="all">All</option>
              <option value="open">Open</option>
              <option value="applied">Applied</option>
            </select>
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Type
            </span>
            <select
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
              className="h-10 rounded-md border border-gray-300 bg-white px-3 text-sm text-black outline-none focus:border-black dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:border-white"
            >
              <option value="all">All types</option>
              {typeOptions.map((type) => (
                <option key={type} value={type}>
                  {toLabel(type)}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Severity
            </span>
            <select
              value={severityFilter}
              onChange={(event) => setSeverityFilter(event.target.value)}
              className="h-10 rounded-md border border-gray-300 bg-white px-3 text-sm text-black outline-none focus:border-black dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:border-white"
            >
              <option value="all">All severities</option>
              {severityOptions.map((severity) => (
                <option key={severity} value={severity}>
                  {toLabel(severity)}
                </option>
              ))}
            </select>
          </label>

          <div className="flex items-end">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={resetFilters}
              disabled={!hasActiveFilters}
            >
              Clear Filters
            </Button>
          </div>
        </div>

        {(typeEntries.length > 0 || severityEntries.length > 0) && (
          <div className="mt-5 flex flex-wrap gap-2">
            {typeEntries.map(([type, count]) => (
              <span
                key={type}
                className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-200"
              >
                {toLabel(type)}: {count}
              </span>
            ))}
            {severityEntries.map(([severity, count]) => {
              const style = getSeverityStyle(severity);

              return (
                <span
                  key={severity}
                  className={cn("rounded-full px-3 py-1 text-xs font-medium", style.badge)}
                >
                  {toLabel(severity)}: {count}
                </span>
              );
            })}
          </div>
        )}
      </section>

      {mutationError && (
        <Alert
          type="error"
          title="Suggestion action failed"
          message={mutationError}
          onClose={() => setMutationError(null)}
        />
      )}

      {mutationSuccess && (
        <Alert
          type="success"
          title="Updated"
          message={mutationSuccess}
          onClose={() => setMutationSuccess(null)}
        />
      )}

      {suggestionsError && (
        <Alert
          type="error"
          title="Could not load suggestions"
          message={getErrorMessage(suggestionsError)}
        />
      )}

      {statsError && !stats && suggestions.length > 0 && (
        <Alert
          type="warning"
          title="Stats unavailable"
          message={getErrorMessage(statsError)}
        />
      )}

      {showRefactored && canPreviewRefactored && (
        <section className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-black dark:text-white">
              Applied Preview
            </h3>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {appliedCount} applied
            </span>
          </div>

          {isRefactoredLoading ? (
            <Loading text="Loading preview..." />
          ) : refactoredError ? (
            <Alert
              type="error"
              title="Could not load preview"
              message={getErrorMessage(refactoredError)}
            />
          ) : refactoredWriting ? (
            <div className="grid gap-4 lg:grid-cols-2">
              <div>
                <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Original
                </p>
                <pre className="max-h-96 overflow-auto whitespace-pre-wrap break-words rounded-md border border-gray-200 bg-gray-50 p-4 text-sm leading-6 text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300">
                  {refactoredWriting.original}
                </pre>
              </div>
              <div>
                <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Refactored
                </p>
                <pre className="max-h-96 overflow-auto whitespace-pre-wrap break-words rounded-md border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-100">
                  {refactoredWriting.refactored}
                </pre>
              </div>
            </div>
          ) : null}
        </section>
      )}

      {isSuggestionsLoading && suggestions.length === 0 ? (
        <section className="rounded-lg border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
          <Loading text="Loading suggestions..." />
        </section>
      ) : suggestions.length === 0 ? (
        <section className="rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
          <EmptyState
            title="No suggestions yet"
            description="Run an AI pass to generate targeted improvements for this writing."
            action={{
              label: generateSuggestions.isPending
                ? "Analyzing..."
                : "Generate Suggestions",
              onClick: handleGenerateSuggestions,
            }}
          />
        </section>
      ) : filteredSuggestions.length === 0 ? (
        <section className="rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
          <EmptyState
            title="No matching suggestions"
            description="Adjust the filters to see more suggestions."
            action={{
              label: "Clear Filters",
              onClick: resetFilters,
            }}
          />
        </section>
      ) : (
        <div className="space-y-4">
          {filteredSuggestions.map((suggestion) => {
            const severity = normalizeValue(suggestion.severity);
            const style = getSeverityStyle(severity);
            const confidencePercent = getConfidencePercent(
              suggestion.confidenceScore,
            );
            const isApplyingThis = applyingSuggestionId === suggestion.id;

            return (
              <article
                key={suggestion.id}
                className={cn(
                  "rounded-lg border bg-white p-5 dark:bg-gray-900",
                  style.border,
                  suggestion.isApplied && "opacity-80",
                )}
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                        {toLabel(normalizeValue(suggestion.type))}
                      </span>
                      <span
                        className={cn(
                          "rounded-full px-3 py-1 text-xs font-medium",
                          style.badge,
                        )}
                      >
                        {toLabel(severity)}
                      </span>
                      <span
                        className={cn(
                          "rounded-full px-3 py-1 text-xs font-medium",
                          suggestion.isApplied
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
                            : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200",
                        )}
                      >
                        {suggestion.isApplied ? "Applied" : "Open"}
                      </span>
                    </div>

                    <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                      Created {formatDateTime(suggestion.createdAt)}
                    </p>
                  </div>

                  <div className="w-full lg:w-56">
                    <div className="mb-2 flex justify-between text-xs font-medium text-gray-600 dark:text-gray-400">
                      <span>Confidence</span>
                      <span>{confidencePercent}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-800">
                      <div
                        className={cn("h-2 rounded-full", style.meter)}
                        style={{ width: `${confidencePercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 lg:grid-cols-2">
                  <div className={cn("rounded-md border p-4", style.surface, style.border)}>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400">
                      Original
                    </p>
                    <p className="whitespace-pre-wrap break-words text-sm leading-6 text-gray-800 dark:text-gray-200">
                      {suggestion.originalText || "No original text provided."}
                    </p>
                  </div>
                  <div className="rounded-md border border-emerald-200 bg-emerald-50/80 p-4 dark:border-emerald-900 dark:bg-emerald-950/20">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
                      Suggested
                    </p>
                    <p className="whitespace-pre-wrap break-words text-sm leading-6 text-emerald-950 dark:text-emerald-100">
                      {suggestion.suggestedText || "No suggested text provided."}
                    </p>
                  </div>
                </div>

                <div className="mt-4 rounded-md bg-gray-50 p-4 dark:bg-gray-950">
                  <p className="text-sm leading-6 text-gray-700 dark:text-gray-300">
                    {suggestion.explanation || "No explanation provided."}
                  </p>
                </div>

                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-xs text-gray-500 dark:text-gray-500">
                    {suggestion.position
                      ? `Position ${suggestion.position.start}-${suggestion.position.end}`
                      : "Text position unavailable"}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {!suggestion.isApplied && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleApplySuggestion(suggestion, false)}
                        isLoading={isApplyingThis && applyingMode === "mark"}
                        disabled={applySuggestion.isPending}
                      >
                        Mark Applied
                      </Button>
                    )}
                    {!suggestion.isApplied && suggestion.position && (
                      <Button
                        size="sm"
                        onClick={() => handleApplySuggestion(suggestion, true)}
                        isLoading={isApplyingThis && applyingMode === "update"}
                        disabled={applySuggestion.isPending}
                      >
                        Apply To Writing
                      </Button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
