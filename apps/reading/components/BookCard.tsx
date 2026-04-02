"use client";

import type { ReadwiseBook } from "@/lib/types";

/**
 * A clickable card displaying a book cover, title, and author.
 *
 * Shows the book's cover image (or a colored placeholder with the title)
 * along with a badge indicating the number of highlights. Clicking the
 * card triggers the `onClick` handler to open the book detail modal.
 *
 * @param book - The Readwise book data to display.
 * @param onClick - Callback invoked when the card is clicked.
 */
export function BookCard({
  book,
  onClick,
}: {
  book: ReadwiseBook;
  onClick: () => void;
}) {
  return (
    <button onClick={onClick} className="text-left">
      <div className="relative">
        {book.cover_image_url ? (
          <img // eslint-disable-line @next/next/no-img-element
            src={book.cover_image_url}
            alt={book.title}
            className="aspect-[2/3] w-full rounded object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex aspect-[2/3] w-full items-center justify-center rounded bg-accent p-2">
            <span className="text-center font-heading text-[10px] leading-tight text-bg">
              {book.title}
            </span>
          </div>
        )}
        {book.num_highlights > 0 && (
          <span className="absolute bottom-1 right-1 rounded bg-accent/85 px-1.5 py-0.5 font-mono text-[9px] text-white">
            {book.num_highlights}
          </span>
        )}
      </div>
      <h3 className="mt-1.5 line-clamp-2 font-body text-[11px] font-medium leading-tight text-text-primary">
        {book.title}
      </h3>
      <p className="font-body text-[9px] text-text-muted">{book.author}</p>
    </button>
  );
}
