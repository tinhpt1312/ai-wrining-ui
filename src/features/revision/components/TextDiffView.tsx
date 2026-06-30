"use client";

import { useMemo } from "react";
import { diffWords } from "diff";
import { cn } from "@/lib/utils";
import { revisionMessages } from "@/messages/revision";

export function TextDiffView({
  original,
  revised,
  className,
}: {
  original: string;
  revised: string;
  className?: string;
}) {
  const parts = useMemo(
    () => diffWords(original || "", revised || ""),
    [original, revised],
  );

  if (!original && !revised) {
    return (
      <p className="text-sm text-muted italic">
        {revisionMessages.diff.noContent}
      </p>
    );
  }

  return (
    <div
      className={cn(
        "whitespace-pre-wrap break-words text-sm leading-relaxed",
        className,
      )}
    >
      {parts.map((part, i) => (
        <span
          key={i}
          className={cn(
            part.added && "bg-success-soft text-success rounded px-0.5",
            part.removed &&
              "bg-error-soft text-error line-through rounded px-0.5",
            !part.added && !part.removed && "text-fg",
          )}
        >
          {part.value}
        </span>
      ))}
    </div>
  );
}
