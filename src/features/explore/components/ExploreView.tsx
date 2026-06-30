"use client";

import { useState } from "react";
import {
  usePublicWritings,
  ExploreSearchBar,
  ExploreTypeTabs,
  PublicWritingGrid,
} from "@/features/explore";
import { Loading } from "@/components/loading";
import { Error } from "@/components/error-state";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";
import { Pagination } from "@/components/pagination";
import { usePagination } from "@/hooks/usePagination";
import { Globe } from "lucide-react";
import { exploreMessages } from "@/messages/explore";
import { navMessages } from "@/messages/nav";
import { msg } from "@/messages/format";
import * as types from "@/types/api";

export function ExploreView() {
  const [typeFilter, setTypeFilter] = useState("");
  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const { offset, limit, currentPage, reset, getTotalPages, paginationProps } =
    usePagination({ limit: 9 });

  const params: types.QueryWritingParams = {
    limit,
    offset,
    ...(typeFilter && { type: typeFilter as types.WritingType }),
    ...(appliedSearch && { search: appliedSearch }),
  };

  const { data, isLoading, error } = usePublicWritings(params);
  const writings = data?.data || [];
  const total = data?.total || 0;
  const totalPages = getTotalPages(total);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedSearch(search.trim());
    reset();
  };

  if (isLoading) {
    return <Loading fullScreen text={exploreMessages.loading} />;
  }

  if (error) {
    return (
      <Error
        title={exploreMessages.error.title}
        message={exploreMessages.error.message}
        retry={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        variant="glass"
        title={navMessages.explore}
        description={msg(exploreMessages.page.description, { total })}
      />

      <ExploreSearchBar
        search={search}
        onSearchChange={setSearch}
        onSubmit={handleSearch}
      />

      <Section
        title={exploreMessages.filter.sectionTitle}
        description={
          appliedSearch
            ? msg(exploreMessages.filter.resultsFor, { query: appliedSearch })
            : undefined
        }
      >
        <ExploreTypeTabs
          value={typeFilter}
          onChange={(type) => {
            setTypeFilter(type);
            reset();
          }}
        />
      </Section>

      {writings.length === 0 ? (
        <EmptyState
          icon={<Globe className="h-10 w-10" />}
          title={exploreMessages.empty.title}
          description={
            appliedSearch || typeFilter
              ? exploreMessages.empty.filteredDescription
              : exploreMessages.empty.defaultDescription
          }
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
    </div>
  );
}
