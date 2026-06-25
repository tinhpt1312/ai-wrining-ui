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
