import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/button";
import { ROUTES } from "@/constants/routes.constants";
import { landingMessages as m } from "@/messages/landing";

export function LandingCta({ isAuthenticated }: { isAuthenticated: boolean }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="page-header-glass relative overflow-hidden p-8 sm:p-10 lg:p-12 text-center">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-48 w-48 -translate-x-1/2 rounded-full bg-primary/15 blur-3xl"
        />

        <div className="relative mx-auto max-w-2xl space-y-6">
          <h2 className="text-3xl font-bold tracking-tight text-fg sm:text-4xl">
            {m.cta.title}
          </h2>
          <p className="text-muted leading-relaxed">
            {m.cta.description}
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            {isAuthenticated ? (
              <Link href={ROUTES.WRITING_NEW}>
                <Button size="lg" className="gap-2 btn-glow-solid">
                  {m.cta.newWriting}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <>
                <Link href={ROUTES.REGISTER}>
                  <Button size="lg" className="gap-2 btn-glow-solid">
                    {m.cta.registerFree}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href={ROUTES.LOGIN}>
                  <Button size="lg" variant="secondary">
                    {m.cta.hasAccount}
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
