"use client";

import { useState } from "react";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Textarea } from "@/components/textarea";
import { Select } from "@/components/select";
import { Alert } from "@/components/alert";
import { commonMessages } from "@/messages/common";
import { booksMessages } from "@/messages/books";
import { getWritableTypeOptions } from "@/utils/helpers";
import { getErrorMessage } from "@/utils/helpers";
import {
  BookCategory,
  BookSourceType,
  WritingType,
  type Book,
  type CreateBookPayload,
  type UpdateBookPayload,
} from "@/types/api";

const categoryOptions = Object.values(BookCategory).map((value) => ({
  value,
  label: booksMessages.category[value],
}));

interface AdminBookFormProps {
  initialData?: Book;
  isLoading?: boolean;
  onSubmit: (payload: CreateBookPayload | UpdateBookPayload) => Promise<void>;
  onCancel?: () => void;
}

export function AdminBookForm({
  initialData,
  isLoading = false,
  onSubmit,
  onCancel,
}: AdminBookFormProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: initialData?.title ?? "",
    author: initialData?.author ?? "",
    description: initialData?.description ?? "",
    coverUrl: initialData?.coverUrl ?? "",
    category: initialData?.category ?? BookCategory.VAN_HOC,
    tags: initialData?.tags.join(", ") ?? "",
    externalUrl: initialData?.externalUrl ?? "",
    writingTypes: initialData?.writingTypes ?? [WritingType.SOCIAL_ESSAY],
    readingTimeMinutes: initialData?.readingTimeMinutes?.toString() ?? "",
    isPublic: initialData?.isPublic ?? true,
  });

  const typeOptions = getWritableTypeOptions();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : value,
    }));
  };

  const toggleWritingType = (type: WritingType) => {
    setFormData((prev) => ({
      ...prev,
      writingTypes: prev.writingTypes.includes(type)
        ? prev.writingTypes.filter((item) => item !== type)
        : [...prev.writingTypes, type],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      const payload: CreateBookPayload = {
        title: formData.title.trim(),
        author: formData.author.trim(),
        description: formData.description.trim() || undefined,
        coverUrl: formData.coverUrl.trim() || undefined,
        category: formData.category,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        sourceType: BookSourceType.EXTERNAL_LINK,
        externalUrl: formData.externalUrl.trim() || undefined,
        writingTypes: formData.writingTypes,
        readingTimeMinutes: formData.readingTimeMinutes
          ? Number(formData.readingTimeMinutes)
          : undefined,
        isPublic: formData.isPublic,
      };
      await onSubmit(payload);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="panel-glass p-5 sm:p-6 space-y-4">
      {error ? (
        <Alert
          type="error"
          title={commonMessages.error.title}
          message={error}
          onClose={() => setError(null)}
        />
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label={booksMessages.admin.form.titleLabel}
          name="title"
          placeholder={booksMessages.admin.form.titlePlaceholder}
          value={formData.title}
          onChange={handleChange}
          required
        />
        <Input
          label={booksMessages.admin.form.authorLabel}
          name="author"
          placeholder={booksMessages.admin.form.authorPlaceholder}
          value={formData.author}
          onChange={handleChange}
          required
        />
      </div>

      <Textarea
        label={booksMessages.admin.form.descriptionLabel}
        name="description"
        placeholder={booksMessages.admin.form.descriptionPlaceholder}
        value={formData.description}
        onChange={handleChange}
        rows={4}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label={booksMessages.admin.form.categoryLabel}
          name="category"
          value={formData.category}
          onChange={handleChange}
          options={categoryOptions}
        />
        <Input
          label={booksMessages.admin.form.readingTimeLabel}
          name="readingTimeMinutes"
          type="number"
          min={1}
          value={formData.readingTimeMinutes}
          onChange={handleChange}
        />
      </div>

      <Input
        label={booksMessages.admin.form.externalUrlLabel}
        name="externalUrl"
        placeholder={booksMessages.admin.form.externalUrlPlaceholder}
        value={formData.externalUrl}
        onChange={handleChange}
      />

      <Input
        label={booksMessages.admin.form.tagsLabel}
        name="tags"
        placeholder={booksMessages.admin.form.tagsPlaceholder}
        value={formData.tags}
        onChange={handleChange}
      />

      <div className="space-y-2">
        <p className="text-sm font-medium text-fg">
          {booksMessages.admin.form.writingTypesLabel}
        </p>
        <div className="flex flex-wrap gap-2">
          {typeOptions.map((option) => (
            <Button
              key={option.value}
              type="button"
              size="sm"
              variant={
                formData.writingTypes.includes(option.value as WritingType)
                  ? "solid"
                  : "outline"
              }
              onClick={() => toggleWritingType(option.value as WritingType)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-fg">
        <input
          type="checkbox"
          name="isPublic"
          checked={formData.isPublic}
          onChange={handleChange}
          className="rounded border-border"
        />
        {booksMessages.admin.form.isPublicLabel}
      </label>

      <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
        {onCancel ? (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSaving}
          >
            {booksMessages.admin.form.cancelButton}
          </Button>
        ) : null}
        <Button
          type="submit"
          isLoading={isSaving}
          disabled={isSaving || isLoading}
          className="btn-glow-solid"
        >
          {booksMessages.admin.form.saveButton}
        </Button>
      </div>
    </form>
  );
}
