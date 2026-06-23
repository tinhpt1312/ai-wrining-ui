import Link from "next/link";
import { PenLine, Sparkles } from "lucide-react";
import { ROUTES } from "@/constants/routes.constants";
import { cn } from "@/lib/utils";

const footerLinks = [
  { href: ROUTES.DASHBOARD, label: "Tổng quan" },
  { href: ROUTES.WRITINGS, label: "Bài viết" },
  { href: ROUTES.EXPLORE, label: "Khám phá" },
  { href: ROUTES.ANALYSIS, label: "Chấm bài" },
  { href: ROUTES.PROFILE, label: "Hồ sơ" },
];

export default function Footer({ compact = false }: { compact?: boolean }) {
  const year = new Date().getFullYear();

  return (
    <footer
      className={cn(
        "mt-auto border-t border-border",
        compact ? "py-4" : "py-8",
      )}
    >
      <div className="container mx-auto px-4 max-w-6xl">
        {compact ? (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <Link
              href={ROUTES.DASHBOARD}
              className="inline-flex items-center gap-2 text-sm font-semibold text-fg hover:text-primary transition-colors"
            >
              <PenLine className="h-4 w-4 text-primary" />
              Viết & Chấm Văn
            </Link>
            <p className="text-xs text-subtle">
              © {year} — Luyện viết & phản hồi AI
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="sm:col-span-2 lg:col-span-2 space-y-3">
              <Link
                href={ROUTES.DASHBOARD}
                className="inline-flex items-center gap-2.5 group"
              >
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary-soft text-primary ring-1 ring-primary/20 transition-transform group-hover:scale-105">
                  <PenLine className="h-4 w-4" />
                </span>
                <span className="text-base font-bold text-fg group-hover:text-primary transition-colors">
                  Viết & Chấm Văn
                </span>
              </Link>
              <p className="text-sm text-muted leading-relaxed max-w-sm">
                Nền tảng viết văn và nhận phản hồi chấm bài bằng AI — luyện
                tập có hệ thống, cải thiện từng bài một.
              </p>
              <p className="inline-flex items-center gap-1.5 text-xs text-primary font-medium">
                <Sparkles className="h-3.5 w-3.5" />
                Hỗ trợ bởi AI
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-fg mb-3">Điều hướng</h3>
              <ul className="space-y-2">
                {footerLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-fg mb-3">Bắt đầu</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href={ROUTES.WRITING_NEW}
                    className="text-sm text-muted hover:text-primary transition-colors"
                  >
                    Viết bài mới
                  </Link>
                </li>
                <li>
                  <Link
                    href={ROUTES.EXPLORE}
                    className="text-sm text-muted hover:text-primary transition-colors"
                  >
                    Khám phá cộng đồng
                  </Link>
                </li>
                <li>
                  <Link
                    href={ROUTES.LOGIN}
                    className="text-sm text-muted hover:text-primary transition-colors"
                  >
                    Đăng nhập
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        )}

        {!compact && (
          <div className="mt-8 pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-subtle">
            <p>© {year} Viết & Chấm Văn. Dành cho mục đích học tập.</p>
            <p>Luyện viết · Phản hồi AI · Cộng đồng</p>
          </div>
        )}
      </div>
    </footer>
  );
}
