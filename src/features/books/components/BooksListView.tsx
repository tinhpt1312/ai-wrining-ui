"use client";

import Link from "next/link";
import { useState } from "react";
import {
  useBooks,
  BookSearchBar,
  BookCategoryTabs,
  BookGrid,
} from "@/features/books";
import { Loading } from "@/components/loading";
import { Error } from "@/components/error-state";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";
import { Pagination } from "@/components/pagination";
import { Button } from "@/components/button";
import { usePagination } from "@/hooks/usePagination";
import { BookOpen, Upload } from "lucide-react";
import { booksMessages } from "@/messages/books";
import { navMessages } from "@/messages/nav";
import { msg } from "@/messages/format";
import { ROUTES } from "@/constants/routes.constants";
import { BookCategory } from "@/types/api";
import type { QueryBookParams } from "@/types/api";

export function BooksListView() {
  const [categoryFilter, setCategoryFilter] = useState("");
  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const { offset, limit, currentPage, reset, getTotalPages, paginationProps } =
    usePagination({ limit: 9 });

  const params: QueryBookParams = {
    limit,
    offset,
    ...(categoryFilter && { category: categoryFilter as BookCategory }),
    ...(appliedSearch && { search: appliedSearch }),
  };

  const { data, isLoading, error } = useBooks(params);
  const books = data?.data || [];
  const total = data?.total || 0;
  const totalPages = getTotalPages(total);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedSearch(search.trim());
    reset();
  };

  if (isLoading) {
    return <Loading fullScreen text={booksMessages.loading} />;
  }

  if (error) {
    return (
      <Error
        title={booksMessages.error.title}
        message={booksMessages.error.message}
        retry={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        variant="glass"
        title={navMessages.books}
        description={msg(booksMessages.page.description, { total })}
        actions={
          <Link href={ROUTES.BOOKS_UPLOAD}>
            <Button variant="outline" className="gap-2">
              <Upload className="h-4 w-4" />
              {booksMessages.upload.title}
            </Button>
          </Link>
        }
      />

      <BookSearchBar
        search={search}
        onSearchChange={setSearch}
        onSubmit={handleSearch}
      />

      <Section
        title={booksMessages.filter.sectionTitle}
        description={
          appliedSearch
            ? msg(booksMessages.filter.resultsFor, { query: appliedSearch })
            : undefined
        }
      >
        <BookCategoryTabs
          value={categoryFilter}
          onChange={(category) => {
            setCategoryFilter(category);
            reset();
          }}
        />
      </Section>

      {books.length === 0 ? (
        <EmptyState
          icon={<BookOpen className="h-10 w-10" />}
          title={booksMessages.empty.title}
          description={
            appliedSearch || categoryFilter
              ? booksMessages.empty.filteredDescription
              : booksMessages.empty.defaultDescription
          }
        />
      ) : (
        <BookGrid books={books} />
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
