"use client";

import { useMemo, useState } from "react";
import { BookOpen, Sparkles } from "lucide-react";
import { Badge } from "@/components/badge";
import { Select } from "@/components/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/tabs";
import { cn } from "@/lib/utils";
import { writingsMessages } from "@/messages/writings";
import { WritingType } from "@/types/api";
import { writingTypeOptions } from "@/utils/helpers";
import {
  PROMPT_DIFFICULTY_LABELS,
  getPromptsByType,
  type WritingPrompt,
} from "../constants/writing-prompts";
import { AiPromptGenerator } from "./AiPromptGenerator";
import { CustomPromptForm } from "./CustomPromptForm";

interface WritingPromptPickerProps {
  onSelect: (prompt: WritingPrompt) => void;
  selectedId?: string;
}

export function WritingPromptPicker({
  onSelect,
  selectedId,
}: WritingPromptPickerProps) {
  const [sourceTab, setSourceTab] = useState("curated");
  const [typeFilter, setTypeFilter] = useState<string>("");

  const prompts = useMemo(
    () => getPromptsByType(typeFilter ? (typeFilter as WritingType) : undefined),
    [typeFilter],
  );

  return (
    <div className="space-y-4">
      <Tabs value={sourceTab} onValueChange={setSourceTab} className="w-full">
        <TabsList className="grid grid-cols-3 min-w-0">
          <TabsTrigger value="curated">{writingsMessages.promptPicker.tabCurated}</TabsTrigger>
          <TabsTrigger value="custom">{writingsMessages.promptPicker.tabCustom}</TabsTrigger>
          <TabsTrigger value="ai">{writingsMessages.promptPicker.tabAi}</TabsTrigger>
        </TabsList>

        <TabsContent value="curated" className="mt-4 space-y-4">
          <div className="panel-glass p-4 sm:p-5 space-y-3">
            <div className="flex items-start gap-3">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <BookOpen className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-fg">{writingsMessages.promptPicker.curatedTitle}</h3>
                <p className="text-sm text-muted mt-1 leading-relaxed">
                  {writingsMessages.promptPicker.curatedDescription}
                </p>
              </div>
            </div>

            <Select
              label={writingsMessages.promptPicker.filterTypeLabel}
              name="promptType"
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
              options={[
                { value: "", label: writingsMessages.promptPicker.allTypes },
                ...writingTypeOptions,
              ]}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {prompts.map((prompt) => {
              const isSelected = selectedId === prompt.id;
              return (
                <button
                  key={prompt.id}
                  type="button"
                  onClick={() => onSelect(prompt)}
                  className={cn(
                    "text-left panel-glass p-4 sm:p-5 transition-all",
                    "hover:border-primary/30 hover:shadow-[0_0_20px_var(--glow-primary)]",
                    isSelected && "border-primary/40 ring-2 ring-primary/20",
                  )}
                >
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <Badge>
                      {
                        writingTypeOptions.find((o) => o.value === prompt.type)
                          ?.label
                      }
                    </Badge>
                    <Badge variant="neutral">
                      {PROMPT_DIFFICULTY_LABELS[prompt.difficulty]}
                    </Badge>
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
        </TabsContent>

        <TabsContent value="custom" className="mt-4">
          <CustomPromptForm onSubmit={onSelect} />
        </TabsContent>

        <TabsContent value="ai" className="mt-4">
          <AiPromptGenerator onSelect={onSelect} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
