import { API_CONFIG, API_PATHS } from "@/constants/api.constants";
import type {
  PublicShareAnalysis,
  PublicShareWriting,
} from "@/types/share";

async function publicFetch<T>(path: string): Promise<T> {
  const response = await fetch(`${API_CONFIG.BASE_URL}${path}`, {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as {
      message?: string;
    } | null;
    throw new Error(body?.message || "Không thể tải dữ liệu chia sẻ");
  }

  return response.json() as Promise<T>;
}

export const shareService = {
  getPublicWriting(id: string): Promise<PublicShareWriting> {
    return publicFetch<PublicShareWriting>(API_PATHS.SHARE.WRITING(id));
  },

  getPublicAnalysis(id: string): Promise<PublicShareAnalysis> {
    return publicFetch<PublicShareAnalysis>(API_PATHS.SHARE.ANALYSIS(id));
  },
};
