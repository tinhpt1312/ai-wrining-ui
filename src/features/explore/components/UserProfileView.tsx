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
import { exploreMessages } from "@/messages/explore";
import { msg } from "@/messages/format";

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
    return <Loading fullScreen text={exploreMessages.userProfile.loading} />;
  }

  if (profileError || !profile) {
    return (
      <Error
        title={exploreMessages.userProfile.error.title}
        message={exploreMessages.userProfile.error.message}
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
            {exploreMessages.userProfile.publicWritingsTitle}
          </h2>
          {total > 0 && (
            <span className="text-sm text-muted font-mono tabular-nums">
              {msg(exploreMessages.userProfile.writingsCount, { count: total })}
            </span>
          )}
        </div>

        {writingsLoading ? (
          <Loading text={exploreMessages.userProfile.writingsLoading} />
        ) : writings.length === 0 ? (
          <EmptyState
            icon={<BookOpen className="h-10 w-10 text-subtle" />}
            title={exploreMessages.userProfile.emptyTitle}
            description={exploreMessages.userProfile.emptyDescription}
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
