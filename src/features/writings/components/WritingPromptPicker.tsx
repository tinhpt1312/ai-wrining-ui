"use client";

import { useMemo, useState } from "react";
import { BookOpen, Sparkles } from "lucide-react";
import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { Select } from "@/components/select";
import { cn } from "@/lib/utils";
import { WritingType } from "@/types/api";
import { writingTypeOptions } from "@/utils/helpers";
import {
  PROMPT_DIFFICULTY_LABELS,
  getPromptsByType,
  type WritingPrompt,
} from "../constants/writing-prompts";

interface WritingPromptPickerProps {
  onSelect: (prompt: WritingPrompt) => void;
  selectedId?: string;
}

export function WritingPromptPicker({
  onSelect,
  selectedId,
}: WritingPromptPickerProps) {
  const [typeFilter, setTypeFilter] = useState<string>("");

  const prompts = useMemo(
    () => getPromptsByType(typeFilter ? (typeFilter as WritingType) : undefined),
    [typeFilter],
  );

  return (
    <div className="space-y-4">
      <div className="panel-glass p-4 sm:p-5 space-y-3">
        <div className="flex items-start gap-3">
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <BookOpen className="h-5 w-5" />
          </span>
          <div>
            <h3 className="text-sm font-semibold text-fg">Chọn đề gợi ý</h3>
            <p className="text-sm text-muted mt-1 leading-relaxed">
              Bắt đầu từ một đề có sẵn để luyện viết có chủ đích. Bạn vẫn có thể
              chỉnh sửa nội dung sau khi chọn.
            </p>
          </div>
        </div>

        <Select
          label="Lọc theo loại bài"
          name="promptType"
          value={typeFilter}
          onChange={(event) => setTypeFilter(event.target.value)}
          options={[{ value: "", label: "Tất cả loại bài" }, ...writingTypeOptions]}
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
                <Badge>{writingTypeOptions.find((o) => o.value === prompt.type)?.label}</Badge>
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
                Dùng đề này
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
