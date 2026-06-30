"use client";

import { useEffect } from "react";
import { GitCompare, PanelRightOpen, Save } from "lucide-react";
import { Button } from "@/components/button";
import { Badge } from "@/components/badge";
import { countWords } from "../utils/revision.utils";
import { cn } from "@/lib/utils";
import { revisionMessages } from "@/messages/revision";
import { msg } from "@/messages/format";

interface RevisionEditorProps {
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
  hasUnsavedChanges: boolean;
  isSaving: boolean;
  className?: string;
  minHeight?: string;
  pendingSuggestionCount?: number;
  suggestionsOpen?: boolean;
  onToggleSuggestions?: () => void;
  showDiff?: boolean;
  onToggleDiff?: () => void;
}

export function RevisionEditor({
  value,
  onChange,
  onSave,
  hasUnsavedChanges,
  isSaving,
  className = "",
  minHeight = "min-h-0",
  pendingSuggestionCount = 0,
  suggestionsOpen = false,
  onToggleSuggestions,
  showDiff = false,
  onToggleDiff,
}: RevisionEditorProps) {
  const wordCount = countWords(value);
  const charCount = value.length;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "s") {
        event.preventDefault();
        if (hasUnsavedChanges && !isSaving) {
          onSave();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [hasUnsavedChanges, isSaving, onSave]);

  return (
    <div className={cn("flex h-full flex-col overflow-hidden", className)}>
      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-border px-4 py-3">
        <div className="flex items-center gap-2 min-w-0">
          <h2 className="text-sm font-semibold text-fg">
            {revisionMessages.editor.title}
          </h2>
          {hasUnsavedChanges ? (
            <Badge variant="warning">{revisionMessages.editor.unsaved}</Badge>
          ) : (
            <Badge variant="success">{revisionMessages.editor.synced}</Badge>
          )}
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {onToggleDiff && (
            <Button
              size="sm"
              variant={showDiff ? "secondary" : "outline"}
              className="hidden sm:inline-flex gap-1.5"
              onClick={onToggleDiff}
            >
              <GitCompare className="h-4 w-4" />
              {revisionMessages.editor.compare}
            </Button>
          )}
          {onToggleSuggestions && (
            <Button
              size="sm"
              variant={suggestionsOpen ? "secondary" : "outline"}
              className="gap-1.5"
              onClick={onToggleSuggestions}
            >
              <PanelRightOpen className="h-4 w-4" />
              <span className="hidden sm:inline">
                {revisionMessages.editor.suggestions}
              </span>
              {pendingSuggestionCount > 0 && (
                <Badge variant="warning" className="ml-0.5">
                  {pendingSuggestionCount}
                </Badge>
              )}
            </Button>
          )}
          <Button
            size="sm"
            className="gap-1.5"
            onClick={onSave}
            disabled={!hasUnsavedChanges || isSaving}
            isLoading={isSaving}
          >
            <Save className="h-4 w-4" />
            <span className="hidden sm:inline">
              {revisionMessages.editor.save}
            </span>
            <span className="sm:hidden">{revisionMessages.editor.saveShort}</span>
          </Button>
        </div>
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "flex-1 w-full resize-none border-0 bg-transparent p-4 text-sm leading-relaxed text-fg focus:outline-none focus:ring-0",
          minHeight,
        )}
        placeholder={revisionMessages.editor.placeholder}
        spellCheck={false}
      />

      <div className="shrink-0 flex items-center justify-between gap-2 border-t border-border bg-surface-2/60 px-4 py-2.5">
        <p className="text-xs text-muted">
          {msg(revisionMessages.editor.wordCount, {
            words: wordCount,
            chars: charCount,
          })}
          <span className="hidden sm:inline text-subtle"> · Ctrl+S</span>
        </p>
        <p className="text-xs text-subtle hidden md:inline">
          {revisionMessages.editor.saveHint}
        </p>
      </div>
    </div>
  );
}
