import Link from "next/link";
import { ROUTES } from "@/constants/routes.constants";
import { appMessages } from "@/messages/app";
import { landingMessages as m } from "@/messages/landing";
import { msg } from "@/messages/format";

export function LandingFooter() {
  return (
    <footer className="border-t border-border/60 py-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 text-center sm:flex-row sm:px-6 sm:text-left lg:px-8">
        <p className="text-xs text-subtle">
          {msg(appMessages.footer, { year: new Date().getFullYear() })}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted">
          <Link href={ROUTES.LOGIN} className="hover:text-primary transition-colors">
            {m.footer.login}
          </Link>
          <Link
            href={ROUTES.REGISTER}
            className="hover:text-primary transition-colors"
          >
            {m.footer.register}
          </Link>
        </div>
      </div>
    </footer>
  );
}
