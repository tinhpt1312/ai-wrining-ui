import { ERROR_CODE } from "@/constants/error-codes.constants";
import { authMessages } from "@/messages/auth";
import { getMessageForErrorCode } from "@/messages/errors";
import { getErrorCode, getErrorMessage } from "@/utils/error";

export interface AuthFieldErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const AUTH_USERNAME_FIELD_CODES = new Set<string>([ERROR_CODE.USERNAME_EXISTS]);

const AUTH_EMAIL_FIELD_CODES = new Set<string>([
  ERROR_CODE.EMAIL_ALREADY_USED,
  ERROR_CODE.EMAIL_REQUIRED,
  ERROR_CODE.EMAIL_INVALID,
]);

const AUTH_PASSWORD_FIELD_CODES = new Set<string>([
  ERROR_CODE.PASSWORD_REQUIRED,
  ERROR_CODE.PASSWORD_TOO_SHORT,
  ERROR_CODE.INVALID_CREDENTIALS,
]);

export function mapAuthApiError(
  error: unknown,
  mode: "login" | "register",
): { fieldErrors: AuthFieldErrors; generalError: string | null } {
  const errorCode = getErrorCode(error);
  const fieldErrors: AuthFieldErrors = {};

  if (errorCode === ERROR_CODE.INVALID_CREDENTIALS) {
    fieldErrors.password = authMessages.error.wrongPassword;
    return { fieldErrors, generalError: null };
  }

  if (errorCode === ERROR_CODE.ACCOUNT_DEACTIVATED) {
    return {
      fieldErrors,
      generalError:
        getMessageForErrorCode(errorCode) ??
        getErrorMessage(error),
    };
  }

  if (errorCode && AUTH_USERNAME_FIELD_CODES.has(errorCode)) {
    fieldErrors.username =
      getMessageForErrorCode(errorCode) ?? getErrorMessage(error);
    return { fieldErrors, generalError: null };
  }

  if (errorCode && AUTH_EMAIL_FIELD_CODES.has(errorCode)) {
    fieldErrors.email =
      getMessageForErrorCode(errorCode) ?? getErrorMessage(error);
    return { fieldErrors, generalError: null };
  }

  if (
    mode === "register" &&
    errorCode &&
    AUTH_PASSWORD_FIELD_CODES.has(errorCode)
  ) {
    fieldErrors.password =
      getMessageForErrorCode(errorCode) ?? getErrorMessage(error);
    return { fieldErrors, generalError: null };
  }

  return { fieldErrors, generalError: getErrorMessage(error) };
}
