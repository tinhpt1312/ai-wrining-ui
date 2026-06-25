import { WritingStatus, WritingType } from "@/types/api";

export const writingTypeOptions = [
  { value: WritingType.SOCIAL_ESSAY, label: "Bài Luận Xã Hội" },
  { value: WritingType.CATHOLIC_ESSAY, label: "Bài Luận Công Giáo" },
  { value: WritingType.SHORT_STORY, label: "Truyện Ngắn" },
  { value: WritingType.ARTICLE, label: "Bài Báo" },
];

export const writingStatusOptions = [
  { value: WritingStatus.DRAFT, label: "Bản Nháp" },
  { value: WritingStatus.PUBLIC, label: "Công Khai" },
];

export function getWritingTypeLabel(type: string): string {
  return writingTypeOptions.find((o) => o.value === type)?.label || type;
}

export function getWritingStatusLabel(status: string): string {
  return writingStatusOptions.find((o) => o.value === status)?.label || status;
}
