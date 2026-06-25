import { WritingType } from "@/types/api";

/** Thể loại đang mở — các loại khác phát triển sau */
export const ACTIVE_WRITING_TYPES = [
  WritingType.SOCIAL_ESSAY,
  WritingType.CATHOLIC_ESSAY,
] as const;

export type ActiveWritingType = (typeof ACTIVE_WRITING_TYPES)[number];

export function isActiveWritingType(type: string): type is ActiveWritingType {
  return ACTIVE_WRITING_TYPES.includes(type as ActiveWritingType);
}
