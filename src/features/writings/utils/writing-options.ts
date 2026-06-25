import { WritingStatus, WritingType } from "@/types/api";
import { ACTIVE_WRITING_TYPES, isActiveWritingType } from "../constants/active-writing-types";

const WRITING_TYPE_LABELS: Record<string, string> = {
  [WritingType.SOCIAL_ESSAY]: "Nghị luận xã hội",
  [WritingType.CATHOLIC_ESSAY]: "Nghị luận công giáo",
  [WritingType.SHORT_STORY]: "Truyện ngắn",
  [WritingType.ARTICLE]: "Bài báo",
};

/** Lựa chọn thể loại khi tạo bài / lọc / đề gợi ý */
export const writingTypeOptions = ACTIVE_WRITING_TYPES.map((value) => ({
  value,
  label: WRITING_TYPE_LABELS[value],
}));

export const writingStatusOptions = [
  { value: WritingStatus.DRAFT, label: "Bản Nháp" },
  { value: WritingStatus.PUBLIC, label: "Công Khai" },
];

export function getWritingTypeLabel(type: string): string {
  return WRITING_TYPE_LABELS[type] || type;
}

/** Khi sửa bài cũ (thể loại đã ẩn), vẫn hiển thị loại hiện tại */
export function getWritableTypeOptions(currentType?: string): Array<{
  value: string;
  label: string;
}> {
  const options: Array<{ value: string; label: string }> = [
    ...writingTypeOptions,
  ];

  if (currentType && !isActiveWritingType(currentType)) {
    options.push({
      value: currentType,
      label: `${getWritingTypeLabel(currentType)} (không còn hỗ trợ tạo mới)`,
    });
  }

  return options;
}

export function getWritingStatusLabel(status: string): string {
  return writingStatusOptions.find((o) => o.value === status)?.label || status;
}
