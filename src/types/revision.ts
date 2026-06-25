import type { ListResponse } from "./common";

export type WritingRevisionSource =
  | "manual"
  | "suggestions"
  | "sample"
  | "revision_workspace"
  | "grading_baseline";

export interface WritingRevision {
  id: string;
  writingId: string;
  userId: string;
  content: string;
  source: WritingRevisionSource;
  analysisId?: string | null;
  parentRevisionId?: string | null;
  revisionNumber: number;
  createdAt: string;
}

export interface CreateWritingRevisionPayload {
  content: string;
  source?: WritingRevisionSource;
  analysisId?: string;
  parentRevisionId?: string;
}

export interface EnsureBaselineRevisionPayload {
  analysisId: string;
  content: string;
}

export interface RevisionTimelineItem extends WritingRevision {
  wordCount: number;
  wordCountDelta: number;
}

export type WritingRevisionsListResponse = ListResponse<WritingRevision>;
export type RevisionTimelineResponse = ListResponse<RevisionTimelineItem>;
