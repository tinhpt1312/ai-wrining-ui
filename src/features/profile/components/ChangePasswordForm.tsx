"use client";

import { useState } from "react";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Alert } from "@/components";
import { toast } from "@/lib/toast";
import { getErrorMessage } from "@/utils/helpers";
import { useChangePassword } from "../hooks/useProfileApi";

export function ChangePasswordForm() {
  const changePassword = useChangePassword();
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    if (formData.newPassword.length < 6) {
      setError("Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }

    try {
      await changePassword.mutateAsync({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      toast.success("Đổi mật khẩu thành công");
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert type="error" title="Lỗi" message={error} onClose={() => setError(null)} />
      )}

      <Input
        label="Mật khẩu hiện tại"
        name="currentPassword"
        type="password"
        value={formData.currentPassword}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, currentPassword: e.target.value }))
        }
        required
      />
      <Input
        label="Mật khẩu mới"
        name="newPassword"
        type="password"
        value={formData.newPassword}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, newPassword: e.target.value }))
        }
        required
      />
      <Input
        label="Xác nhận mật khẩu mới"
        name="confirmPassword"
        type="password"
        value={formData.confirmPassword}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))
        }
        required
      />

      <div className="flex justify-end pt-2">
        <Button type="submit" isLoading={changePassword.isPending}>
          Đổi mật khẩu
        </Button>
      </div>
    </form>
  );
}
