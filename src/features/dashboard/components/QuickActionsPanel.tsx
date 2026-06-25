import Link from "next/link";
import { PenLine, BookOpen } from "lucide-react";
import { Button } from "@/components/button";
import { ROUTES } from "@/constants/routes.constants";

export function QuickActionsPanel() {
  return (
    <section className="card-elevated p-5 sm:p-6 h-full flex flex-col">
      <h2 className="text-sm font-semibold text-fg mb-4">Thao tác nhanh</h2>
      <div className="space-y-2.5 flex-1">
        <Link href={ROUTES.WRITING_NEW} className="block">
          <Button className="w-full gap-2 btn-glow-solid">
            <PenLine className="h-4 w-4" />
            Viết bài mới
          </Button>
        </Link>
        <Link href={`${ROUTES.WRITING_NEW}?tab=prompts`} className="block">
          <Button className="w-full gap-2" variant="secondary">
            <BookOpen className="h-4 w-4" />
            Luyện với đề gợi ý
          </Button>
        </Link>
        <Link href={ROUTES.ANALYSIS} className="block">
          <Button className="w-full" variant="secondary">
            Xem kết quả chấm
          </Button>
        </Link>
        <Link href={ROUTES.WRITINGS} className="block">
          <Button className="w-full" variant="outline">
            Danh sách bài viết
          </Button>
        </Link>
        <Link href={ROUTES.EXPLORE} className="block">
          <Button className="w-full" variant="ghost">
            Khám phá cộng đồng
          </Button>
        </Link>
      </div>
    </section>
  );
}
