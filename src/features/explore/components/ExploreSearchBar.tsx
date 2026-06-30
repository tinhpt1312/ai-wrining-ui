"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/input";
import { Button } from "@/components/button";
import { exploreMessages } from "@/messages/explore";

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
      className="panel-glass p-4 flex flex-col sm:flex-row gap-3"
    >
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary/70" />
        <Input
          name="search"
          placeholder={exploreMessages.search.placeholder}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
          aria-label={exploreMessages.search.ariaLabel}
        />
      </div>
      <Button type="submit" className="shrink-0 btn-glow-solid">
        {exploreMessages.search.submit}
      </Button>
    </form>
  );
}
