"use client";

import { Check, Sparkles, PenLine, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: "graded", label: "Đã chấm", icon: Sparkles },
  { id: "revising", label: "Đang chữa", icon: PenLine },
  { id: "regrade", label: "Chấm lại", icon: RefreshCw },
] as const;

export type RevisionStep = (typeof STEPS)[number]["id"];

export function RevisionStepper({
  currentStep,
  className,
}: {
  currentStep: RevisionStep;
  className?: string;
}) {
  const currentIndex = STEPS.findIndex((s) => s.id === currentStep);

  return (
    <nav
      aria-label="Tiến trình chữa bài"
      className={cn("flex items-center gap-2 sm:gap-4", className)}
    >
      {STEPS.map((step, index) => {
        const Icon = step.icon;
        const isComplete = index < currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <div key={step.id} className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors",
                  isComplete && "border-success bg-success-soft text-success",
                  isCurrent && "border-primary bg-primary-soft text-primary",
                  !isComplete &&
                    !isCurrent &&
                    "border-border bg-surface-2 text-subtle",
                )}
              >
                {isComplete ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Icon className="h-4 w-4" />
                )}
              </div>
              <span
                className={cn(
                  "text-xs sm:text-sm font-medium hidden sm:inline",
                  isCurrent ? "text-fg" : "text-muted",
                )}
              >
                {step.label}
              </span>
            </div>
            {index < STEPS.length - 1 && (
              <div
                className={cn(
                  "h-0.5 w-6 sm:w-12 rounded-full",
                  index < currentIndex ? "bg-success" : "bg-border",
                )}
              />
            )}
          </div>
        );
      })}
    </nav>
  );
}
