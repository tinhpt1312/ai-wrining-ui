"use client";

import React, { useState } from "react";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Alert } from "@/components/alert";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage, validationRules } from "@/utils/helpers";
import type * as types from "@/types/api";

interface AuthFormProps {
  mode: "login" | "register";
  onSuccess?: () => void;
}

export function AuthForm({ mode, onSuccess }: AuthFormProps) {
  const { login, register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.username) {
      newErrors.username = validationRules.username.required;
    } else if (formData.username.length < 3) {
      newErrors.username = validationRules.username.minLength.message;
    }

    if (mode === "register") {
      if (!formData.email) {
        newErrors.email = validationRules.email.required;
      } else if (!validationRules.email.pattern.value.test(formData.email)) {
        newErrors.email = validationRules.email.pattern.message;
      }
    }

    if (!formData.password) {
      newErrors.password = validationRules.password.required;
    } else if (formData.password.length < 6) {
      newErrors.password = validationRules.password.minLength.message;
    }

    if (mode === "register" && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (mode === "login") {
        await login({
          username: formData.username,
          password: formData.password,
        } as types.LoginPayload);
      } else {
        await register({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        } as types.RegisterPayload);
      }
      onSuccess?.();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const isRegister = mode === "register";

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-5">
      {error && (
        <Alert
          type="error"
          title="Lỗi xác thực"
          message={error}
          onClose={() => setError(null)}
        />
      )}

      <Input
        label="Tên đăng nhập"
        name="username"
        placeholder="Nhập tên đăng nhập"
        value={formData.username}
        onChange={handleChange}
        error={errors.username}
        required
      />

      {isRegister && (
        <Input
          label="Email"
          name="email"
          type="email"
          placeholder="Nhập email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          required
        />
      )}

      <Input
        label="Mật khẩu"
        name="password"
        type="password"
        placeholder="Nhập mật khẩu"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
        required
      />

      {isRegister && (
        <Input
          label="Xác nhận mật khẩu"
          name="confirmPassword"
          type="password"
          placeholder="Nhập lại mật khẩu"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          required
        />
      )}

      <Button
        type="submit"
        className="w-full"
        isLoading={isLoading}
        disabled={isLoading}
      >
        {isRegister ? "Tạo tài khoản" : "Đăng nhập"}
      </Button>
    </form>
  );
}
