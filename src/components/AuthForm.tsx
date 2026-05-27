"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/States";
import { useAuth } from "@/context/AuthContext";
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

    // Username validation
    if (!formData.username) {
      newErrors.username = validationRules.username.required;
    } else if (formData.username.length < 3) {
      newErrors.username = validationRules.username.minLength.message;
    }

    // Email validation (for register)
    if (mode === "register") {
      if (!formData.email) {
        newErrors.email = validationRules.email.required;
      } else if (!validationRules.email.pattern.value.test(formData.email)) {
        newErrors.email = validationRules.email.pattern.message;
      }
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = validationRules.password.required;
    } else if (formData.password.length < 6) {
      newErrors.password = validationRules.password.minLength.message;
    }

    // Confirm password validation (for register)
    if (mode === "register" && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
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
    // Clear error for this field when user starts typing
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
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto space-y-4">
      {error && (
        <Alert
          type="error"
          title="Authentication Error"
          message={error}
          onClose={() => setError(null)}
        />
      )}

      <Input
        label="Username"
        name="username"
        placeholder="Enter your username"
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
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          required
        />
      )}

      <Input
        label="Password"
        name="password"
        type="password"
        placeholder="Enter your password"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
        required
      />

      {isRegister && (
        <Input
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          placeholder="Confirm your password"
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
        {isRegister ? "Create Account" : "Sign In"}
      </Button>
    </form>
  );
}
