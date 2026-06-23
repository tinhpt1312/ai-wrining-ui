import type { Writing } from "@/types/api";
import { WritingCard } from "./WritingCard";

export function WritingCardGrid({
  writings,
  onDelete,
  isDeleting,
}: {
  writings: Writing[];
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {writings.map((writing) => (
        <WritingCard
          key={writing.id}
          writing={writing}
          onDelete={onDelete}
          isDeleting={isDeleting}
        />
      ))}
    </div>
  );
}
