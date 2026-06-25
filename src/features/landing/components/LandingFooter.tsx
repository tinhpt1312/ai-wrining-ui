import Link from "next/link";
import { ROUTES } from "@/constants/routes.constants";

export function LandingFooter() {
  return (
    <footer className="border-t border-border/60 py-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 text-center sm:flex-row sm:px-6 sm:text-left lg:px-8">
        <p className="text-xs text-subtle">
          © {new Date().getFullYear()} Viết &amp; Chấm Văn — Luyện viết &amp;
          phản hồi AI
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted">
          <Link href={ROUTES.LOGIN} className="hover:text-primary transition-colors">
            Đăng nhập
          </Link>
          <Link
            href={ROUTES.REGISTER}
            className="hover:text-primary transition-colors"
          >
            Đăng ký
          </Link>
        </div>
      </div>
    </footer>
  );
}
