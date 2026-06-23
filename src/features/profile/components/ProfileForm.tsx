"use client";

import { useState } from "react";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Alert } from "@/components";
import { toast } from "@/lib/toast";
import { getErrorMessage } from "@/utils/helpers";
import { useUpdateProfile } from "../hooks/useProfileApi";
import type { User } from "@/types/api";

export function ProfileForm({
  user,
  onUpdated,
}: {
  user: User;
  onUpdated?: (user: User) => void;
}) {
  const updateProfile = useUpdateProfile();
  const [formData, setFormData] = useState({
    username: user.username || "",
    email: user.email || "",
    fullName: user.fullName || "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const updated = await updateProfile.mutateAsync({
        username: formData.username,
        email: formData.email,
        fullName: formData.fullName,
      });
      onUpdated?.(updated);
      toast.success("Đã cập nhật hồ sơ");
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert type="error" title="Lỗi" message={error} onClose={() => setError(null)} />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Tên đăng nhập"
          name="username"
          value={formData.username}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, username: e.target.value }))
          }
          required
        />
        <Input
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, email: e.target.value }))
          }
        />
      </div>
      <Input
        label="Họ và tên"
        name="fullName"
        value={formData.fullName}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, fullName: e.target.value }))
        }
        placeholder="Tên hiển thị trên trang công khai (tuỳ chọn)"
        helperText="Hiển thị khi bạn chia sẻ bài viết ở chế độ Công khai."
      />

      <div className="flex justify-end pt-2">
        <Button type="submit" isLoading={updateProfile.isPending}>
          Lưu thay đổi
        </Button>
      </div>
    </form>
  );
}
