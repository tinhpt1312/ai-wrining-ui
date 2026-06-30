import { commonMessages } from "@/messages/common";
import { msg } from "@/messages/format";

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
  return msg(commonMessages.readingTime, { minutes: readingTimeMinutes });
}
