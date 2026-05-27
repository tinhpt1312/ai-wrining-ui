"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Alert } from "@/components/ui/States";
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
    type: initialData?.type || types.WritingType.JOURNAL,
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

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      {error && (
        <Alert
          type="error"
          title="Error"
          message={error}
          onClose={() => setError(null)}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Title"
          name="title"
          placeholder="Enter writing title"
          value={formData.title}
          onChange={handleChange}
          error={errors.title}
          required
        />

        <Select
          label="Type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          options={writingTypeOptions}
          required
        />
      </div>

      <Textarea
        label="Content"
        name="content"
        placeholder="Write your content here..."
        value={formData.content}
        onChange={handleChange}
        error={errors.content}
        charCount={charCount}
        rows={12}
        required
      />

      <Select
        label="Status"
        name="status"
        value={formData.status}
        onChange={handleChange}
        options={writingStatusOptions}
      />

      <div className="flex gap-4 justify-end">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSaving}
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          isLoading={isSaving}
          disabled={isSaving || isLoading}
        >
          {isEditing ? "Update Writing" : "Create Writing"}
        </Button>
      </div>
    </form>
  );
}
