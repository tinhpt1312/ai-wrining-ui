"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import WritingSuggestions from "@/components/WritingSuggestions";

export default function WritingDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const writingId = params.id;
  const [writing, setWriting] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWriting();
  }, [writingId]);

  const fetchWriting = async () => {
    try {
      // Fetch from API
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch writing:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Writing Feedback</h1>
        <Link href="/writings" className="text-blue-600 hover:underline">
          ← Back to Writings
        </Link>
      </div>

      <WritingSuggestions writingId={writingId} />
    </div>
  );
}
