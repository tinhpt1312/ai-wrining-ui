"use client";

import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/button";
import { documentsService } from "@/api/documents.service";
import { toast } from "@/lib/toast";
import { getErrorMessage } from "@/utils/helpers";

export interface DocxUploadButtonProps {
  onParsed: (data: { title: string; content: string; fileName: string }) => void;
  onError?: (message: string) => void;
  disabled?: boolean;
}

export function DocxUploadButton({
  onParsed,
  onError,
  disabled,
}: DocxUploadButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const parsed = await documentsService.parseDocx(file);
      onParsed(parsed);
      toast.success(`Đã nhập nội dung từ "${parsed.fileName}"`);
    } catch (err) {
      const message = getErrorMessage(err);
      onError?.(message);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        className="hidden"
        onChange={handleFileUpload}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="gap-1.5 w-full sm:w-auto"
        onClick={() => fileInputRef.current?.click()}
        isLoading={isUploading}
        disabled={disabled || isUploading}
      >
        <Upload className="h-4 w-4" />
        Tải lên file Word (.docx)
      </Button>
    </>
  );
}
