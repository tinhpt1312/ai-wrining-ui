"use client";

import { useState } from "react";
import { PenLine } from "lucide-react";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Select } from "@/components/select";
import { Textarea } from "@/components/textarea";
import { WritingType } from "@/types/api";
import { writingTypeOptions } from "@/utils/helpers";
import type { WritingPrompt } from "../constants/writing-prompts";
import { buildWritingPrompt } from "../utils/prompt.utils";

interface CustomPromptFormProps {
  onSubmit: (prompt: WritingPrompt) => void;
}

export function CustomPromptForm({ onSubmit }: CustomPromptFormProps) {
  const [type, setType] = useState<WritingType>(WritingType.SOCIAL_ESSAY);
  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("");
  const [hint, setHint] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = title.trim();
    if (trimmedTitle.length < 3) {
      setError("Tiêu đề đề bài cần ít nhất 3 ký tự.");
      return;
    }

    setError("");
    onSubmit(
      buildWritingPrompt({
        type,
        title: trimmedTitle,
        topic: topic.trim() || trimmedTitle,
        hint: hint.trim() || undefined,
      }),
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="panel-glass p-4 sm:p-5 space-y-3">
        <div className="flex items-start gap-3">
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <PenLine className="h-5 w-5" />
          </span>
          <div>
            <h3 className="text-sm font-semibold text-fg">Nhập đề của bạn</h3>
            <p className="text-sm text-muted mt-1 leading-relaxed">
              Dán đề từ giáo viên, đề thi hoặc tự đặt chủ đề — AI sẽ gợi ý dàn
              ý phù hợp.
            </p>
          </div>
        </div>

        <Select
          label="Loại bài"
          name="customPromptType"
          value={type}
          onChange={(event) => setType(event.target.value as WritingType)}
          options={writingTypeOptions}
          required
        />

        <Input
          label="Tiêu đề / đề bài"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="VD: Vai trò của gia đình trong xã hội hiện đại"
          required
          maxLength={255}
          error={error}
        />

        <Textarea
          label="Mô tả thêm (tùy chọn)"
          value={topic}
          onChange={(event) => setTopic(event.target.value)}
          placeholder="Yêu cầu chi tiết, góc tiếp cận, hoặc ngữ cảnh đề bài..."
          maxLength={2000}
          charCount={topic.length}
          size="md"
        />

        <Textarea
          label="Gợi ý triển khai (tùy chọn)"
          value={hint}
          onChange={(event) => setHint(event.target.value)}
          placeholder="VD: Phân tích hai mặt, có dẫn chứng cụ thể..."
          maxLength={500}
          charCount={hint.length}
          size="sm"
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" className="gap-2 btn-glow-solid">
          Tiếp tục lập dàn ý
        </Button>
      </div>
    </form>
  );
}
