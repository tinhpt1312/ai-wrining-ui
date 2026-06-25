"use client";

import { useCallback, useMemo, useState } from "react";

interface UsePaginationOptions {
  limit: number;
  initialOffset?: number;
}

export function usePagination({ limit, initialOffset = 0 }: UsePaginationOptions) {
  const [offset, setOffset] = useState(initialOffset);

  const currentPage = Math.floor(offset / limit) + 1;

  const getTotalPages = useCallback(
    (total: number) => Math.ceil(total / limit),
    [limit],
  );

  const hasMore = useCallback(
    (total: number) => offset + limit < total,
    [offset, limit],
  );

  const goToPrevious = useCallback(() => {
    setOffset((current) => Math.max(0, current - limit));
  }, [limit]);

  const goToNext = useCallback(() => {
    setOffset((current) => current + limit);
  }, [limit]);

  const reset = useCallback(() => {
    setOffset(0);
  }, []);

  const paginationProps = useMemo(
    () => ({
      currentPage,
      onPrevious: goToPrevious,
      onNext: goToNext,
      canGoPrevious: offset > 0,
    }),
    [currentPage, goToPrevious, goToNext, offset],
  );

  return {
    offset,
    limit,
    currentPage,
    setOffset,
    reset,
    getTotalPages,
    hasMore,
    goToPrevious,
    goToNext,
    paginationProps,
  };
}
