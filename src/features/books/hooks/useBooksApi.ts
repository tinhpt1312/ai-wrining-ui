"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
  UseMutationResult,
  UseQueryResult,
} from "@tanstack/react-query";
import { booksService } from "@/api";
import { CACHE_TIME, QUERY_KEYS } from "@/constants";
import * as types from "@/types/api";

export function useBooks(
  params?: types.QueryBookParams,
): UseQueryResult<types.BooksListResponse, Error> {
  return useQuery({
    queryKey: QUERY_KEYS.books.all(params),
    queryFn: () => booksService.getAll(params),
    staleTime: CACHE_TIME.MEDIUM,
  });
}

export function useBook(id: string): UseQueryResult<types.Book, Error> {
  return useQuery({
    queryKey: QUERY_KEYS.books.detail(id),
    queryFn: () => booksService.getById(id),
    staleTime: CACHE_TIME.LONG,
    enabled: !!id,
  });
}

export function useCreateBook(): UseMutationResult<
  types.Book,
  Error,
  types.CreateBookPayload
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => booksService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });
}

export function useUpdateBook(): UseMutationResult<
  types.Book,
  Error,
  { id: string; payload: types.UpdateBookPayload }
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => booksService.update(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      queryClient.setQueryData(QUERY_KEYS.books.detail(data.id), data);
    },
  });
}

export function useDeleteBook(): UseMutationResult<
  { message: string },
  Error,
  string
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => booksService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.books.myUploads() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.books.pending() });
    },
  });
}

export function useRecommendBooks(): UseMutationResult<
  types.BookRecommendation[],
  Error,
  types.RecommendBooksPayload
> {
  return useMutation({
    mutationFn: (payload) => booksService.recommend(payload),
  });
}

export function useBookChapters(
  bookId: string,
): UseQueryResult<types.BookChapterSummary[], Error> {
  return useQuery({
    queryKey: QUERY_KEYS.books.chapters(bookId),
    queryFn: () => booksService.getChapters(bookId),
    staleTime: CACHE_TIME.LONG,
    enabled: !!bookId,
  });
}

export function useBookChapter(
  bookId: string,
  chapterId: string,
): UseQueryResult<types.BookChapter, Error> {
  return useQuery({
    queryKey: QUERY_KEYS.books.chapter(bookId, chapterId),
    queryFn: () => booksService.getChapter(bookId, chapterId),
    staleTime: CACHE_TIME.LONG,
    enabled: !!bookId && !!chapterId,
  });
}

export function useBookProgress(
  bookId: string,
): UseQueryResult<types.UserBookProgress | null, Error> {
  return useQuery({
    queryKey: QUERY_KEYS.books.progress(bookId),
    queryFn: () => booksService.getProgress(bookId),
    staleTime: CACHE_TIME.SHORT,
    enabled: !!bookId,
  });
}

export function useUpdateBookProgress(): UseMutationResult<
  types.UserBookProgress,
  Error,
  { bookId: string; payload: types.UpdateBookProgressPayload }
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ bookId, payload }) =>
      booksService.updateProgress(bookId, payload),
    onSuccess: (data) => {
      queryClient.setQueryData(
        QUERY_KEYS.books.progress(data.bookId),
        data,
      );
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });
}

export function useIngestBookDocx(): UseMutationResult<
  types.BookIngestResult,
  Error,
  { bookId: string; file: File }
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ bookId, file }) => booksService.ingestDocx(bookId, file),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.books.detail(variables.bookId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.books.chapters(variables.bookId),
      });
    },
  });
}

export function useUploadBook(): UseMutationResult<
  types.BookUploadResult,
  Error,
  types.UploadBookPayload
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => booksService.uploadBook(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.books.myUploads() });
      queryClient.setQueryData(QUERY_KEYS.books.detail(data.book.id), data.book);
    },
  });
}

export function useMyUploads(
  params?: types.QueryBookParams,
): UseQueryResult<types.BooksListResponse, Error> {
  return useQuery({
    queryKey: QUERY_KEYS.books.myUploads(params),
    queryFn: () => booksService.getMyUploads(params),
    staleTime: CACHE_TIME.MEDIUM,
  });
}

export function usePendingBooks(
  params?: types.QueryBookParams,
): UseQueryResult<types.BooksListResponse, Error> {
  return useQuery({
    queryKey: QUERY_KEYS.books.pending(params),
    queryFn: () => booksService.getPendingBooks(params),
    staleTime: CACHE_TIME.SHORT,
  });
}

export function useApproveBook(): UseMutationResult<types.Book, Error, string> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => booksService.approveBook(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.books.pending() });
      queryClient.setQueryData(QUERY_KEYS.books.detail(data.id), data);
    },
  });
}

export function useRejectBook(): UseMutationResult<
  types.Book,
  Error,
  { id: string; reason?: string }
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }) => booksService.rejectBook(id, { reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.books.pending() });
    },
  });
}
