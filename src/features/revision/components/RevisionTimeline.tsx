"use client";

import { useMemo, useState } from "react";
import type { WritingRevision } from "@/types/api";
import { formatDateTime } from "@/utils/helpers";
import { Button } from "@/components/button";
import { Badge } from "@/components/badge";
import { TextDiffView } from "./TextDiffView";
import {
  ChevronDown,
  ChevronUp,
  GitCompare,
  History,
  RotateCcw,
  TrendingDown,
  TrendingUp,
  Minus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { revisionMessages } from "@/messages/revision";
import { msg } from "@/messages/format";

const SOURCE_LABELS: Record<string, string> = {
  ...revisionMessages.timeline.source,
};

export interface RevisionTimelineItem extends WritingRevision {
  wordCount: number;
  wordCountDelta: number;
}

function DeltaBadge({ delta }: { delta: number }) {
  if (delta === 0) {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-muted">
        <Minus className="h-3 w-3" />
        {revisionMessages.timeline.wordDeltaZero}
      </span>
    );
  }

  const isUp = delta > 0;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-xs font-medium",
        isUp ? "text-success" : "text-warning",
      )}
    >
      {isUp ? (
        <TrendingUp className="h-3 w-3" />
      ) : (
        <TrendingDown className="h-3 w-3" />
      )}
      {msg(revisionMessages.timeline.wordDelta, {
        delta: `${isUp ? "+" : ""}${delta}`,
      })}
    </span>
  );
}

export function RevisionTimeline({
  revisions,
  selectedRevisionId,
  onSelect,
  onRestore,
  restoringRevisionId,
  isLoading,
}: {
  revisions: RevisionTimelineItem[];
  selectedRevisionId?: string | null;
  onSelect?: (revision: RevisionTimelineItem) => void;
  onRestore?: (revision: RevisionTimelineItem) => void;
  restoringRevisionId?: string | null;
  isLoading?: boolean;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [compareMode, setCompareMode] = useState(false);

  const sorted = useMemo(
    () =>
      [...revisions].sort((a, b) => a.revisionNumber - b.revisionNumber),
    [revisions],
  );

  const previousById = useMemo(() => {
    const map = new Map<string, RevisionTimelineItem | null>();
    sorted.forEach((revision, index) => {
      map.set(revision.id, index > 0 ? sorted[index - 1] : null);
    });
    return map;
  }, [sorted]);

  if (isLoading) {
    return (
      <div className="card-elevated p-8 text-center text-sm text-muted">
        {revisionMessages.timeline.loading}
      </div>
    );
  }

  if (sorted.length === 0) {
    return (
      <div className="card-elevated p-8 text-center">
        <History className="mx-auto mb-3 h-8 w-8 text-muted" />
        <h3 className="text-sm font-semibold text-fg">
          {revisionMessages.timeline.emptyTitle}
        </h3>
        <p className="mt-1 text-sm text-muted max-w-md mx-auto">
          {revisionMessages.timeline.emptyDescription}
        </p>
      </div>
    );
  }

  return (
    <section className="card-elevated overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border p-4">
        <div>
          <h3 className="text-sm font-semibold text-fg flex items-center gap-2">
            <History className="h-4 w-4" />
            {revisionMessages.timeline.title}
          </h3>
          <p className="text-xs text-muted mt-0.5">
            {msg(revisionMessages.timeline.subtitle, { count: sorted.length })}
          </p>
        </div>
        <Button
          size="sm"
          variant={compareMode ? "secondary" : "outline"}
          className="gap-1.5"
          onClick={() => setCompareMode((v) => !v)}
        >
          <GitCompare className="h-4 w-4" />
          {compareMode
            ? revisionMessages.timeline.hideCompare
            : revisionMessages.timeline.showCompare}
        </Button>
      </div>

      <ol className="relative p-4 sm:p-6 space-y-0">
        {sorted.map((revision, index) => {
          const isLast = index === sorted.length - 1;
          const isExpanded = expandedId === revision.id;
          const isSelected = selectedRevisionId === revision.id;
          const previous = previousById.get(revision.id) ?? null;
          const excerpt = revision.content.trim().slice(0, 180);

          return (
            <li key={revision.id} className="relative flex gap-4 pb-8 last:pb-0">
              {!isLast && (
                <span
                  className="absolute left-[15px] top-8 bottom-0 w-0.5 bg-border"
                  aria-hidden
                />
              )}

              <div
                className={cn(
                  "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold",
                  isSelected
                    ? "border-primary bg-primary text-primary-fg"
                    : "border-border bg-surface text-muted",
                )}
              >
                {revision.revisionNumber}
              </div>

              <div className="flex-1 min-w-0 space-y-3">
                <div
                  className={cn(
                    "rounded-xl border p-4 transition-colors",
                    isSelected
                      ? "border-primary/30 bg-primary-soft/30"
                      : "border-border bg-surface",
                  )}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-fg">
                          {SOURCE_LABELS[revision.source] || revision.source}
                        </p>
                        <Badge variant="neutral">
                          {msg(revisionMessages.timeline.wordCount, {
                            count: revision.wordCount,
                          })}
                        </Badge>
                        {index > 0 && (
                          <DeltaBadge delta={revision.wordCountDelta} />
                        )}
                      </div>
                      <p className="text-xs text-muted mt-1">
                        {formatDateTime(revision.createdAt)}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1 text-xs h-8"
                        onClick={() => {
                          setExpandedId(isExpanded ? null : revision.id);
                          onSelect?.(revision);
                        }}
                      >
                        {isExpanded ? (
                          <ChevronUp className="h-3.5 w-3.5" />
                        ) : (
                          <ChevronDown className="h-3.5 w-3.5" />
                        )}
                        {isExpanded
                          ? revisionMessages.timeline.collapse
                          : revisionMessages.timeline.expand}
                      </Button>
                      {onRestore && revision.source !== "grading_baseline" && (
                        <Button
                          size="sm"
                          variant="secondary"
                          className="gap-1 text-xs h-8"
                          onClick={() => onRestore(revision)}
                          disabled={!!restoringRevisionId}
                          isLoading={restoringRevisionId === revision.id}
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                          {revisionMessages.timeline.restore}
                        </Button>
                      )}
                    </div>
                  </div>

                  {!isExpanded && excerpt && (
                    <p className="mt-3 text-sm text-muted line-clamp-2 leading-relaxed">
                      {excerpt}
                      {revision.content.length > 180 ? "…" : ""}
                    </p>
                  )}

                  {isExpanded && (
                    <div className="mt-4 space-y-4">
                      <pre className="max-h-56 overflow-auto whitespace-pre-wrap break-words rounded-lg border border-border bg-surface-2 p-4 text-sm leading-relaxed text-fg">
                        {revision.content}
                      </pre>

                      {compareMode && previous && (
                        <div className="rounded-lg border border-primary/20 bg-primary-soft/20 p-4">
                          <p className="text-xs font-semibold uppercase tracking-wide text-primary mb-2">
                            {msg(revisionMessages.timeline.changeFromMilestone, {
                              number: previous.revisionNumber,
                            })}
                          </p>
                          <TextDiffView
                            original={previous.content}
                            revised={revision.content}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
