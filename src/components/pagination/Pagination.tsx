import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/button";
import { cn } from "@/lib/utils";

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
        Trước
      </Button>
      <span className="text-sm text-muted tabular-nums min-w-[7rem] text-center">
        Trang {currentPage} / {totalPages}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={onNext}
        disabled={currentPage >= totalPages}
        className="gap-1"
      >
        Sau
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
