"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/tabs";
import { BookCategory } from "@/types/api";
import { booksMessages } from "@/messages/books";

const ALL_CATEGORIES = "all";

const CATEGORY_OPTIONS = Object.values(BookCategory);

export function BookCategoryTabs({
  value,
  onChange,
}: {
  value: string;
  onChange: (category: string) => void;
}) {
  return (
    <Tabs
      value={value || ALL_CATEGORIES}
      onValueChange={(next) => onChange(next === ALL_CATEGORIES ? "" : next)}
    >
      <TabsList className="w-full sm:w-auto flex-nowrap overflow-x-auto overflow-y-hidden scrollbar-none">
        <TabsTrigger value={ALL_CATEGORIES}>
          {booksMessages.filter.allCategories}
        </TabsTrigger>
        {CATEGORY_OPTIONS.map((category) => (
          <TabsTrigger key={category} value={category}>
            {booksMessages.category[category]}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
