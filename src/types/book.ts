import type { ListResponse } from "./common";
import type { WritingType } from "./writing";

export enum BookCategory {
  VAN_HOC = "van_hoc",
  TRIET_HOC = "triet_hoc",
  DAO_DUC = "dao_duc",
  CONG_GIAO = "cong_giao",
  XA_HOI = "xa_hoi",
  GIAO_DUC = "giao_duc",
  KHAC = "khac",
}

export enum BookSourceType {
  EXTERNAL_LINK = "external_link",
  PUBLIC_DOMAIN = "public_domain",
  ADMIN_UPLOAD = "admin_upload",
  USER_UPLOAD = "user_upload",
}

export enum BookApprovalStatus {
  APPROVED = "approved",
  PENDING = "pending",
  REJECTED = "rejected",
}

export enum BookFileFormat {
  DOCX = "docx",
  EPUB = "epub",
  PDF = "pdf",
}

export interface Book {
  id: string;
  title: string;
  author: string;
  description?: string | null;
  coverUrl?: string | null;
  category: BookCategory;
  tags: string[];
  sourceType: BookSourceType;
  externalUrl?: string | null;
  writingTypes: WritingType[];
  readingTimeMinutes?: number | null;
  isPublic: boolean;
  totalChapters: number;
  approvalStatus: BookApprovalStatus;
  uploadedByUserId?: string | null;
  fileFormat?: BookFileFormat | string | null;
  rejectionReason?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BookChapterSummary {
  id: string;
  bookId: string;
  orderIndex: number;
  title: string;
  wordCount?: number | null;
}

export interface BookChapter extends BookChapterSummary {
  content: string;
  contentFormat: "html" | "plain";
  createdAt: string;
  updatedAt: string;
}

export interface UserBookProgress {
  id: string;
  userId: string;
  bookId: string;
  currentChapterId?: string | null;
  scrollOffset: number;
  percentComplete: number;
  lastReadAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateBookProgressPayload {
  chapterId: string;
  scrollOffset?: number;
  percentComplete?: number;
}

export interface BookIngestResult {
  chapterCount: number;
  readingTimeMinutes: number;
}

export interface BookUploadResult {
  book: Book;
  chapterCount: number;
  readingTimeMinutes: number;
}

export interface UploadBookPayload {
  title: string;
  author: string;
  description?: string;
  coverUrl?: string;
  category: BookCategory;
  tags?: string[];
  writingTypes?: WritingType[];
  file: File;
}

export interface RejectBookPayload {
  reason?: string;
}

export interface QueryBookParams {
  limit?: number;
  offset?: number;
  category?: BookCategory;
  writingType?: WritingType;
  search?: string;
  includePrivate?: boolean;
}

export type BooksListResponse = ListResponse<Book>;

export interface CreateBookPayload {
  title: string;
  author: string;
  description?: string;
  coverUrl?: string;
  category: BookCategory;
  tags?: string[];
  sourceType?: BookSourceType;
  externalUrl?: string;
  writingTypes?: WritingType[];
  readingTimeMinutes?: number;
  isPublic?: boolean;
}

export type UpdateBookPayload = Partial<CreateBookPayload>;

export interface RecommendBooksPayload {
  writingType: WritingType;
  topic?: string;
  draftExcerpt?: string;
  count?: number;
}

export interface BookRecommendation {
  bookId: string;
  title: string;
  author: string;
  reason: string;
  relevanceScore: number;
  suggestedEssayPrompt: string;
  readingTimeMinutes?: number | null;
}
