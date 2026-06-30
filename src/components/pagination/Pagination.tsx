import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/button";
import { cn } from "@/lib/utils";
import { commonMessages } from "@/messages/common";
import { msg } from "@/messages/format";

export function Pagination({
  currentPage,
  totalPages,
  onPrevious,
  onNext,
  className,
}: {
  currentPage: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
  className?: string;
}) {
  if (totalPages <= 1) return null;

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-3 pt-2",
        className,
      )}
    >
      <Button
        variant="outline"
        size="sm"
        onClick={onPrevious}
        disabled={currentPage <= 1}
        className="gap-1"
      >
        <ChevronLeft className="h-4 w-4" />
        {commonMessages.pagination.prev}
      </Button>
      <span className="text-sm text-muted tabular-nums min-w-[7rem] text-center">
        {msg(commonMessages.pagination.page, {
          current: currentPage,
          total: totalPages,
        })}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={onNext}
        disabled={currentPage >= totalPages}
        className="gap-1"
      >
        {commonMessages.pagination.next}
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
