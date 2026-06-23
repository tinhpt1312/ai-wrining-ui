"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/input";
import { Button } from "@/components/button";

export function ExploreSearchBar({
  search,
  onSearchChange,
  onSubmit,
}: {
  search: string;
  onSearchChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="card-elevated p-4 flex flex-col sm:flex-row gap-3"
    >
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
        <Input
          name="search"
          placeholder="Tìm tiêu đề, nội dung..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
          aria-label="Tìm kiếm bài viết"
        />
      </div>
      <Button type="submit" className="shrink-0">
        Tìm kiếm
      </Button>
    </form>
  );
}
