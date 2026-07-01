"use client";

import { Suspense, use } from "react";
import { BookReaderView } from "@/features/books";
import { Loading } from "@/components/loading";
import { booksMessages } from "@/messages/books";

interface BookReadPageProps {
  params: Promise<{ id: string }>;
}

export default function BookReadPage({ params }: BookReadPageProps) {
  const { id } = use(params);
  return (
    <Suspense fallback={<Loading fullScreen text={booksMessages.reader.loading} />}>
      <BookReaderView bookId={id} />
    </Suspense>
  );
}
