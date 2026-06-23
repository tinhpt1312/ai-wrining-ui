"use client";

import React, { useState } from "react";
import { Globe, Lock, PenLine, Type } from "lucide-react";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Textarea } from "@/components/textarea";
import { Select } from "@/components/select";
import { Alert } from "@/components";
import {
  writingTypeOptions,
  writingStatusOptions,
  validationRules,
  getErrorMessage,
} from "@/utils/helpers";
import * as types from "@/types/api";

interface WritingFormProps {
  initialData?: types.Writing;
  isLoading?: boolean;
  onSubmit: (
    data: types.CreateWritingPayload | types.UpdateWritingPayload,
  ) => Promise<void>;
  onCancel?: () => void;
}

export function WritingForm({
  initialData,
  isLoading = false,
  onSubmit,
  onCancel,
}: WritingFormProps) {
  const isEditing = !!initialData;
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [charCount, setCharCount] = useState(initialData?.content.length || 0);
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    content: initialData?.content || "",
    type: initialData?.type || types.WritingType.SOCIAL_ESSAY,
    status: initialData?.status || types.WritingStatus.DRAFT,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title) {
      newErrors.title = validationRules.title.required;
    } else if (formData.title.length < 3) {
      newErrors.title = validationRules.title.minLength.message;
    } else if (formData.title.length > 255) {
      newErrors.title = validationRules.title.maxLength.message;
    }

    if (!formData.content) {
      newErrors.content = validationRules.content.required;
    } else if (formData.content.length < 10) {
      newErrors.content = validationRules.content.minLength.message;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const payload = {
        title: formData.title,
        content: formData.content,
        type: formData.type as types.WritingType,
        status: formData.status as types.WritingStatus,
      };

      await onSubmit(payload);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "content") {
      setCharCount(value.length);
    }

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const isPublic = formData.status === types.WritingStatus.PUBLIC;

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      {error && (
        <Alert
          type="error"
          title="Lỗi"
          message={error}
          onClose={() => setError(null)}
        />
      )}

      <div className="card-elevated p-5 sm:p-6 space-y-5">
        <h2 className="text-sm font-semibold text-fg flex items-center gap-2">
          <PenLine className="h-4 w-4 text-primary" />
          Thông tin bài viết
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Tiêu đề"
            name="title"
            placeholder="Nhập tiêu đề bài viết"
            value={formData.title}
            onChange={handleChange}
            error={errors.title}
            required
          />

          <Select
            label="Loại bài"
            name="type"
            value={formData.type}
            onChange={handleChange}
            options={writingTypeOptions}
            required
          />
        </div>
      </div>

      <div className="card-elevated p-5 sm:p-6 space-y-4">
        <h2 className="text-sm font-semibold text-fg flex items-center gap-2">
          <Type className="h-4 w-4 text-primary" />
          Nội dung
        </h2>

        <Textarea
          label="Nội dung bài viết"
          name="content"
          placeholder="Viết nội dung bài của bạn tại đây..."
          value={formData.content}
          onChange={handleChange}
          error={errors.content}
          charCount={charCount}
          rows={14}
          required
        />
      </div>

      <div className="card-elevated p-5 sm:p-6 space-y-4">
        <h2 className="text-sm font-semibold text-fg flex items-center gap-2">
          {isPublic ? (
            <Globe className="h-4 w-4 text-success" />
          ) : (
            <Lock className="h-4 w-4 text-warning" />
          )}
          Trạng thái chia sẻ
        </h2>

        <Select
          label="Trạng thái"
          name="status"
          value={formData.status}
          onChange={handleChange}
          options={writingStatusOptions}
        />
        <p className="text-xs text-muted leading-relaxed">
          {isPublic
            ? "Công khai — người dùng khác có thể xem trên trang Khám phá."
            : "Bản nháp — chỉ bạn mới xem được bài viết này."}
        </p>
      </div>

      <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSaving}
            className="w-full sm:w-auto"
          >
            Hủy
          </Button>
        )}
        <Button
          type="submit"
          isLoading={isSaving}
          disabled={isSaving || isLoading}
          className="w-full sm:w-auto"
        >
          {isEditing ? "Cập nhật bài viết" : "Tạo bài viết"}
        </Button>
      </div>
    </form>
  );
}
