"use client";

import { useEffect } from "react";
import type { BookWithHighlights } from "@/lib/types";
import { HighlightItem } from "./HighlightItem";
import { NoteItem } from "./NoteItem";

/**
 * Full-screen modal overlay displaying a book's highlights and notes.
 *
 * Shows the book cover, title, author, and highlight count in a header
 * section, followed by a scrollable list of all highlights (with any
 * attached notes rendered inline). Closes on backdrop click or Escape key.
 * Body scroll is locked while the modal is open.
 *
 * @param data - The book with its full list of highlights.
 * @param onClose - Callback to close the modal.
 */
export function BookModal({
  data,
  onClose,
}: {
  data: BookWithHighlights;
  onClose: () => void;
}) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const { book, highlights } = data;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-text-primary/20 p-4"
      onClick={onClose}
    >
      <div
        className="relative max-h-[85vh] w-full max-w-[700px] overflow-y-auto rounded-xl bg-bg p-8 shadow-[0_16px_48px_rgba(28,26,23,0.2)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 font-mono text-lg text-text-muted hover:text-text-primary"
        >
          &times;
        </button>
        <div className="mb-6 flex gap-4">
          {book.cover_image_url ? (
            <img // eslint-disable-line @next/next/no-img-element
              src={book.cover_image_url}
              alt={book.title}
              className="aspect-[2/3] w-20 rounded object-cover"
            />
          ) : (
            <div className="flex aspect-[2/3] w-20 items-center justify-center rounded bg-accent p-2">
              <span className="text-center font-heading text-xs text-bg">
                {book.title}
              </span>
            </div>
          )}
          <div>
            <h2 className="font-heading text-xl font-bold text-text-primary">
              {book.title}
            </h2>
            <p className="mt-1 font-body text-sm text-text-muted">
              {book.author}
            </p>
            <p className="mt-2 font-mono text-section-label uppercase text-text-label">
              {highlights.length} highlights
            </p>
          </div>
        </div>
        <div>
          {highlights.map((hl) => (
            <div key={hl.id}>
              <HighlightItem
                text={hl.text}
                highlightedAt={hl.highlighted_at}
              />
              {hl.note && hl.note.trim() && <NoteItem text={hl.note} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
