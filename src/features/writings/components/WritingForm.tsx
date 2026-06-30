"use client";

import React, { useState } from "react";
import { Globe, Lock, PenLine, Type } from "lucide-react";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Textarea } from "@/components/textarea";
import { Select } from "@/components/select";
import { Alert } from "@/components/alert";
import { DocxUploadButton } from "@/features/writings/components/DocxUploadButton";
import { commonMessages } from "@/messages/common";
import { writingsMessages } from "@/messages/writings";
import {
  writingStatusOptions,
  getWritableTypeOptions,
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
  const typeOptions = getWritableTypeOptions(initialData?.type);

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

  const handleDocxParsed = (parsed: {
    title: string;
    content: string;
    fileName: string;
  }) => {
    setFormData((prev) => ({
      ...prev,
      title: prev.title || parsed.title,
      content: parsed.content,
    }));
    setCharCount(parsed.content.length);
    setErrors((prev) => {
      const next = { ...prev };
      delete next.content;
      if (parsed.title) delete next.title;
      return next;
    });
    setError(null);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      {error && (
        <Alert
          type="error"
          title={commonMessages.error.title}
          message={error}
          onClose={() => setError(null)}
        />
      )}

      <div className="panel-glass p-5 sm:p-6 space-y-5">
        <h2 className="text-sm font-semibold text-fg flex items-center gap-2">
          <PenLine className="h-4 w-4 text-primary" />
          {writingsMessages.form.infoSection}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label={writingsMessages.form.titleLabel}
            name="title"
            placeholder={writingsMessages.form.titlePlaceholder}
            value={formData.title}
            onChange={handleChange}
            error={errors.title}
            required
          />

          <Select
            label={writingsMessages.form.typeLabel}
            name="type"
            value={formData.type}
            onChange={handleChange}
            options={typeOptions}
            required
          />
        </div>
      </div>

      <div className="panel-glass p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h2 className="text-sm font-semibold text-fg flex items-center gap-2">
            <Type className="h-4 w-4 text-primary" />
            {writingsMessages.form.contentSection}
          </h2>
          <DocxUploadButton
            onParsed={handleDocxParsed}
            onError={setError}
            disabled={isSaving}
          />
        </div>
        <p className="text-xs text-muted leading-relaxed">
          {writingsMessages.form.contentHelp}
        </p>

        <Textarea
          label={writingsMessages.form.contentLabel}
          name="content"
          placeholder={writingsMessages.form.contentPlaceholder}
          value={formData.content}
          onChange={handleChange}
          error={errors.content}
          charCount={charCount}
          rows={14}
          required
        />
      </div>

      <div className="panel-glass p-5 sm:p-6 space-y-4">
        <h2 className="text-sm font-semibold text-fg flex items-center gap-2">
          {isPublic ? (
            <Globe className="h-4 w-4 text-success" />
          ) : (
            <Lock className="h-4 w-4 text-warning" />
          )}
          {writingsMessages.form.statusSection}
        </h2>

        <Select
          label={writingsMessages.form.statusLabel}
          name="status"
          value={formData.status}
          onChange={handleChange}
          options={writingStatusOptions}
        />
        <p className="text-xs text-muted leading-relaxed">
          {isPublic
            ? writingsMessages.form.statusPublic
            : writingsMessages.form.statusDraft}
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
            {commonMessages.cancel}
          </Button>
        )}
        <Button
          type="submit"
          isLoading={isSaving}
          disabled={isSaving || isLoading}
          className="w-full sm:w-auto btn-glow-solid"
        >
          {isEditing ? writingsMessages.form.updateButton : writingsMessages.form.createButton}
        </Button>
      </div>
    </form>
  );
}
