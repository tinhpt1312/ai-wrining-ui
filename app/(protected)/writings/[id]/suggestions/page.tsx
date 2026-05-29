"use client";

import { use } from "react";
import Link from "next/link";
import WritingSuggestions from "@/components/WritingSuggestions";
import { useWriting } from "@/hooks/useApi";
import { Loading, Error as ErrorState } from "@/components/ui/States";
import { Button } from "@/components/ui/Button";

export default function WritingDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: writingId } = use(params);
  const { data: writing, isLoading, error } = useWriting(writingId);

  if (isLoading) {
    return <Loading text="Loading writing..." />;
  }

  if (error || !writing) {
    return (
      <ErrorState
        title="Failed to Load Writing"
        message="Could not fetch this writing for suggestions."
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black dark:text-white">
            Writing Suggestions
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {writing.title}
          </p>
        </div>
        <Link href={`/writings/${writingId}`}>
          <Button variant="outline">Back to Writing</Button>
        </Link>
      </div>

      <WritingSuggestions writingId={writingId} />
    </div>
  );
}
