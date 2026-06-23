"use client";

import { use } from "react";
import Link from "next/link";
import { WritingSuggestions } from "@/features/suggestions";
import { useWriting } from "@/features/writings";
import { Loading, Error as ErrorState } from "@/components";
import { Button } from "@/components/button";
import { PageHeader } from "@/components/page-header";
import { ROUTES } from "@/constants/routes.constants";

export default function WritingDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: writingId } = use(params);
  const { data: writing, isLoading, error } = useWriting(writingId);

  if (isLoading) {
    return <Loading text="Đang tải bài viết..." />;
  }

  if (error || !writing) {
    return (
      <ErrorState
        title="Không tải được bài viết"
        message="Không thể lấy bài viết để hiển thị gợi ý."
      />
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Gợi ý sửa bài"
        description={writing.title}
        actions={
          <Link href={ROUTES.writing(writingId)}>
            <Button variant="outline">Về bài viết</Button>
          </Link>
        }
      />

      <WritingSuggestions writingId={writingId} />
    </div>
  );
}
