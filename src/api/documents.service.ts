import { http } from "./client";
import { API_PATHS } from "@/constants/api.constants";

export interface ParsedDocument {
  title: string;
  content: string;
  fileName: string;
}

export const documentsService = {
  async parseDocx(file: File): Promise<ParsedDocument> {
    const formData = new FormData();
    formData.append("file", file);
    const response = await http.post<ParsedDocument>(
      API_PATHS.DOCUMENTS.PARSE,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return response.data;
  },
};
