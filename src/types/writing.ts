import type { ListResponse } from "./common";
import type { WritingAuthor } from "./user";

export enum WritingType {
  SOCIAL_ESSAY = "BÀI LUẬN XÃ HỘI",
  CATHOLIC_ESSAY = "BÀI LUẬN CÔNG GIÁO",
  SHORT_STORY = "TRUYỆN NGẮN",
  ARTICLE = "BÀI BÁO",
}

export enum WritingStatus {
  DRAFT = "draft",
  PUBLIC = "public",
}

export interface WritingOutlineSection {
  id: string;
  label: string;
  keyPoints: string[];
  hint?: string;
}

export interface WritingOutline {
  title: string;
  sections: WritingOutlineSection[];
}

export interface Writing {
  id: string;
  userId: string;
  title: string;
  content: string;
  type: WritingType;
  status: WritingStatus;
  outlineJson?: WritingOutline | null;
  createdAt: string;
  updatedAt: string;
  author?: WritingAuthor;
}

export interface GenerateOutlinePayload {
  title: string;
  type: WritingType;
  topic?: string;
}

export interface CreateWritingPayload {
  title: string;
  content: string;
  type: WritingType;
  status?: WritingStatus;
  outlineJson?: WritingOutline;
}

export interface UpdateWritingPayload {
  title?: string;
  content?: string;
  type?: WritingType;
  status?: WritingStatus;
  outlineJson?: WritingOutline | null;
}

export interface QueryWritingParams {
  limit?: number;
  offset?: number;
  type?: WritingType;
  status?: WritingStatus;
  search?: string;
}

export type WritingsListResponse = ListResponse<Writing>;

export interface WritingStats {
  totalWritings: number;
  totalWords: number;
  averageLength: number;
  byType: Record<WritingType, number>;
  byStatus: Record<WritingStatus, number>;
}
