"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/tabs";
import { writingTypeOptions } from "@/utils/helpers";
import { commonMessages } from "@/messages/common";

const ALL_TYPES = "all";

export function ExploreTypeTabs({
  value,
  onChange,
}: {
  value: string;
  onChange: (type: string) => void;
}) {
  return (
    <Tabs
      value={value || ALL_TYPES}
      onValueChange={(next) => onChange(next === ALL_TYPES ? "" : next)}
    >
      <TabsList className="w-full sm:w-auto flex-nowrap overflow-x-auto overflow-y-hidden scrollbar-none">
        <TabsTrigger value={ALL_TYPES}>{commonMessages.filter.all}</TabsTrigger>
        {writingTypeOptions.map((option) => (
          <TabsTrigger key={option.value} value={option.value}>
            {option.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
