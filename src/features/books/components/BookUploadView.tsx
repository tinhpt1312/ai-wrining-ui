"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Upload, BookOpen, Trash2 } from "lucide-react";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Textarea } from "@/components/textarea";
import { Select } from "@/components/select";
import { Alert } from "@/components/alert";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/badge";
import { Loading } from "@/components/loading";
import { EmptyState } from "@/components/empty-state";
import { useConfirmDialog } from "@/components/confirm-dialog";
import { useMyUploads, useUploadBook, useDeleteBook } from "../hooks/useBooksApi";
import { booksMessages } from "@/messages/books";
import { commonMessages } from "@/messages/common";
import { msg } from "@/messages/format";
import { getErrorMessage, getWritableTypeOptions } from "@/utils/helpers";
import { toast } from "@/lib/toast";
import { ROUTES } from "@/constants/routes.constants";
import {
  BookApprovalStatus,
  BookCategory,
  WritingType,
} from "@/types/api";

const categoryOptions = Object.values(BookCategory).map((value) => ({
  value,
  label: booksMessages.category[value],
}));

const approvalBadge = {
  [BookApprovalStatus.PENDING]: {
    label: booksMessages.upload.statusPending,
    variant: "warning" as const,
  },
  [BookApprovalStatus.APPROVED]: {
    label: booksMessages.upload.statusApproved,
    variant: "success" as const,
  },
  [BookApprovalStatus.REJECTED]: {
    label: booksMessages.upload.statusRejected,
    variant: "error" as const,
  },
};

export function BookUploadView() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const upload = useUploadBook();
  const deleteBook = useDeleteBook();
  const { confirm, ConfirmDialog } = useConfirmDialog();
  const { data: myUploadsData, isLoading: isLoadingUploads } = useMyUploads({
    limit: 20,
  });
  const typeOptions = getWritableTypeOptions();

  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    coverUrl: "",
    category: BookCategory.VAN_HOC,
    tags: "",
    writingTypes: [WritingType.SOCIAL_ESSAY] as WritingType[],
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleWritingType = (type: WritingType) => {
    setFormData((prev) => ({
      ...prev,
      writingTypes: prev.writingTypes.includes(type)
        ? prev.writingTypes.filter((item) => item !== type)
        : [...prev.writingTypes, type],
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setSelectedFile(file);
    if (file && !formData.title) {
      const baseName = file.name.replace(/\.[^.]+$/, "");
      setFormData((prev) => ({ ...prev, title: baseName }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedFile) {
      setError(booksMessages.upload.fileLabel);
      return;
    }

    try {
      const tags = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);

      const result = await upload.mutateAsync({
        title: formData.title.trim(),
        author: formData.author.trim(),
        description: formData.description.trim() || undefined,
        coverUrl: formData.coverUrl.trim() || undefined,
        category: formData.category,
        tags,
        writingTypes: formData.writingTypes,
        file: selectedFile,
      });

      toast.success(booksMessages.upload.success);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

      if (result.book.totalChapters > 0) {
        window.location.href = ROUTES.bookRead(result.book.id);
      }
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      toast.error(message);
    }
  };

  const myUploads = myUploadsData?.data ?? [];

  const handleDelete = async (bookId: string, title: string) => {
    const confirmed = await confirm({
      title: msg(booksMessages.upload.deleteConfirm, { title }),
      description: booksMessages.upload.deleteConfirmDescription,
      confirmLabel: booksMessages.upload.deleteButton,
      cancelLabel: commonMessages.cancel,
      variant: "destructive",
    });
    if (!confirmed) return;

    try {
      await deleteBook.mutateAsync(bookId);
      toast.success(booksMessages.upload.deleteSuccess);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className="space-y-8">
      <ConfirmDialog />
      <PageHeader
        variant="glass"
        title={booksMessages.upload.title}
        description={booksMessages.upload.description}
        actions={
          <Link href={ROUTES.BOOKS}>
            <Button variant="outline" size="sm">
              {booksMessages.detail.backToLibrary}
            </Button>
          </Link>
        }
      />

      <form onSubmit={handleSubmit} className="panel-glass p-6 space-y-5">
        {error ? <Alert type="error" message={error} /> : null}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label={booksMessages.admin.form.titleLabel}
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder={booksMessages.admin.form.titlePlaceholder}
            required
          />
          <Input
            label={booksMessages.admin.form.authorLabel}
            name="author"
            value={formData.author}
            onChange={handleChange}
            placeholder={booksMessages.admin.form.authorPlaceholder}
            required
          />
        </div>

        <Textarea
          label={booksMessages.admin.form.descriptionLabel}
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder={booksMessages.admin.form.descriptionPlaceholder}
          rows={3}
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
            label={booksMessages.admin.form.coverUrlLabel}
            name="coverUrl"
            value={formData.coverUrl}
            onChange={handleChange}
            placeholder={booksMessages.admin.form.coverUrlPlaceholder}
          />
        </div>

        <Input
          label={booksMessages.admin.form.tagsLabel}
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          placeholder={booksMessages.admin.form.tagsPlaceholder}
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
                onClick={() =>
                  toggleWritingType(option.value as WritingType)
                }
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-fg">
            {booksMessages.upload.fileLabel}
          </p>
          <p className="text-xs text-muted">{booksMessages.upload.fileHint}</p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".docx,.epub,.pdf"
            className="block w-full text-sm text-muted file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-primary/10 file:text-primary"
            onChange={handleFileChange}
            required
          />
        </div>

        <Button
          type="submit"
          className="gap-2 btn-glow-solid"
          isLoading={upload.isPending}
          disabled={upload.isPending}
        >
          <Upload className="h-4 w-4" />
          {upload.isPending
            ? booksMessages.upload.submitting
            : booksMessages.upload.submitButton}
        </Button>
      </form>

      <div className="panel-glass overflow-hidden">
        <div className="px-5 py-4 border-b border-border/60">
          <h2 className="text-sm font-semibold text-fg">
            {booksMessages.upload.myUploadsTitle}
          </h2>
        </div>

        {isLoadingUploads ? (
          <div className="p-8">
            <Loading text={booksMessages.loading} />
          </div>
        ) : myUploads.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={<BookOpen className="h-10 w-10" />}
              title={booksMessages.upload.myUploadsEmpty}
            />
          </div>
        ) : (
          <div className="divide-y divide-border/40">
            {myUploads.map((book) => {
              const badge = approvalBadge[book.approvalStatus];
              return (
                <div
                  key={book.id}
                  className="px-5 py-4 flex flex-wrap items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-fg">{book.title}</p>
                      <Badge variant={badge.variant}>{badge.label}</Badge>
                    </div>
                    <p className="text-sm text-muted">{book.author}</p>
                    {book.rejectionReason ? (
                      <p className="text-xs text-danger">{book.rejectionReason}</p>
                    ) : null}
                  </div>
                  <div className="flex gap-2">
                    <Link href={ROUTES.book(book.id)}>
                      <Button size="sm" variant="outline">
                        {booksMessages.upload.viewDetail}
                      </Button>
                    </Link>
                    {book.totalChapters > 0 ? (
                      <Link href={ROUTES.bookRead(book.id)}>
                        <Button size="sm">
                          {booksMessages.upload.readWhilePending}
                        </Button>
                      </Link>
                    ) : null}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="gap-1 text-danger"
                      onClick={() => handleDelete(book.id, book.title)}
                      disabled={deleteBook.isPending}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      {booksMessages.upload.deleteButton}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
