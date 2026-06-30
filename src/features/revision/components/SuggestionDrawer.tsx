"use client";

import { Check, PanelRightClose, PanelRightOpen, Wand2 } from "lucide-react";
import { Button } from "@/components/button";
import { Badge } from "@/components/badge";
import { Loading } from "@/components/loading";
import { SelfEditGate } from "./SelfEditGate";
import type { WritingSuggestion } from "@/types/api";
import { cn } from "@/lib/utils";
import { revisionMessages } from "@/messages/revision";
import { msg } from "@/messages/format";

interface SuggestionDrawerProps {
  open: boolean;
  onClose: () => void;
  suggestions: WritingSuggestion[];
  pendingCount: number;
  isLoading?: boolean;
  applyingId: string | null;
  isApplying?: boolean;
  onApply: (suggestionId: string, updateWriting: boolean) => void;
  onGenerateFromAnalysis?: () => void;
  onGenerateAi?: () => void;
  isGenerating?: boolean;
  hasAnalysisContext?: boolean;
  suggestionsLocked?: boolean;
  selfEditBaseline?: string;
  selfEditCurrent?: string;
  writingId?: string;
  analysisId?: string;
}

export function SuggestionDrawer({
  open,
  onClose,
  suggestions,
  pendingCount,
  isLoading,
  applyingId,
  isApplying,
  onApply,
  onGenerateFromAnalysis,
  onGenerateAi,
  isGenerating,
  hasAnalysisContext,
  suggestionsLocked = false,
  selfEditBaseline = "",
  selfEditCurrent = "",
  writingId,
  analysisId,
}: SuggestionDrawerProps) {
  return (
    <>
      {open && (
        <button
          type="button"
          aria-label={revisionMessages.drawer.closeAria}
          className="absolute inset-0 z-20 bg-fg/20 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "absolute top-0 right-0 z-30 flex h-full w-full max-w-sm flex-col border-l border-border bg-surface shadow-xl transition-transform duration-200",
          open ? "translate-x-0" : "translate-x-full pointer-events-none",
        )}
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-3">
          <div>
            <h3 className="text-sm font-semibold text-fg">
              {revisionMessages.drawer.title}
            </h3>
            <p className="text-xs text-muted">
              {revisionMessages.drawer.subtitle}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {pendingCount > 0 && (
              <Badge variant="warning">
                {msg(revisionMessages.drawer.pending, { count: pendingCount })}
              </Badge>
            )}
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0"
              onClick={onClose}
              aria-label={revisionMessages.drawer.hideAria}
            >
              <PanelRightClose className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 relative">
          {suggestionsLocked ? (
            <SelfEditGate
              unlocked={false}
              baseline={selfEditBaseline}
              current={selfEditCurrent}
              writingId={writingId}
              analysisId={analysisId}
              title={revisionMessages.selfEdit.beforeSuggestions}
              description={revisionMessages.selfEdit.beforeSuggestionsDescription}
              className="min-h-[280px]"
            >
              <div className="h-32" />
            </SelfEditGate>
          ) : isLoading ? (
            <Loading text={revisionMessages.drawer.loading} />
          ) : suggestions.length === 0 ? (
            <div className="space-y-3 py-6 text-center">
              <p className="text-sm text-muted">
                {revisionMessages.drawer.empty}
              </p>
              {hasAnalysisContext && onGenerateFromAnalysis && (
                <Button
                  size="sm"
                  onClick={onGenerateFromAnalysis}
                  disabled={isGenerating}
                  isLoading={isGenerating}
                >
                  {revisionMessages.drawer.loadFromAnalysis}
                </Button>
              )}
              {onGenerateAi && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onGenerateAi}
                  disabled={isGenerating}
                  isLoading={isGenerating}
                  className="gap-1.5"
                >
                  <Wand2 className="h-4 w-4" />
                  {revisionMessages.drawer.generateAi}
                </Button>
              )}
            </div>
          ) : (
            suggestions.map((suggestion) => (
              <article
                key={suggestion.id}
                className={cn(
                  "rounded-lg border border-border p-3 space-y-2",
                  suggestion.isApplied && "opacity-60",
                )}
              >
                <div className="flex items-start gap-2">
                  {suggestion.isApplied ? (
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  ) : (
                    <div className="mt-1 h-3.5 w-3.5 shrink-0 rounded-full border-2 border-border" />
                  )}
                  <p className="text-sm text-fg leading-relaxed">
                    {suggestion.explanation || suggestion.suggestedText}
                  </p>
                </div>
                {!suggestion.isApplied && (
                  <div className="flex flex-wrap gap-1.5 pl-6">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="text-xs h-7"
                      onClick={() => onApply(suggestion.id, false)}
                      disabled={isApplying}
                      isLoading={applyingId === suggestion.id}
                    >
                      {revisionMessages.drawer.mark}
                    </Button>
                    {suggestion.position && (
                      <Button
                        size="sm"
                        className="text-xs h-7"
                        onClick={() => onApply(suggestion.id, true)}
                        disabled={isApplying}
                        isLoading={applyingId === suggestion.id}
                      >
                        {revisionMessages.drawer.apply}
                      </Button>
                    )}
                  </div>
                )}
              </article>
            ))
          )}
        </div>
      </aside>
    </>
  );
}
