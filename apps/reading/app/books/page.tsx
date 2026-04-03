/**
 * Books page — displays all books from the Readwise library in a filterable grid.
 *
 * Server component that fetches the full book list at request time, then
 * delegates rendering and interactivity to the client-side BookGrid component.
 * Revalidates every hour via ISR. Falls back to an empty list if the
 * Readwise API is unavailable (e.g. during build without a token).
 */
import type { Metadata } from "next";
import type { ReadwiseBook } from "@/lib/types";
import { getBooks } from "@/lib/readwise";
import { BookGrid } from "@/components/BookGrid";

export const metadata: Metadata = { title: "Book Wall" };
export const dynamic = "force-dynamic";

export default async function BooksPage() {
  let books: ReadwiseBook[];
  try {
    const allBooks = await getBooks();
    books = allBooks.filter((b) => b.category === "books");
  } catch {
    books = [];
  }

  return (
    <div className="mx-auto max-w-content-wide px-10 py-10 max-md:px-5">
      <div className="animate-slide-up mb-2 flex items-baseline justify-between">
        <h1 className="font-heading text-[28px] font-bold text-text-primary">
          Book Wall
        </h1>
        <span className="font-mono text-section-label uppercase text-text-muted">
          {books.length} {books.length === 1 ? "book" : "books"}
        </span>
      </div>
      <div className="animate-slide-up delay-1">
        <BookGrid books={books} />
      </div>
    </div>
  );
}
