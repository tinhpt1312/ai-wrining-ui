"use client";

import { Suspense } from "react";
import { BooksListView } from "@/features/books";
import { Loading } from "@/components/loading";
import { commonMessages } from "@/messages/common";

export default function BooksPage() {
  return (
    <Suspense fallback={<Loading fullScreen text={commonMessages.loading} />}>
      <BooksListView />
    </Suspense>
  );
}
