import { getErrorMessage } from "@/utils/error";

export interface AuthFieldErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export function mapAuthApiError(
  error: unknown,
  mode: "login" | "register",
): { fieldErrors: AuthFieldErrors; generalError: string | null } {
  const message = getErrorMessage(error);
  const fieldErrors: AuthFieldErrors = {};

  if (
    message.includes("Tên đăng nhập hoặc mật khẩu không đúng") ||
    message.includes("mật khẩu không đúng")
  ) {
    fieldErrors.password = "Mật khẩu không đúng. Vui lòng nhập lại.";
    return { fieldErrors, generalError: null };
  }

  if (message.includes("Tài khoản đã bị vô hiệu hóa")) {
    return { fieldErrors, generalError: message };
  }

  if (message.includes("Tên đăng nhập đã tồn tại")) {
    fieldErrors.username = message;
    return { fieldErrors, generalError: null };
  }

  if (message.includes("Email đã được sử dụng")) {
    fieldErrors.email = message;
    return { fieldErrors, generalError: null };
  }

  if (mode === "register") {
    const lower = message.toLowerCase();
    if (lower.includes("email")) {
      fieldErrors.email = message;
      return { fieldErrors, generalError: null };
    }
    if (lower.includes("mật khẩu")) {
      fieldErrors.password = message;
      return { fieldErrors, generalError: null };
    }
  }

  return { fieldErrors, generalError: message };
}
