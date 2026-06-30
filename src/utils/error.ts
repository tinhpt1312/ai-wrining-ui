import type { ApiError } from "@/types/api";
import { getMessageForErrorCode } from "@/messages/errors";
import { commonMessages } from "@/messages/common";
import axios, { type AxiosError } from "axios";

function extractAxiosData(
  error: AxiosError,
): Record<string, unknown> | undefined {
  const data = error.response?.data;
  if (typeof data === "object" && data !== null) {
    return data as Record<string, unknown>;
  }
  return undefined;
}

function extractAxiosMessage(error: AxiosError): string | null {
  const data = extractAxiosData(error);
  const message = data?.message;
  if (Array.isArray(message)) {
    return message.join(", ");
  }
  if (typeof message === "string") {
    return message;
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

export function getApiErrorBody(error: unknown): ApiError | null {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    if (isApiError(data)) {
      return data;
    }
  }
  if (isApiError(error)) {
    return error;
  }
  return null;
}

export function getErrorCode(error: unknown): string | null {
  const body = getApiErrorBody(error);
  if (body?.errorCode) {
    return body.errorCode;
  }

  if (axios.isAxiosError(error)) {
    const data = extractAxiosData(error);
    if (typeof data?.errorCode === "string") {
      return data.errorCode;
    }
  }

  return null;
}

export function getErrorMessage(error: unknown): string {
  const mapped = getMessageForErrorCode(getErrorCode(error));
  if (mapped) {
    return mapped;
  }

  if (axios.isAxiosError(error)) {
    return extractAxiosMessage(error) ?? error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  if (isApiError(error)) {
    return error.message;
  }
  return commonMessages.error.unexpected;
}
