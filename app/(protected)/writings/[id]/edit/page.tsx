"use client";

import { useRouter } from "next/navigation";
import { use } from "react";
import {
  useWriting,
  useUpdateWriting,
  WritingForm,
} from "@/features/writings";
import { Loading, Error } from "@/components";
import { PageHeader } from "@/components/page-header";
import { toast } from "@/lib/toast";
import { ROUTES } from "@/constants/routes.constants";
import type * as types from "@/types/api";

interface EditWritingPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditWritingPage({ params }: EditWritingPageProps) {
  const router = useRouter();
  const { id } = use(params);
  const { data: writing, isLoading, error } = useWriting(id);
  const updateWriting = useUpdateWriting();

  const handleSubmit = async (
    payload: types.CreateWritingPayload | types.UpdateWritingPayload,
  ) => {
    await updateWriting.mutateAsync({ id, payload });
    toast.success("Đã cập nhật bài viết");
    router.push(ROUTES.writing(id));
  };

  if (isLoading) {
    return <Loading fullScreen text="Đang tải bài viết..." />;
  }

  if (error) {
    return (
      <Error
        title="Không tải được bài viết"
        message="Không thể lấy nội dung bài viết. Vui lòng thử lại."
        retry={() => router.back()}
      />
    );
  }

  if (!writing) {
    return null;
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Sửa bài viết"
        description={writing.title}
      />

      <WritingForm
        initialData={writing}
        isLoading={updateWriting.isPending}
        onSubmit={handleSubmit}
        onCancel={() => router.back()}
      />
    </div>
  );
}
