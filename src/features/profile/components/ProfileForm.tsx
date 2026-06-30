"use client";

import { useState } from "react";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Alert } from "@/components/alert";
import { toast } from "@/lib/toast";
import { getErrorMessage } from "@/utils/helpers";
import { commonMessages } from "@/messages/common";
import { profileMessages } from "@/messages/profile";
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
      toast.success(profileMessages.account.successToast);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert
          type="error"
          title={commonMessages.error.title}
          message={error}
          onClose={() => setError(null)}
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label={profileMessages.account.usernameLabel}
          name="username"
          value={formData.username}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, username: e.target.value }))
          }
          required
        />
        <Input
          label={profileMessages.account.emailLabel}
          name="email"
          type="email"
          value={formData.email}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, email: e.target.value }))
          }
        />
      </div>
      <Input
        label={profileMessages.account.fullNameLabel}
        name="fullName"
        value={formData.fullName}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, fullName: e.target.value }))
        }
        placeholder={profileMessages.account.fullNamePlaceholder}
        helperText={profileMessages.account.fullNameHelper}
      />

      <div className="flex justify-end pt-2">
        <Button type="submit" isLoading={updateProfile.isPending}>
          {profileMessages.account.saveButton}
        </Button>
      </div>
    </form>
  );
}
