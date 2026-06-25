import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/button";
import { ROUTES } from "@/constants/routes.constants";

export default function ShareAnalysisNotFound() {
  return (
    <div className="panel-glass p-8 text-center space-y-4">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-2/80 text-muted ring-1 ring-border/60">
        <Sparkles className="h-6 w-6" />
      </div>
      <h1 className="text-lg font-semibold text-fg">
        Không thể xem kết quả chấm bài
      </h1>
      <p className="text-sm text-muted max-w-sm mx-auto">
        Kết quả không tồn tại hoặc bài viết chưa được đặt ở trạng thái công khai.
      </p>
      <Link href={ROUTES.LOGIN}>
        <Button className="btn-glow-solid">Đăng nhập để tiếp tục</Button>
      </Link>
    </div>
  );
}
