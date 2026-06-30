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
import { appMessages } from "@/messages/app";
import { msg } from "@/messages/format";

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
        ? msg(appMessages.share.analysis.scoredTitle, {
            title: analysis.writing.title,
            score,
          })
        : analysis.writing.title;

    return {
      title: msg(appMessages.pageTitle, { title }),
      description,
      openGraph: {
        title,
        description,
        url,
        type: "article",
        siteName: appMessages.name,
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
      title: appMessages.share.analysis.unavailableTitle,
      description: appMessages.share.analysis.unavailableDescription,
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
