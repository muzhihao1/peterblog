/**
 * Type definitions for the Readwise API integration.
 *
 * These types model the data returned by the Readwise v2 API
 * and the derived structures used throughout the reading site.
 */

/**
 * A book (or article/podcast/etc.) from the Readwise library.
 * Represents a single source that contains one or more highlights.
 */
export interface ReadwiseBook {
  id: number;
  title: string;
  author: string;
  category: string;
  source: string;
  cover_image_url: string | null;
  num_highlights: number;
  last_highlight_at: string | null;
  updated: string;
  highlights_url: string;
}

/**
 * A single highlight (passage) captured from a book or article.
 * May include an optional note (annotation) added by the reader.
 */
export interface ReadwiseHighlight {
  id: number;
  text: string;
  note: string;
  location: number;
  location_type: string;
  highlighted_at: string | null;
  url: string | null;
  color: string;
  updated: string;
  book_id: number;
  tags: { id: number; name: string }[];
}

/**
 * A book paired with all of its highlights.
 * Used on detail views where the full highlight list is shown.
 */
export interface BookWithHighlights {
  book: ReadwiseBook;
  highlights: ReadwiseHighlight[];
}

/**
 * Aggregated reading data for a single calendar day.
 * Groups highlights by their source book with summary counts.
 */
export interface DayData {
  date: string;
  books: {
    book: ReadwiseBook;
    highlights: ReadwiseHighlight[];
  }[];
  highlightCount: number;
  noteCount: number;
}

/**
 * Summary entry for the archive (calendar) view.
 * Contains counts only -- no full highlight text -- for efficient rendering.
 */
export interface ArchiveEntry {
  date: string;
  bookCount: number;
  highlightCount: number;
  noteCount: number;
}
