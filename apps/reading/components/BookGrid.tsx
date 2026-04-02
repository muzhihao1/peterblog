"use client";

import { useState, useMemo, useCallback } from "react";
import type { ReadwiseBook, BookWithHighlights } from "@/lib/types";
import { BookCard } from "./BookCard";
import { BookModal } from "./BookModal";
import { SortControls, type SortMode } from "./SortControls";

/**
 * Interactive grid of book cards with sorting, filtering, and a detail modal.
 *
 * Manages client-side state for sort mode, search query, year filter, and
 * the currently selected book's modal. When a book card is clicked, fetches
 * the book's highlights from the API route and displays them in a modal.
 *
 * @param books - The full list of books to display (fetched server-side).
 */
export function BookGrid({ books }: { books: ReadwiseBook[] }) {
  const [sort, setSort] = useState<SortMode>("recent");
  const [search, setSearch] = useState("");
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [modalData, setModalData] = useState<BookWithHighlights | null>(null);

  /** Extract unique years from books for the year filter dropdown. */
  const years = useMemo(() => {
    const yearSet = new Set<number>();
    books.forEach((b) => {
      const date = b.last_highlight_at || b.updated;
      if (date) yearSet.add(new Date(date).getFullYear());
    });
    return Array.from(yearSet).sort((a, b) => b - a);
  }, [books]);

  /** Apply search, year filter, and sort to produce the displayed list. */
  const filtered = useMemo(() => {
    let result = [...books];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q)
      );
    }
    if (selectedYear) {
      result = result.filter((b) => {
        const date = b.last_highlight_at || b.updated;
        return date && new Date(date).getFullYear() === selectedYear;
      });
    }
    switch (sort) {
      case "highlights":
        result.sort((a, b) => b.num_highlights - a.num_highlights);
        break;
      case "title":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        result.sort(
          (a, b) =>
            new Date(b.last_highlight_at || b.updated).getTime() -
            new Date(a.last_highlight_at || a.updated).getTime()
        );
    }
    return result;
  }, [books, sort, search, selectedYear]);

  /** Fetch book highlights from the API and open the modal. */
  const handleBookClick = useCallback(async (bookId: number) => {
    const res = await fetch(`/api/book/${bookId}`);
    if (res.ok) {
      const data: BookWithHighlights = await res.json();
      setModalData(data);
    }
  }, []);

  return (
    <>
      <SortControls
        sort={sort}
        onSortChange={setSort}
        search={search}
        onSearchChange={setSearch}
        years={years}
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
      />
      <div className="grid grid-cols-4 gap-5 max-md:grid-cols-2">
        {filtered.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            onClick={() => handleBookClick(book.id)}
          />
        ))}
      </div>
      {modalData && (
        <BookModal data={modalData} onClose={() => setModalData(null)} />
      )}
    </>
  );
}
