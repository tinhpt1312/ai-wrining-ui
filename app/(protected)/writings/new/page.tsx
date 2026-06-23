"use client";

import { useRouter } from "next/navigation";
import { useCreateWriting, WritingForm } from "@/features/writings";
import { PageHeader } from "@/components/page-header";
import { toast } from "@/lib/toast";
import { ROUTES } from "@/constants/routes.constants";
import type * as types from "@/types/api";

export default function NewWritingPage() {
  const router = useRouter();
  const createWriting = useCreateWriting();

  const handleSubmit = async (
    payload: types.CreateWritingPayload | types.UpdateWritingPayload,
  ) => {
    await createWriting.mutateAsync(payload as types.CreateWritingPayload);
    toast.success("Đã tạo bài viết");
    router.push(ROUTES.WRITINGS);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Viết bài mới"
        description="Viết suy nghĩ, ý tưởng hoặc câu chuyện của bạn"
      />

      <WritingForm
        isLoading={createWriting.isPending}
        onSubmit={handleSubmit}
        onCancel={() => router.back()}
      />
    </div>
  );
}
