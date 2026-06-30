"use client";

import { useState } from "react";
import { ListTree, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { cn } from "@/lib/utils";
import { msg } from "@/messages/format";
import { writingsMessages } from "@/messages/writings";
import type { WritingOutline } from "@/types/api";
import type { WritingPrompt } from "../constants/writing-prompts";
import {
  updateOutlineKeyPoint,
  updateOutlineSection,
} from "../utils/outline.utils";

interface OutlineBuilderProps {
  prompt: WritingPrompt;
  outline: WritingOutline | null;
  isGenerating: boolean;
  onGenerate: () => void;
  onOutlineChange: (outline: WritingOutline) => void;
  onContinue: () => void;
  className?: string;
}

export function OutlineBuilder({
  prompt,
  outline,
  isGenerating,
  onGenerate,
  onOutlineChange,
  onContinue,
  className,
}: OutlineBuilderProps) {
  const [title, setTitle] = useState(outline?.title ?? prompt.title);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (outline) {
      onOutlineChange({ ...outline, title: value });
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div className="rounded-xl border border-primary/20 bg-primary-soft/20 p-4 sm:p-5">
        <p className="text-xs font-medium uppercase tracking-wider text-primary">
          {writingsMessages.outline.stepLabel}
        </p>
        <h2 className="mt-1 text-lg font-semibold text-fg">{prompt.title}</h2>
        <p className="mt-2 text-sm text-muted leading-relaxed">
          {prompt.hint}
        </p>
      </div>

      {!outline ? (
        <div className="card-elevated flex flex-col items-center justify-center gap-4 p-10 text-center">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
            <ListTree className="h-6 w-6" />
          </span>
          <div className="space-y-2 max-w-md">
            <h3 className="text-base font-semibold text-fg">
              {writingsMessages.outline.emptyTitle}
            </h3>
            <p className="text-sm text-muted leading-relaxed">
              {writingsMessages.outline.emptyDescription}
            </p>
          </div>
          <Button
            className="gap-2 btn-glow-solid"
            onClick={onGenerate}
            disabled={isGenerating}
            isLoading={isGenerating}
          >
            <Sparkles className="h-4 w-4" />
            {writingsMessages.outline.generateButton}
          </Button>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-fg">
              {writingsMessages.outline.titleLabel}
            </label>
            <Input
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder={writingsMessages.outline.titlePlaceholder}
            />
          </div>

          <div className="space-y-4">
            {outline.sections.map((section) => (
              <article
                key={section.id}
                className="card-elevated p-4 sm:p-5 space-y-3"
              >
                <Input
                  value={section.label}
                  onChange={(e) =>
                    onOutlineChange(
                      updateOutlineSection(outline, section.id, {
                        label: e.target.value,
                      }),
                    )
                  }
                  className="font-semibold"
                />
                {section.hint && (
                  <p className="text-xs text-muted">{section.hint}</p>
                )}
                <ul className="space-y-2">
                  {section.keyPoints.map((point, index) => (
                    <li key={`${section.id}-${index}`} className="flex gap-2">
                      <span className="text-primary mt-2.5 text-xs">•</span>
                      <Input
                        value={point}
                        onChange={(e) =>
                          onOutlineChange(
                            updateOutlineKeyPoint(
                              outline,
                              section.id,
                              index,
                              e.target.value,
                            ),
                          )
                        }
                        placeholder={msg(writingsMessages.outline.keyPointPlaceholder, {
                          index: index + 1,
                        })}
                      />
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 justify-end">
            <Button
              variant="outline"
              onClick={onGenerate}
              disabled={isGenerating}
              className="gap-2"
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {writingsMessages.outline.regenerateButton}
            </Button>
            <Button className="gap-2 btn-glow-solid" onClick={onContinue}>
              {writingsMessages.outline.continueButton}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
