export const profileMessages = {
  loading: "Đang tải hồ sơ...",
  error: {
    title: "Không tải được hồ sơ",
    message: "Không thể lấy thông tin tài khoản.",
  },
  page: {
    description: "Quản lý thông tin tài khoản và bảo mật",
  },
  header: {
    adminBadge: "Admin",
    publicPageButton: "Trang công khai",
    joinedAt: "Tham gia {date}",
    securityBadge: "Bảo mật tài khoản",
  },
  tabs: {
    account: "Thông tin",
    security: "Bảo mật",
  },
  account: {
    title: "Thông tin tài khoản",
    description:
      "Cập nhật tên hiển thị công khai — người khác sẽ thấy trên trang Khám phá khi bạn chia sẻ bài viết.",
    usernameLabel: "Tên đăng nhập",
    emailLabel: "Email",
    fullNameLabel: "Họ và tên",
    fullNamePlaceholder: "Tên hiển thị trên trang công khai (tuỳ chọn)",
    fullNameHelper: "Hiển thị khi bạn chia sẻ bài viết ở chế độ Công khai.",
    saveButton: "Lưu thay đổi",
    successToast: "Đã cập nhật hồ sơ",
  },
  security: {
    title: "Đổi mật khẩu",
    description: "Nhập mật khẩu hiện tại và mật khẩu mới (tối thiểu 6 ký tự).",
    tipsTitle: "Gợi ý bảo mật",
    tip1: "Dùng mật khẩu dài, kết hợp chữ và số.",
    tip2: "Không dùng lại mật khẩu từ dịch vụ khác.",
    tip3: "Đổi mật khẩu nếu nghi ngờ tài khoản bị lộ.",
    currentPasswordLabel: "Mật khẩu hiện tại",
    newPasswordLabel: "Mật khẩu mới",
    confirmPasswordLabel: "Xác nhận mật khẩu mới",
    submitButton: "Đổi mật khẩu",
    successToast: "Đổi mật khẩu thành công",
    confirmMismatch: "Mật khẩu xác nhận không khớp",
    newPasswordMinLength: "Mật khẩu mới phải có ít nhất 6 ký tự",
  },
} as const;
