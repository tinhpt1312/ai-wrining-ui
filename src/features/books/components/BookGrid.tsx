import { BookCard } from "./BookCard";
import type { Book } from "@/types/api";

export function BookGrid({ books }: { books: Book[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
}
