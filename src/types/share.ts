import type { WritingAuthor } from "./user";

export interface PublicShareWriting {
  id: string;
  title: string;
  content: string;
  type: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  author: WritingAuthor;
}

export interface PublicShareAnalysis {
  id: string;
  writingId: string;
  feedbackJson: Record<string, unknown> | null;
  createdAt: string;
  writing: {
    id: string;
    title: string;
    content: string;
    type: string;
    author: WritingAuthor;
  };
}
