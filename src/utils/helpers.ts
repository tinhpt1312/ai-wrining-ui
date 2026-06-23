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
  return "Đã xảy ra lỗi không mong muốn";
}

export function extractAnalysisFeedback(
  feedback: Record<string, unknown> | null | undefined,
): types.AnalysisFeedback {
  if (!feedback) return {};
  const nested = feedback.aiAnalytics;
  if (nested && typeof nested === "object") {
    return nested as types.AnalysisFeedback;
  }
  return feedback as types.AnalysisFeedback;
}

export function getAnalysisSummary(
  feedback: Record<string, unknown> | null | undefined,
): string | undefined {
  return extractAnalysisFeedback(feedback).overallFeedback;
}

export const validationRules = {
  username: {
    required: "Vui lòng nhập tên đăng nhập",
    minLength: {
      value: 3,
      message: "Tên đăng nhập phải có ít nhất 3 ký tự",
    },
    maxLength: {
      value: 50,
      message: "Tên đăng nhập không được quá 50 ký tự",
    },
  },
  email: {
    required: "Vui lòng nhập email",
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Email không hợp lệ",
    },
  },
  password: {
    required: "Vui lòng nhập mật khẩu",
    minLength: {
      value: 6,
      message: "Mật khẩu phải có ít nhất 6 ký tự",
    },
  },
  title: {
    required: "Vui lòng nhập tiêu đề",
    minLength: { value: 3, message: "Tiêu đề phải có ít nhất 3 ký tự" },
    maxLength: { value: 255, message: "Tiêu đề không được quá 255 ký tự" },
  },
  content: {
    required: "Vui lòng nhập nội dung",
    minLength: { value: 10, message: "Nội dung phải có ít nhất 10 ký tự" },
  },
};

export const writingTypeOptions = [
  { value: types.WritingType.SOCIAL_ESSAY, label: "Bài Luận Xã Hội" },
  { value: types.WritingType.CATHOLIC_ESSAY, label: "Bài Luận Công Giáo" },
  { value: types.WritingType.SHORT_STORY, label: "Truyện Ngắn" },
  { value: types.WritingType.ARTICLE, label: "Bài Báo" },
];

export const writingStatusOptions = [
  { value: types.WritingStatus.DRAFT, label: "Bản Nháp" },
  { value: types.WritingStatus.PUBLIC, label: "Công Khai" },
];

export function getWritingTypeLabel(type: string): string {
  return writingTypeOptions.find((o) => o.value === type)?.label || type;
}

export function getWritingStatusLabel(status: string): string {
  return writingStatusOptions.find((o) => o.value === status)?.label || status;
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleDateString("vi-VN", {
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
  return `${readingTimeMinutes} phút đọc`;
}
