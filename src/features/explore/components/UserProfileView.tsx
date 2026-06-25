"use client";

import {
  usePublicWritingsByUser,
  PublicWritingGrid,
  UserPublicProfileHeader,
} from "@/features/explore";
import { useUserProfile } from "@/features/profile";
import { Loading } from "@/components/loading";
import { Error } from "@/components/error-state";
import { EmptyState } from "@/components/empty-state";
import { Pagination } from "@/components/pagination";
import { usePagination } from "@/hooks/usePagination";
import { BookOpen } from "lucide-react";

interface UserProfileViewProps {
  username: string;
}

export function UserProfileView({ username }: UserProfileViewProps) {
  const { offset, limit, currentPage, getTotalPages, paginationProps } =
    usePagination({ limit: 9 });

  const {
    data: profile,
    isLoading: profileLoading,
    error: profileError,
  } = useUserProfile(username);

  const { data: writingsData, isLoading: writingsLoading } =
    usePublicWritingsByUser(username, { limit, offset });

  if (profileLoading) {
    return <Loading fullScreen text="Đang tải hồ sơ..." />;
  }

  if (profileError || !profile) {
    return (
      <Error
        title="Không tìm thấy người dùng"
        message="Tài khoản này không tồn tại hoặc đã bị vô hiệu hóa."
        retry={() => window.history.back()}
      />
    );
  }

  const writings = writingsData?.data || [];
  const total = writingsData?.total || 0;
  const totalPages = getTotalPages(total);

  return (
    <div className="space-y-8">
      <UserPublicProfileHeader profile={profile} />

      <section className="space-y-5">
        <div className="flex items-center justify-between gap-3 px-1">
          <h2 className="text-sm font-semibold text-fg uppercase tracking-wider">
            Bài viết công khai
          </h2>
          {total > 0 && (
            <span className="text-sm text-muted font-mono tabular-nums">
              {total} bài
            </span>
          )}
        </div>

        {writingsLoading ? (
          <Loading text="Đang tải bài viết..." />
        ) : writings.length === 0 ? (
          <EmptyState
            icon={<BookOpen className="h-10 w-10 text-subtle" />}
            title="Chưa có bài công khai"
            description="Người dùng này chưa chia sẻ bài viết nào ở chế độ công khai."
          />
        ) : (
          <PublicWritingGrid writings={writings} />
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPrevious={paginationProps.onPrevious}
          onNext={paginationProps.onNext}
        />
      </section>
    </div>
  );
}
