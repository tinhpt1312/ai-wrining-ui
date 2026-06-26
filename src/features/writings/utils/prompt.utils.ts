import { WritingType } from "@/types/api";
import type {
  GeneratedWritingPrompt,
  PromptDifficulty,
} from "@/types/api";
import type { WritingPrompt } from "../constants/writing-prompts";

export function buildWritingPrompt(params: {
  id?: string;
  type: WritingType;
  title: string;
  topic?: string;
  hint?: string;
  difficulty?: PromptDifficulty;
}): WritingPrompt {
  const title = params.title.trim();
  const topic = params.topic?.trim() || title;
  const hint = params.hint?.trim() || "Viết bài theo đề bạn đã nhập.";

  return {
    id: params.id ?? `custom-${Date.now()}`,
    type: params.type,
    title,
    topic,
    hint,
    difficulty: params.difficulty ?? "trung bình",
    starterContent: `${title}...\n\n`,
  };
}

export function buildAiWritingPrompt(
  type: WritingType,
  generated: GeneratedWritingPrompt,
  index: number,
): WritingPrompt {
  return buildWritingPrompt({
    id: `ai-${Date.now()}-${index}`,
    type,
    title: generated.title,
    topic: generated.topic,
    hint: generated.hint,
    difficulty: generated.difficulty,
  });
}
