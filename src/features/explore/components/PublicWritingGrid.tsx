import type { Writing } from "@/types/api";
import { PublicWritingCard } from "./PublicWritingCard";

export function PublicWritingGrid({ writings }: { writings: Writing[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {writings.map((writing) => (
        <PublicWritingCard key={writing.id} writing={writing} />
      ))}
    </div>
  );
}
