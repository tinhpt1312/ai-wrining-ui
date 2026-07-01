"use client";

import { use } from "react";
import { BookDetailView } from "@/features/books";

interface BookDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function BookDetailPage({ params }: BookDetailPageProps) {
  const { id } = use(params);
  return <BookDetailView id={id} />;
}
