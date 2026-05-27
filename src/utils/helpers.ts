import * as types from "@/types/api";

export function isApiError(error: unknown): error is types.ApiError {
  return (
    typeof error === "object" &&
    error !== null &&
    "statusCode" in error &&
    "message" in error
  );
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (isApiError(error)) {
    return error.message;
  }
  return "An unexpected error occurred";
}

export const validationRules = {
  username: {
    required: "Username is required",
    minLength: { value: 3, message: "Username must be at least 3 characters" },
    maxLength: { value: 50, message: "Username must not exceed 50 characters" },
  },
  email: {
    required: "Email is required",
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Please enter a valid email",
    },
  },
  password: {
    required: "Password is required",
    minLength: {
      value: 6,
      message: "Password must be at least 6 characters",
    },
  },
  title: {
    required: "Title is required",
    minLength: { value: 3, message: "Title must be at least 3 characters" },
    maxLength: { value: 255, message: "Title must not exceed 255 characters" },
  },
  content: {
    required: "Content is required",
    minLength: { value: 10, message: "Content must be at least 10 characters" },
  },
};

export const writingTypeOptions = [
  { value: types.WritingType.JOURNAL, label: "Journal" },
  { value: types.WritingType.BLOG_POST, label: "Blog Post" },
  { value: types.WritingType.ARTICLE, label: "Article" },
  { value: types.WritingType.SHORT_STORY, label: "Short Story" },
  { value: types.WritingType.SOCIAL_ESSAY, label: "Social Essay" },
];

export const writingStatusOptions = [
  { value: types.WritingStatus.DRAFT, label: "Draft" },
  { value: types.WritingStatus.IN_PROGRESS, label: "In Progress" },
  { value: types.WritingStatus.COMPLETED, label: "Completed" },
  { value: types.WritingStatus.ARCHIVED, label: "Archived" },
];

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

export function wordCount(text: string): number {
  return text.trim().split(/\s+/).length;
}

export function estimateReadingTime(text: string): string {
  const words = wordCount(text);
  const readingTimeMinutes = Math.ceil(words / 200);
  return `${readingTimeMinutes} min read`;
}
