import Link from "next/link";
import type { ArchiveEntry } from "@/lib/types";

/**
 * A single row in the archive list linking to a specific reading day.
 *
 * Displays the date (MM/DD format), a summary of books and highlights
 * for that day, and a highlight count badge on the right side.
 * Clicking the row navigates to the Today page with the date pre-selected.
 *
 * @param entry - The archive summary for one calendar day.
 */
export function ArchiveRow({ entry }: { entry: ArchiveEntry }) {
  const date = new Date(entry.date + "T00:00:00");
  const formatted = date.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
  });

  return (
    <Link
      href={`/?date=${entry.date}`}
      className="flex items-center justify-between border-b border-border py-3 hover:bg-bg-section"
    >
      <div className="flex items-center gap-4">
        <span className="w-12 font-mono text-[11px] text-text-muted">
          {formatted}
        </span>
        <span className="font-mono text-[10px] text-text-body">
          {entry.bookCount} {entry.bookCount === 1 ? "book" : "books"} &middot;{" "}
          {entry.highlightCount} {entry.highlightCount === 1 ? "highlight" : "highlights"}
        </span>
      </div>
      <span className="rounded bg-accent/85 px-1.5 py-0.5 font-mono text-[9px] text-white">
        {entry.highlightCount}
      </span>
    </Link>
  );
}
