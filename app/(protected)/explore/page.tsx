"use client";

import { useState } from "react";
import {
  usePublicWritings,
  ExploreSearchBar,
  ExploreTypeTabs,
  PublicWritingGrid,
} from "@/features/explore";
import { Loading, Error, EmptyState } from "@/components";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";
import { Pagination } from "@/components/pagination";
import { Globe } from "lucide-react";
import * as types from "@/types/api";

export default function ExplorePage() {
  const [typeFilter, setTypeFilter] = useState("");
  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [offset, setOffset] = useState(0);
  const limit = 9;

  const params: types.QueryWritingParams = {
    limit,
    offset,
    ...(typeFilter && { type: typeFilter as types.WritingType }),
    ...(appliedSearch && { search: appliedSearch }),
  };

  const { data, isLoading, error } = usePublicWritings(params);
  const writings = data?.data || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / limit);
  const currentPage = Math.floor(offset / limit) + 1;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedSearch(search.trim());
    setOffset(0);
  };

  if (isLoading) {
    return <Loading fullScreen text="Đang tải bài viết công khai..." />;
  }

  if (error) {
    return (
      <Error
        title="Không tải được danh sách"
        message="Không thể lấy bài viết công khai. Vui lòng thử lại."
        retry={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Khám phá"
        description={`${total} bài viết công khai từ cộng đồng`}
      />

      <ExploreSearchBar
        search={search}
        onSearchChange={setSearch}
        onSubmit={handleSearch}
      />

      <Section
        title="Lọc theo loại bài"
        description={
          appliedSearch
            ? `Kết quả cho "${appliedSearch}"`
            : undefined
        }
      >
        <ExploreTypeTabs
          value={typeFilter}
          onChange={(type) => {
            setTypeFilter(type);
            setOffset(0);
          }}
        />
      </Section>

      {writings.length === 0 ? (
        <EmptyState
          icon={<Globe className="h-10 w-10" />}
          title="Chưa có bài viết phù hợp"
          description={
            appliedSearch || typeFilter
              ? "Thử đổi từ khóa hoặc chọn loại bài khác."
              : "Hãy chia sẻ bài viết của bạn ở chế độ Công khai để cộng đồng tham khảo."
          }
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
    </div>
  );
}
