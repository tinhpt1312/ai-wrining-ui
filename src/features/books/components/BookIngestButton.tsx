"use client";

import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/button";
import { useIngestBookDocx } from "../hooks/useBooksApi";
import { toast } from "@/lib/toast";
import { msg } from "@/messages/format";
import { booksMessages } from "@/messages/books";
import { getErrorMessage } from "@/utils/helpers";

export function BookIngestButton({
  bookId,
  disabled,
}: {
  bookId: string;
  disabled?: boolean;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const ingest = useIngestBookDocx();
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const result = await ingest.mutateAsync({ bookId, file });
      toast.success(
        msg(booksMessages.admin.ingest.success, { count: result.chapterCount }),
      );
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".docx,.epub,.pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/epub+zip,application/pdf"
        className="hidden"
        onChange={handleUpload}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="gap-1.5"
        onClick={() => fileInputRef.current?.click()}
        isLoading={isUploading || ingest.isPending}
        disabled={disabled || isUploading || ingest.isPending}
      >
        <Upload className="h-4 w-4" />
        {isUploading || ingest.isPending
          ? booksMessages.admin.ingest.uploading
          : booksMessages.admin.ingest.uploadButton}
      </Button>
    </>
  );
}
