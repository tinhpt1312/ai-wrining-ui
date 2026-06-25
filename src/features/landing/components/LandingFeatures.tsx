import {
  FileEdit,
  Globe,
  History,
  Lightbulb,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const FEATURES: {
  icon: LucideIcon;
  title: string;
  description: string;
}[] = [
  {
    icon: FileEdit,
    title: "Viết & quản lý bài",
    description:
      "Soạn, lưu và chỉnh sửa bài luận, truyện ngắn, bài báo — mọi thứ trong một thư viện cá nhân.",
  },
  {
    icon: Sparkles,
    title: "Chấm bài bằng AI",
    description:
      "Nhận điểm tổng quan, phản hồi theo tiêu chí và bài mẫu tham khảo trong vài giây.",
  },
  {
    icon: Lightbulb,
    title: "Gợi ý sửa từng câu",
    description:
      "AI gợi ý chỉnh ngữ pháp, văn phong và cấu trúc ngay trong không gian chữa bài.",
  },
  {
    icon: History,
    title: "Hành trình chỉnh sửa",
    description:
      "Lưu timeline từng phiên bản, so sánh điểm trước–sau và khôi phục khi cần.",
  },
  {
    icon: Globe,
    title: "Khám phá cộng đồng",
    description:
      "Đọc bài viết công khai từ người khác và chia sẻ tác phẩm của bạn.",
  },
  {
    icon: Sparkles,
    title: "Chấm lại sau khi sửa",
    description:
      "Chữa bài xong chấm lại ngay — thấy rõ mình tiến bộ ở đâu qua từng báo cáo.",
  },
];

export function LandingFeatures() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-medium uppercase tracking-wider text-primary">
          Tính năng
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-fg sm:text-4xl">
          Mọi công cụ bạn cần để luyện viết
        </h2>
        <p className="mt-4 text-muted leading-relaxed">
          Từ ý tưởng đầu tiên đến bài hoàn chỉnh — quy trình viết, chấm, chữa
          và cải thiện được thiết kế liền mạch.
        </p>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
        {FEATURES.map((feature) => {
          const Icon = feature.icon;
          return (
            <article
              key={feature.title}
              className={cn(
                "stat-card-glow panel-glass p-5 sm:p-6 transition-all duration-200",
                "hover:-translate-y-0.5 hover:shadow-[0_0_28px_var(--glow-primary)] hover:border-primary/25",
              )}
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/25 shadow-[0_0_16px_var(--glow-primary)]">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-lg font-semibold text-fg">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {feature.description}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
