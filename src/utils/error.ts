import type { ApiError } from "@/types/api";
import axios, { type AxiosError } from "axios";

function extractAxiosMessage(error: AxiosError): string | null {
  const data = error.response?.data as
    | { message?: string | string[] }
    | undefined;
  if (Array.isArray(data?.message)) {
    return data.message.join(", ");
  }
  if (typeof data?.message === "string") {
    return data.message;
  }
  return null;
}

export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === "object" &&
    error !== null &&
    "statusCode" in error &&
    "message" in error
  );
}

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return extractAxiosMessage(error) ?? error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  if (isApiError(error)) {
    return error.message;
  }
  return "Đã xảy ra lỗi không mong muốn";
}
