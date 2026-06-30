"use client";

import { useMemo, useState } from "react";
import { RefreshCw, Sparkles, Wand2 } from "lucide-react";
import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { Select } from "@/components/select";
import { cn } from "@/lib/utils";
import { toast } from "@/lib/toast";
import { writingMessages } from "@/messages/writing";
import { writingsMessages } from "@/messages/writings";
import { WritingType } from "@/types/api";
import type { GeneratedWritingPrompt, PromptDifficulty } from "@/types/api";
import { writingTypeOptions } from "@/utils/helpers";
import {
  PROMPT_DIFFICULTY_LABELS,
  type WritingPrompt,
} from "../constants/writing-prompts";
import { useGenerateWritingPrompts } from "../hooks/useWritingsApi";
import { buildAiWritingPrompt } from "../utils/prompt.utils";

const DIFFICULTY_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "", label: writingMessages.prompt.difficulty.all },
  { value: "dễ", label: writingMessages.prompt.difficulty.easy },
  { value: "trung bình", label: writingMessages.prompt.difficulty.medium },
  { value: "khó", label: writingMessages.prompt.difficulty.hard },
];

interface AiPromptGeneratorProps {
  onSelect: (prompt: WritingPrompt) => void;
}

export function AiPromptGenerator({ onSelect }: AiPromptGeneratorProps) {
  const generatePrompts = useGenerateWritingPrompts();
  const [type, setType] = useState<WritingType>(WritingType.SOCIAL_ESSAY);
  const [difficulty, setDifficulty] = useState("");
  const [generated, setGenerated] = useState<GeneratedWritingPrompt[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const excludeTitles = useMemo(
    () => generated.map((prompt) => prompt.title),
    [generated],
  );

  const handleGenerate = async () => {
    try {
      const result = await generatePrompts.mutateAsync({
        type,
        difficulty: difficulty
          ? (difficulty as PromptDifficulty)
          : undefined,
        count: 4,
        excludeTitles: excludeTitles.length > 0 ? excludeTitles : undefined,
      });
      setGenerated(result);
      setSelectedIndex(null);
      toast.success(writingsMessages.aiPrompt.toastSuccess);
    } catch {
      toast.error(writingsMessages.aiPrompt.toastError);
    }
  };

  const handleSelect = (prompt: GeneratedWritingPrompt, index: number) => {
    setSelectedIndex(index);
    onSelect(buildAiWritingPrompt(type, prompt, index));
  };

  return (
    <div className="space-y-4">
      <div className="panel-glass p-4 sm:p-5 space-y-4">
        <div className="flex items-start gap-3">
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <Wand2 className="h-5 w-5" />
          </span>
          <div>
            <h3 className="text-sm font-semibold text-fg">{writingsMessages.aiPrompt.title}</h3>
            <p className="text-sm text-muted mt-1 leading-relaxed">
              {writingsMessages.aiPrompt.description}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select
            label={writingsMessages.aiPrompt.typeLabel}
            name="aiPromptType"
            value={type}
            onChange={(event) => setType(event.target.value as WritingType)}
            options={writingTypeOptions}
          />
          <Select
            label={writingsMessages.aiPrompt.difficultyLabel}
            name="aiPromptDifficulty"
            value={difficulty}
            onChange={(event) => setDifficulty(event.target.value)}
            options={DIFFICULTY_OPTIONS}
          />
        </div>

        <Button
          type="button"
          className="gap-2 btn-glow-solid w-full sm:w-auto"
          onClick={handleGenerate}
          disabled={generatePrompts.isPending}
          isLoading={generatePrompts.isPending}
        >
          {generated.length > 0 ? (
            <>
              <RefreshCw className="h-4 w-4" />
              {writingsMessages.aiPrompt.generateNew}
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              {writingsMessages.aiPrompt.generateFirst}
            </>
          )}
        </Button>
      </div>

      {generated.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {generated.map((prompt, index) => {
            const isSelected = selectedIndex === index;
            return (
              <button
                key={`${prompt.title}-${index}`}
                type="button"
                onClick={() => handleSelect(prompt, index)}
                className={cn(
                  "text-left panel-glass p-4 sm:p-5 transition-all",
                  "hover:border-primary/30 hover:shadow-[0_0_20px_var(--glow-primary)]",
                  isSelected && "border-primary/40 ring-2 ring-primary/20",
                )}
              >
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <Badge>
                    {writingTypeOptions.find((o) => o.value === type)?.label}
                  </Badge>
                  <Badge variant="neutral">
                    {PROMPT_DIFFICULTY_LABELS[prompt.difficulty]}
                  </Badge>
                  <Badge variant="neutral">{writingsMessages.aiPrompt.badgeAi}</Badge>
                </div>
                <h4 className="text-sm font-semibold text-fg leading-snug">
                  {prompt.title}
                </h4>
                <p className="text-xs text-muted mt-2 leading-relaxed line-clamp-2">
                  {prompt.hint}
                </p>
                <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-primary">
                  <Sparkles className="h-3.5 w-3.5" />
                  {writingsMessages.promptPicker.usePrompt}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
