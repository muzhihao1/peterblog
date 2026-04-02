import type { DayData } from "@/lib/types";
import { HighlightItem } from "./HighlightItem";
import { NoteItem } from "./NoteItem";

/**
 * Timeline view of a single day's reading highlights, grouped by book.
 *
 * Each book section shows the cover image (or a placeholder), title,
 * author, and all highlights captured that day in chronological order.
 * Notes attached to highlights are rendered inline below each highlight.
 *
 * Displays a centered "no highlights" message when the day has no data.
 *
 * @param data - The aggregated reading data for one calendar day.
 */
export function DayTimeline({ data }: { data: DayData }) {
  if (data.books.length === 0) {
    return (
      <p className="mt-8 text-center font-body text-sm text-text-muted">
        No reading highlights for this day.
      </p>
    );
  }

  return (
    <div>
      {data.books.map(({ book, highlights }) => (
        <div key={book.id} className="mb-8">
          <div className="mb-4 flex items-center gap-3">
            {book.cover_image_url ? (
              <img // eslint-disable-line @next/next/no-img-element
                src={book.cover_image_url}
                alt={book.title}
                className="h-[52px] w-9 rounded object-cover"
              />
            ) : (
              <div className="flex h-[52px] w-9 items-center justify-center rounded bg-accent">
                <span className="font-mono text-[8px] text-bg">Book</span>
              </div>
            )}
            <div>
              <h3 className="font-body text-sm font-semibold text-text-primary">
                {book.title}
              </h3>
              <p className="font-body text-[11px] text-text-muted">
                {book.author}
              </p>
            </div>
          </div>
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
      ))}
    </div>
  );
}
