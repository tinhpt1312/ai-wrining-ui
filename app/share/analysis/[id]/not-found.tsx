import Link from "next/link";
import { ROUTES } from "@/constants/routes.constants";

export default function ShareAnalysisNotFound() {
  return (
    <div className="card-elevated p-8 text-center space-y-4">
      <h1 className="text-lg font-semibold text-fg">
        Không thể xem kết quả chấm bài
      </h1>
      <p className="text-sm text-muted">
        Kết quả không tồn tại hoặc bài viết chưa được đặt ở trạng thái công khai.
      </p>
      <Link href={ROUTES.LOGIN} className="text-sm text-primary hover:underline">
        Đăng nhập để tiếp tục
      </Link>
    </div>
  );
}
