import type { Metadata } from "next";
import { LandingView } from "@/features/landing";

export const metadata: Metadata = {
  title: "Viết & Chấm Văn — Luyện viết & chấm bài bằng AI",
  description:
    "Nền tảng viết văn thông minh: soạn bài, nhận phản hồi AI, chữa bài theo gợi ý và theo dõi tiến bộ từng lần chỉnh sửa.",
  openGraph: {
    title: "Viết & Chấm Văn",
    description:
      "Luyện viết, chấm bài AI và cải thiện từng bài một cách có hệ thống.",
    locale: "vi_VN",
    type: "website",
  },
};

export default function HomePage() {
  return <LandingView />;
}
