export const validationMessages = {
  username: {
    required: "Vui lòng nhập tên đăng nhập",
    minLength: "Tên đăng nhập phải có ít nhất 3 ký tự",
    maxLength: "Tên đăng nhập không được quá 50 ký tự",
  },
  email: {
    required: "Vui lòng nhập email",
    invalid: "Email không hợp lệ",
  },
  password: {
    required: "Vui lòng nhập mật khẩu",
    minLength: "Mật khẩu phải có ít nhất 6 ký tự",
  },
  title: {
    required: "Vui lòng nhập tiêu đề",
    minLength: "Tiêu đề phải có ít nhất 3 ký tự",
    maxLength: "Tiêu đề không được quá 255 ký tự",
  },
  content: {
    required: "Vui lòng nhập nội dung",
    minLength: "Nội dung phải có ít nhất 10 ký tự",
  },
} as const;
