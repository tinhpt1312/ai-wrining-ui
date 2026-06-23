import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { shareService } from "@/api/share.service";
import { PublicWritingShareView } from "@/features/share";
import { ROUTES } from "@/constants/routes.constants";
import { APP_CONFIG } from "@/constants/share.constants";
import { truncateText } from "@/utils/share.utils";

interface ShareWritingPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: ShareWritingPageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const writing = await shareService.getPublicWriting(id);
    const description = truncateText(writing.content, 160);
    const url = `${APP_CONFIG.BASE_URL}${ROUTES.shareWriting(id)}`;
    const authorName = writing.author.fullName || writing.author.username;

    return {
      title: `${writing.title} | Viết & Chấm Văn`,
      description,
      openGraph: {
        title: writing.title,
        description,
        url,
        type: "article",
        siteName: "Viết & Chấm Văn",
        locale: "vi_VN",
      },
      twitter: {
        card: "summary",
        title: writing.title,
        description: `${authorName} — ${description}`,
      },
    };
  } catch {
    return {
      title: "Bài viết không khả dụng",
      description:
        "Bài viết này không tồn tại hoặc chưa được đặt ở trạng thái công khai.",
      robots: { index: false, follow: false },
    };
  }
}

export default async function ShareWritingPage({
  params,
}: ShareWritingPageProps) {
  const { id } = await params;

  try {
    const writing = await shareService.getPublicWriting(id);
    return <PublicWritingShareView writing={writing} />;
  } catch {
    notFound();
  }
}
