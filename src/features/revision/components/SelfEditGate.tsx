"use client";

import Link from "next/link";
import { Lock, PenLine, Sparkles } from "lucide-react";
import { Button } from "@/components/button";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants/routes.constants";
import {
  MIN_SELF_EDIT_CHARS,
  getSelfEditProgress,
} from "@/features/revision/utils/self-edit.utils";
import { revisionMessages } from "@/messages/revision";
import { msg } from "@/messages/format";

interface SelfEditGateProps {
  unlocked: boolean;
  baseline: string;
  current: string;
  writingId?: string;
  analysisId?: string;
  title?: string;
  description?: string;
  className?: string;
  children: React.ReactNode;
}

export function SelfEditGate({
  unlocked,
  baseline,
  current,
  writingId,
  analysisId,
  title = revisionMessages.selfEdit.defaultTitle,
  description = msg(revisionMessages.selfEdit.defaultDescription, {
    minChars: MIN_SELF_EDIT_CHARS,
  }),
  className,
  children,
}: SelfEditGateProps) {
  const progress = getSelfEditProgress(baseline, current);

  if (unlocked) {
    return <>{children}</>;
  }

  return (
    <div className={cn("relative", className)}>
      <div className="pointer-events-none select-none opacity-40 blur-[1px]">
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="panel-glass max-w-md w-full p-5 sm:p-6 text-center space-y-4 shadow-xl">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-warning/15 text-warning mx-auto">
            <Lock className="h-5 w-5" />
          </span>
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-fg">{title}</h3>
            <p className="text-sm text-muted leading-relaxed">{description}</p>
          </div>
          {baseline && current !== baseline && (
            <div className="space-y-2">
              <div className="h-2 rounded-full bg-surface-2 overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-muted">
                {msg(revisionMessages.selfEdit.progress, {
                  progress,
                  minChars: MIN_SELF_EDIT_CHARS,
                })}
              </p>
            </div>
          )}
          {writingId && (
            <Link href={ROUTES.writingRevise(writingId, analysisId)}>
              <Button className="gap-1.5 w-full btn-glow-solid">
                <PenLine className="h-4 w-4" />
                {revisionMessages.selfEdit.enterRevision}
              </Button>
            </Link>
          )}
          <p className="text-xs text-subtle flex items-center justify-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5" />
            {revisionMessages.selfEdit.unlockHint}
          </p>
        </div>
      </div>
    </div>
  );
}
