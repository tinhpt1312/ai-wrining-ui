import { http } from "./client";
import { API_PATHS } from "@/constants/api.constants";
import { normalizeListResponse } from "./response.helpers";
import * as types from "@/types/api";

export const booksService = {
  async getAll(params?: types.QueryBookParams): Promise<types.BooksListResponse> {
    const response = await http.get<types.BackendListResponse<types.Book>>(
      API_PATHS.BOOKS.ROOT,
      { params },
    );
    return normalizeListResponse(response.data);
  },

  async getById(id: string): Promise<types.Book> {
    const response = await http.get<types.Book>(API_PATHS.BOOKS.BY_ID(id));
    return response.data;
  },

  async create(payload: types.CreateBookPayload): Promise<types.Book> {
    const response = await http.post<types.Book>(API_PATHS.BOOKS.ROOT, payload);
    return response.data;
  },

  async update(id: string, payload: types.UpdateBookPayload): Promise<types.Book> {
    const response = await http.patch<types.Book>(
      API_PATHS.BOOKS.BY_ID(id),
      payload,
    );
    return response.data;
  },

  async delete(id: string): Promise<{ message: string }> {
    const response = await http.delete<{ message: string }>(
      API_PATHS.BOOKS.BY_ID(id),
    );
    return response.data;
  },

  async recommend(
    payload: types.RecommendBooksPayload,
  ): Promise<types.BookRecommendation[]> {
    const response = await http.post<
      | types.BackendDataResponse<types.BookRecommendation[]>
      | types.BookRecommendation[]
    >(API_PATHS.BOOKS.RECOMMEND, payload);
    return "data" in response.data ? response.data.data : response.data;
  },

  async getChapters(bookId: string): Promise<types.BookChapterSummary[]> {
    const response = await http.get<
      types.BackendDataResponse<types.BookChapterSummary[]>
    >(API_PATHS.BOOKS.CHAPTERS(bookId));
    return response.data.data;
  },

  async getChapter(
    bookId: string,
    chapterId: string,
  ): Promise<types.BookChapter> {
    const response = await http.get<
      types.BackendDataResponse<types.BookChapter>
    >(API_PATHS.BOOKS.CHAPTER(bookId, chapterId));
    return response.data.data;
  },

  async getProgress(bookId: string): Promise<types.UserBookProgress | null> {
    const response = await http.get<
      types.BackendDataResponse<types.UserBookProgress | null>
    >(API_PATHS.BOOKS.PROGRESS(bookId));
    return response.data.data;
  },

  async updateProgress(
    bookId: string,
    payload: types.UpdateBookProgressPayload,
  ): Promise<types.UserBookProgress> {
    const response = await http.put<
      types.BackendDataResponse<types.UserBookProgress>
    >(API_PATHS.BOOKS.PROGRESS(bookId), payload);
    return response.data.data;
  },

  async ingestDocx(
    bookId: string,
    file: File,
  ): Promise<types.BookIngestResult> {
    const formData = new FormData();
    formData.append("file", file);
    const response = await http.post<
      types.BackendDataResponse<types.BookIngestResult>
    >(API_PATHS.BOOKS.INGEST(bookId), formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.data;
  },

  async uploadBook(payload: types.UploadBookPayload): Promise<types.BookUploadResult> {
    const formData = new FormData();
    formData.append("file", payload.file);
    formData.append("title", payload.title);
    formData.append("author", payload.author);
    formData.append("category", payload.category);
    if (payload.description) formData.append("description", payload.description);
    if (payload.coverUrl) formData.append("coverUrl", payload.coverUrl);
    if (payload.tags?.length) {
      formData.append("tags", JSON.stringify(payload.tags));
    }
    if (payload.writingTypes?.length) {
      formData.append("writingTypes", JSON.stringify(payload.writingTypes));
    }

    const response = await http.post<
      types.BackendDataResponse<types.BookUploadResult>
    >(API_PATHS.BOOKS.UPLOAD, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.data;
  },

  async getMyUploads(
    params?: types.QueryBookParams,
  ): Promise<types.BooksListResponse> {
    const response = await http.get<types.BackendListResponse<types.Book>>(
      API_PATHS.BOOKS.MY_UPLOADS,
      { params },
    );
    return normalizeListResponse(response.data);
  },

  async getPendingBooks(
    params?: types.QueryBookParams,
  ): Promise<types.BooksListResponse> {
    const response = await http.get<types.BackendListResponse<types.Book>>(
      API_PATHS.BOOKS.PENDING,
      { params },
    );
    return normalizeListResponse(response.data);
  },

  async approveBook(id: string): Promise<types.Book> {
    const response = await http.patch<types.BackendDataResponse<types.Book>>(
      API_PATHS.BOOKS.APPROVE(id),
    );
    return response.data.data;
  },

  async rejectBook(
    id: string,
    payload?: types.RejectBookPayload,
  ): Promise<types.Book> {
    const response = await http.patch<types.BackendDataResponse<types.Book>>(
      API_PATHS.BOOKS.REJECT(id),
      payload ?? {},
    );
    return response.data.data;
  },
};
