import { http } from "./client";
import { API_PATHS } from "@/constants/api.constants";
import { normalizeListResponse } from "./response.helpers";
import * as types from "@/types/api";

export const writingsService = {
  async create(payload: types.CreateWritingPayload): Promise<types.Writing> {
    const response = await http.post<types.Writing>(
      API_PATHS.WRITINGS.ROOT,
      payload,
    );
    return response.data;
  },

  async generateOutline(
    payload: types.GenerateOutlinePayload,
  ): Promise<types.WritingOutline> {
    const response = await http.post<
      types.BackendDataResponse<types.WritingOutline> | types.WritingOutline
    >(API_PATHS.WRITINGS.OUTLINE, payload);
    return "data" in response.data ? response.data.data : response.data;
  },

  async getAll(
    params?: types.QueryWritingParams,
  ): Promise<types.WritingsListResponse> {
    const response = await http.get<
      types.BackendListResponse<types.Writing>
    >(API_PATHS.WRITINGS.ROOT, { params });
    return normalizeListResponse(response.data);
  },

  async getById(id: string): Promise<types.Writing> {
    const response = await http.get<types.Writing>(
      API_PATHS.WRITINGS.BY_ID(id),
    );
    return response.data;
  },

  async update(
    id: string,
    payload: types.UpdateWritingPayload,
  ): Promise<types.Writing> {
    const response = await http.patch<types.Writing>(
      API_PATHS.WRITINGS.BY_ID(id),
      payload,
    );
    return response.data;
  },

  async delete(id: string): Promise<{ message: string }> {
    const response = await http.delete<{ message: string }>(
      API_PATHS.WRITINGS.BY_ID(id),
    );
    return response.data;
  },

  async getStats(): Promise<types.WritingStats> {
    const response = await http.get<types.WritingStats>(
      API_PATHS.WRITINGS.STATS,
    );
    return response.data;
  },

  async getPublicAll(
    params?: types.QueryWritingParams,
  ): Promise<types.WritingsListResponse> {
    const response = await http.get<
      types.BackendListResponse<types.Writing>
    >(API_PATHS.WRITINGS.PUBLIC, { params });
    return normalizeListResponse(response.data);
  },

  async getPublicByUsername(
    username: string,
    params?: types.QueryWritingParams,
  ): Promise<types.WritingsListResponse> {
    const response = await http.get<
      types.BackendListResponse<types.Writing>
    >(API_PATHS.USERS.writings(username), { params });
    return normalizeListResponse(response.data);
  },

  async getRevisions(
    writingId: string,
  ): Promise<types.WritingRevisionsListResponse> {
    const response = await http.get<
      types.BackendListResponse<types.WritingRevision>
    >(API_PATHS.WRITINGS.REVISIONS(writingId));
    return normalizeListResponse(response.data);
  },

  async createRevision(
    writingId: string,
    payload: types.CreateWritingRevisionPayload,
  ): Promise<types.WritingRevision> {
    const response = await http.post<
      types.BackendDataResponse<types.WritingRevision> | types.WritingRevision
    >(API_PATHS.WRITINGS.REVISIONS(writingId), payload);
    return "data" in response.data ? response.data.data : response.data;
  },

  async ensureBaselineRevision(
    writingId: string,
    payload: types.EnsureBaselineRevisionPayload,
  ): Promise<types.WritingRevision> {
    const response = await http.post<
      types.BackendDataResponse<types.WritingRevision> | types.WritingRevision
    >(API_PATHS.WRITINGS.REVISION_BASELINE(writingId), payload);
    return "data" in response.data ? response.data.data : response.data;
  },

  async getRevisionTimeline(
    writingId: string,
    analysisId?: string,
  ): Promise<types.RevisionTimelineResponse> {
    const response = await http.get<
      types.BackendListResponse<types.RevisionTimelineItem>
    >(API_PATHS.WRITINGS.REVISION_TIMELINE(writingId), {
      params: analysisId ? { analysisId } : undefined,
    });
    return normalizeListResponse(response.data);
  },

  async restoreRevision(
    writingId: string,
    revisionId: string,
  ): Promise<types.Writing> {
    const response = await http.post<
      types.BackendDataResponse<types.Writing> | types.Writing
    >(API_PATHS.WRITINGS.RESTORE_REVISION(writingId, revisionId));
    return "data" in response.data ? response.data.data : response.data;
  },

  async downloadExport(
    id: string,
    format: "docx" | "pdf",
  ): Promise<void> {
    const path =
      format === "docx"
        ? API_PATHS.WRITINGS.EXPORT_DOCX(id)
        : API_PATHS.WRITINGS.EXPORT_PDF(id);
    const mimeType =
      format === "docx"
        ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        : "application/pdf";

    const response = await http.get<Blob>(path, {
      responseType: "blob",
    });

    const disposition = response.headers["content-disposition"] as
      | string
      | undefined;
    let fileName = `bai-viet.${format}`;
    if (disposition) {
      const utf8Match = disposition.match(/filename\*=UTF-8''([^;]+)/i);
      const asciiMatch = disposition.match(/filename="([^"]+)"/);
      if (utf8Match?.[1]) {
        fileName = decodeURIComponent(utf8Match[1]);
      } else if (asciiMatch?.[1]) {
        fileName = asciiMatch[1];
      }
    }

    const url = window.URL.createObjectURL(
      new Blob([response.data], { type: mimeType }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};
