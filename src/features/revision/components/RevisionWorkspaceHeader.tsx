import Link from "next/link";
import { ArrowLeft, History, Sparkles } from "lucide-react";
import { Button } from "@/components/button";
import { ROUTES } from "@/constants/routes.constants";
import { formatDateTime } from "@/utils/helpers";
import { scoreTextColor } from "@/features/analysis/utils/score.utils";
import { RevisionStepper } from "./RevisionStepper";
import { cn } from "@/lib/utils";
import type { Analytics, Writing } from "@/types/api";
import { revisionMessages } from "@/messages/revision";
import { msg } from "@/messages/format";

interface RevisionWorkspaceHeaderProps {
  writing: Writing;
  writingId: string;
  analysis?: Analytics;
  score: number | null;
  currentStep: "graded" | "revising" | "regrade";
  hasUnsavedChanges: boolean;
  isRegrading: boolean;
  onRegrade: () => void;
}

export function RevisionWorkspaceHeader({
  writing,
  writingId,
  analysis,
  score,
  currentStep,
  hasUnsavedChanges,
  isRegrading,
  onRegrade,
}: RevisionWorkspaceHeaderProps) {
  return (
    <section className="panel-glass shrink-0 p-4 sm:p-5">
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 min-w-0 flex-1">
          <Link
            href={ROUTES.writing(writingId)}
            className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-fg transition-colors shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
            {revisionMessages.header.backToWriting}
          </Link>
          <div className="hidden sm:block h-4 w-px bg-border shrink-0" />
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-bold text-fg tracking-tight truncate">
              {msg(revisionMessages.header.title, { title: writing.title })}
            </h1>
            <p className="text-xs sm:text-sm text-muted truncate">
              {revisionMessages.header.subtitle}
              {analysis && (
                <>
                  {" "}
                  · {formatDateTime(analysis.createdAt)}
                  {score != null && (
                    <span
                      className={cn(
                        "font-semibold font-mono",
                        scoreTextColor(score),
                      )}
                    >
                      {" "}
                      · {score}/10
                    </span>
                  )}
                </>
              )}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <RevisionStepper currentStep={currentStep} />
          <div className="hidden sm:block h-6 w-px bg-border mx-1" />
          <Button
            size="sm"
            className="gap-1.5 btn-glow-solid"
            onClick={onRegrade}
            disabled={isRegrading || hasUnsavedChanges}
            isLoading={isRegrading}
          >
            <Sparkles className="h-4 w-4" />
            {revisionMessages.header.regrade}
          </Button>
          <Link href={ROUTES.writingJourney(writingId)}>
            <Button size="sm" variant="outline" className="gap-1.5">
              <History className="h-4 w-4" />
              {revisionMessages.header.journey}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
