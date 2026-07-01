import { ERROR_CODE, type ErrorCode } from "@/constants/error-codes.constants";
import { authMessages } from "./auth";
import { validationMessages } from "./validation";

/** Vietnamese UI messages keyed by API errorCode. */
export const errorMessages: Record<ErrorCode, string> = {
  [ERROR_CODE.VALIDATION_FAILED]:
    "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.",

  [ERROR_CODE.USERNAME_EXISTS]: "Tên đăng nhập đã tồn tại",
  [ERROR_CODE.EMAIL_ALREADY_USED]: "Email đã được sử dụng",
  [ERROR_CODE.EMAIL_REQUIRED]: validationMessages.email.required,
  [ERROR_CODE.EMAIL_INVALID]: validationMessages.email.invalid,
  [ERROR_CODE.PASSWORD_REQUIRED]: validationMessages.password.required,
  [ERROR_CODE.PASSWORD_TOO_SHORT]: validationMessages.password.minLength,
  [ERROR_CODE.INVALID_CREDENTIALS]:
    "Tên đăng nhập hoặc mật khẩu không đúng",
  [ERROR_CODE.ACCOUNT_DEACTIVATED]: "Tài khoản đã bị vô hiệu hóa",
  [ERROR_CODE.TOKEN_INVALID]: "Phiên đăng nhập không hợp lệ hoặc đã hết hạn",
  [ERROR_CODE.ACCESS_DENIED]: "Bạn không có quyền truy cập",
  [ERROR_CODE.FORBIDDEN_OPERATION]:
    "Bạn không có quyền thực hiện thao tác này",

  [ERROR_CODE.USER_NOT_FOUND]: "Không tìm thấy người dùng",
  [ERROR_CODE.CANNOT_CHANGE_PASSWORD]: "Không thể đổi mật khẩu",
  [ERROR_CODE.CURRENT_PASSWORD_WRONG]: authMessages.error.wrongPassword,

  [ERROR_CODE.USER_ID_REQUIRED]: "Thiếu mã người dùng",
  [ERROR_CODE.WRITING_ID_REQUIRED]: "Thiếu mã bài viết",
  [ERROR_CODE.ANALYTICS_ID_REQUIRED]: "Thiếu mã phân tích",
  [ERROR_CODE.WRITING_IDS_REQUIRED]: "Thiếu danh sách mã bài viết",

  [ERROR_CODE.WRITING_NOT_FOUND]: "Không tìm thấy bài viết",
  [ERROR_CODE.WRITING_ACCESS_DENIED]:
    "Bạn không có quyền xem bài viết này",
  [ERROR_CODE.WRITING_TYPE_NOT_SUPPORTED]:
    "Loại bài viết này chưa được hỗ trợ",
  [ERROR_CODE.OUTLINE_GENERATION_FAILED]:
    "Không thể tạo dàn ý. Vui lòng thử lại sau",
  [ERROR_CODE.PROMPT_GENERATION_FAILED]:
    "Không thể tạo gợi ý viết. Vui lòng thử lại sau",

  [ERROR_CODE.ANALYTICS_NOT_FOUND]: "Không tìm thấy kết quả phân tích",
  [ERROR_CODE.ANALYTICS_ACCESS_DENIED]:
    "Bạn không có quyền truy cập phân tích này",
  [ERROR_CODE.ANALYTICS_EXPORT_NO_DATA]:
    "Không có dữ liệu để xuất. Vui lòng chạy phân tích AI lại",
  [ERROR_CODE.TOKEN_LIMIT_EXCEEDED]:
    "Đã vượt giới hạn token trong ngày",
  [ERROR_CODE.AI_ANALYSIS_FAILED]: "Phân tích AI thất bại",
  [ERROR_CODE.AI_INVALID_RESPONSE]:
    "Phân tích AI thất bại do phản hồi không hợp lệ",

  [ERROR_CODE.REVISION_NOT_FOUND]: "Không tìm thấy bản chỉnh sửa",

  [ERROR_CODE.SUGGESTION_NOT_FOUND]: "Không tìm thấy gợi ý",
  [ERROR_CODE.ANALYSIS_NOT_FOUND]: "Không tìm thấy phân tích",
  [ERROR_CODE.NO_SUGGESTIONS_IN_REPORT]:
    "Không có gợi ý trong báo cáo phân tích",

  [ERROR_CODE.WRITING_NOT_PUBLIC]: "Bài viết chưa được đặt ở chế độ công khai",
  [ERROR_CODE.RELATED_WRITING_NOT_FOUND]: "Không tìm thấy bài viết liên quan",

  [ERROR_CODE.FILE_REQUIRED]: "Vui lòng chọn tệp để tải lên",
  [ERROR_CODE.FILE_TOO_LARGE]: "Tệp quá lớn. Dung lượng tối đa là 5MB",
  [ERROR_CODE.DOC_LEGACY_NOT_SUPPORTED]:
    "Không hỗ trợ tệp .doc cũ. Vui lòng lưu dưới dạng .docx",
  [ERROR_CODE.FILE_TYPE_DOCX_ONLY]: "Chỉ hỗ trợ tệp .docx",
  [ERROR_CODE.FILE_INVALID_MIME]:
    "Định dạng tệp không hợp lệ. Vui lòng tải lên tệp .docx",
  [ERROR_CODE.FILE_EMPTY_OR_CORRUPT]:
    "Không đọc được nội dung tệp. Tệp có thể trống hoặc bị hỏng",

  [ERROR_CODE.BOOK_NOT_FOUND]: "Không tìm thấy sách",
  [ERROR_CODE.BOOK_RECOMMENDATION_FAILED]:
    "Không thể gợi ý sách. Vui lòng thử lại sau",
  [ERROR_CODE.BOOK_CATALOG_EMPTY]:
    "Thư viện sách đang trống. Liên hệ quản trị viên",

  [ERROR_CODE.CHAPTER_NOT_FOUND]: "Không tìm thấy chương",
  [ERROR_CODE.BOOK_NO_CHAPTERS]:
    "Sách này chưa có nội dung đọc online. Admin cần upload file.",
  [ERROR_CODE.BOOK_INGEST_FAILED]:
    "Không thể import nội dung sách. Vui lòng thử lại",
  [ERROR_CODE.UNSUPPORTED_BOOK_FORMAT]:
    "Định dạng không hỗ trợ. Chỉ chấp nhận file .docx",
  [ERROR_CODE.BOOK_FILE_TOO_LARGE]:
    "File quá lớn. Dung lượng tối đa là 15MB",

  [ERROR_CODE.EXPORT_ACCESS_DENIED]:
    "Bạn không có quyền xuất bài viết này",

  [ERROR_CODE.AI_SUGGESTION_GENERATION_FAILED]:
    "Không thể tạo gợi ý sửa bài",
  [ERROR_CODE.GEMINI_EMPTY_RESPONSE]: "AI không trả về nội dung",
  [ERROR_CODE.GEMINI_RATE_LIMITED]:
    "Đã hết hạn mức Gemini. Vui lòng đợi vài phút hoặc thử lại sau",
  [ERROR_CODE.GEMINI_MODEL_NOT_FOUND]:
    "Không tìm thấy model Gemini. Liên hệ quản trị viên",
  [ERROR_CODE.GEMINI_API_KEY_INVALID]:
    "Cấu hình API Gemini không hợp lệ. Liên hệ quản trị viên",
  [ERROR_CODE.GEMINI_SERVICE_UNAVAILABLE]:
    "Dịch vụ AI tạm thời không khả dụng",
  [ERROR_CODE.TOKEN_LIMIT_CHECK_FAILED]:
    "Không thể kiểm tra hạn mức token",
};

export function getMessageForErrorCode(
  code: string | null | undefined,
): string | null {
  if (!code) return null;
  if (code in errorMessages) {
    return errorMessages[code as ErrorCode];
  }
  return null;
}
