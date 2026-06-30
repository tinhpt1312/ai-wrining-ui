import { validationMessages } from "@/messages/validation";

export const validationRules = {
  username: {
    required: validationMessages.username.required,
    minLength: {
      value: 3,
      message: validationMessages.username.minLength,
    },
    maxLength: {
      value: 50,
      message: validationMessages.username.maxLength,
    },
  },
  email: {
    required: validationMessages.email.required,
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: validationMessages.email.invalid,
    },
  },
  password: {
    required: validationMessages.password.required,
    minLength: {
      value: 6,
      message: validationMessages.password.minLength,
    },
  },
  title: {
    required: validationMessages.title.required,
    minLength: { value: 3, message: validationMessages.title.minLength },
    maxLength: { value: 255, message: validationMessages.title.maxLength },
  },
  content: {
    required: validationMessages.content.required,
    minLength: { value: 10, message: validationMessages.content.minLength },
  },
};
