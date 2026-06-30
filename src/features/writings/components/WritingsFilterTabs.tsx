"use client";

import { commonMessages } from "@/messages/common";
import { writingMessages } from "@/messages/writing";
import { Tabs, TabsList, TabsTrigger } from "@/components/tabs";
import { writingTypeOptions } from "@/utils/helpers";
import * as types from "@/types/api";

const ALL_TYPES = "all";
const ALL_STATUS = "all";

const statusTabs = [
  { value: ALL_STATUS, label: commonMessages.filter.all },
  { value: types.WritingStatus.DRAFT, label: writingMessages.status.draftFilter },
  { value: types.WritingStatus.PUBLIC, label: writingMessages.status.publicFilter },
];

export function WritingsFilterTabs({
  typeValue,
  statusValue,
  onTypeChange,
  onStatusChange,
}: {
  typeValue: string;
  statusValue: string;
  onTypeChange: (type: string) => void;
  onStatusChange: (status: string) => void;
}) {
  return (
    <div className="space-y-3">
      <Tabs
        value={typeValue || ALL_TYPES}
        onValueChange={(next) => onTypeChange(next === ALL_TYPES ? "" : next)}
      >
        <TabsList className="w-full sm:w-auto flex-nowrap overflow-x-auto overflow-y-hidden scrollbar-none">
          <TabsTrigger value={ALL_TYPES}>{commonMessages.filter.allTypes}</TabsTrigger>
          {writingTypeOptions.map((option) => (
            <TabsTrigger key={option.value} value={option.value}>
              {option.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <Tabs
        value={statusValue || ALL_STATUS}
        onValueChange={(next) =>
          onStatusChange(next === ALL_STATUS ? "" : next)
        }
      >
        <TabsList className="w-full sm:w-auto">
          {statusTabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
