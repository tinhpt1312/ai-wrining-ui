import Link from "next/link";
import { ROUTES } from "@/constants/routes.constants";

export default function ShareWritingNotFound() {
  return (
    <div className="card-elevated p-8 text-center space-y-4">
      <h1 className="text-lg font-semibold text-fg">Không thể xem bài viết</h1>
      <p className="text-sm text-muted">
        Bài viết không tồn tại hoặc chưa được đặt ở trạng thái công khai.
      </p>
      <Link href={ROUTES.LOGIN} className="text-sm text-primary hover:underline">
        Đăng nhập để tiếp tục
      </Link>
    </div>
  );
}
