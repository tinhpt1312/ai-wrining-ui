import { writingMessages } from "@/messages/writing";
import { WritingStatus, WritingType } from "@/types/api";
import { ACTIVE_WRITING_TYPES, isActiveWritingType } from "../constants/active-writing-types";

const WRITING_TYPE_LABELS: Record<string, string> = {
  [WritingType.SOCIAL_ESSAY]: writingMessages.type.socialEssay,
  [WritingType.CATHOLIC_ESSAY]: writingMessages.type.catholicEssay,
  [WritingType.SHORT_STORY]: writingMessages.type.shortStory,
  [WritingType.ARTICLE]: writingMessages.type.article,
};

/** Lựa chọn thể loại khi tạo bài / lọc / đề gợi ý */
export const writingTypeOptions = ACTIVE_WRITING_TYPES.map((value) => ({
  value,
  label: WRITING_TYPE_LABELS[value],
}));

export const writingStatusOptions = [
  { value: WritingStatus.DRAFT, label: writingMessages.status.draft },
  { value: WritingStatus.PUBLIC, label: writingMessages.status.public },
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
      label: `${getWritingTypeLabel(currentType)} ${writingMessages.type.deprecatedSuffix}`,
    });
  }

  return options;
}

export function getWritingStatusLabel(status: string): string {
  return writingStatusOptions.find((o) => o.value === status)?.label || status;
}
