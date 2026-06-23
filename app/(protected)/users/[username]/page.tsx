"use client";

import { use, useState } from "react";
import {
  usePublicWritingsByUser,
  PublicWritingGrid,
  UserPublicProfileHeader,
} from "@/features/explore";
import { useUserProfile } from "@/features/profile";
import { Loading, Error, EmptyState } from "@/components";
import { Pagination } from "@/components/pagination";
import { BookOpen } from "lucide-react";

interface UserProfilePageProps {
  params: Promise<{ username: string }>;
}

export default function UserProfilePage({ params }: UserProfilePageProps) {
  const { username } = use(params);
  const [offset, setOffset] = useState(0);
  const limit = 9;

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
  const totalPages = Math.ceil(total / limit);
  const currentPage = Math.floor(offset / limit) + 1;

  return (
    <div className="space-y-8">
      <UserPublicProfileHeader profile={profile} />

      <section className="space-y-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-fg">Bài viết công khai</h2>
          {total > 0 && (
            <span className="text-sm text-muted">{total} bài</span>
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
          onPrevious={() => setOffset(Math.max(0, offset - limit))}
          onNext={() => setOffset(offset + limit)}
        />
      </section>
    </div>
  );
}
