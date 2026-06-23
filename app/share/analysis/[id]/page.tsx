import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { shareService } from "@/api/share.service";
import { PublicAnalysisShareView } from "@/features/share";
import { ROUTES } from "@/constants/routes.constants";
import { APP_CONFIG } from "@/constants/share.constants";
import {
  getOverallAnalysisScore,
} from "@/features/analysis/utils/score.utils";
import { getAnalysisSummary } from "@/utils/helpers";
import { truncateText } from "@/utils/share.utils";

interface ShareAnalysisPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: ShareAnalysisPageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const analysis = await shareService.getPublicAnalysis(id);
    const score = getOverallAnalysisScore(analysis.feedbackJson);
    const summary =
      getAnalysisSummary(analysis.feedbackJson) ||
      analysis.writing.title;
    const description = truncateText(summary, 160);
    const url = `${APP_CONFIG.BASE_URL}${ROUTES.shareAnalysis(id)}`;
    const title =
      score != null
        ? `${analysis.writing.title} — Điểm ${score}/10`
        : analysis.writing.title;

    return {
      title: `${title} | Viết & Chấm Văn`,
      description,
      openGraph: {
        title,
        description,
        url,
        type: "article",
        siteName: "Viết & Chấm Văn",
        locale: "vi_VN",
      },
      twitter: {
        card: "summary",
        title,
        description,
      },
    };
  } catch {
    return {
      title: "Kết quả chấm bài không khả dụng",
      description:
        "Kết quả chấm bài này không tồn tại hoặc bài viết chưa được đặt công khai.",
      robots: { index: false, follow: false },
    };
  }
}

export default async function ShareAnalysisPage({
  params,
}: ShareAnalysisPageProps) {
  const { id } = await params;

  try {
    const analysis = await shareService.getPublicAnalysis(id);
    return <PublicAnalysisShareView analysis={analysis} />;
  } catch {
    notFound();
  }
}
