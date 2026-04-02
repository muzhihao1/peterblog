/**
 * Readwise API client for fetching books, highlights, and derived data.
 *
 * All functions use the Readwise v2 REST API with automatic pagination.
 * Responses are cached via Next.js ISR (revalidate every hour) so the
 * reading site stays reasonably fresh without hammering the API.
 *
 * @see https://readwise.io/api_deets
 */
import type {
  ReadwiseBook,
  ReadwiseHighlight,
  BookWithHighlights,
  DayData,
  ArchiveEntry,
} from "./types";

/** Base URL for the Readwise v2 API. */
const READWISE_API = "https://readwise.io/api/v2";

/** Access token read from the server environment at runtime. */
const TOKEN = process.env.READWISE_ACCESS_TOKEN;

/**
 * Fetches all pages of a paginated Readwise endpoint and returns the
 * concatenated results array.
 *
 * The Readwise API uses cursor-based pagination with a `next` URL field.
 * This helper follows that chain until `next` is `null`, accumulating
 * every `results` entry into a single flat array.
 *
 * @typeParam T - The shape of each item in the `results` array.
 * @param endpoint - The API path (e.g. `/books/?page_size=1000`).
 * @returns All results across every page.
 * @throws When `READWISE_ACCESS_TOKEN` is not configured or the API returns a non-OK status.
 */
async function fetchAllPages<T>(endpoint: string): Promise<T[]> {
  if (!TOKEN) {
    throw new Error("READWISE_ACCESS_TOKEN not set");
  }

  const results: T[] = [];
  let nextUrl: string | null = `${READWISE_API}${endpoint}`;

  while (nextUrl) {
    const url: string = nextUrl;
    const res: Response = await fetch(url, {
      headers: { Authorization: `Token ${TOKEN}` },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      throw new Error(
        `Readwise API error: ${res.status} ${res.statusText}`
      );
    }

    const data: { results: T[]; next: string | null } = await res.json();
    results.push(...data.results);
    nextUrl = data.next;
  }

  return results;
}

/**
 * Fetches all books from the Readwise library, sorted by most recently
 * highlighted (falling back to `updated` if no highlights exist).
 *
 * @returns An array of books sorted newest-first.
 */
export async function getBooks(): Promise<ReadwiseBook[]> {
  const books = await fetchAllPages<ReadwiseBook>(
    "/books/?page_size=1000"
  );
  return books.sort(
    (a, b) =>
      new Date(b.last_highlight_at || b.updated).getTime() -
      new Date(a.last_highlight_at || a.updated).getTime()
  );
}

/**
 * Fetches every highlight across all books.
 *
 * @returns A flat array of all highlights (unordered).
 */
export async function getHighlights(): Promise<ReadwiseHighlight[]> {
  return fetchAllPages<ReadwiseHighlight>(
    "/highlights/?page_size=1000"
  );
}

/**
 * Fetches a single book together with all of its highlights.
 *
 * Highlights are sorted chronologically (earliest first) so they
 * read in the same order the reader encountered them.
 *
 * @param bookId - The Readwise book ID.
 * @returns The book with its highlights, or `null` if the book was not found.
 */
export async function getBookWithHighlights(
  bookId: number
): Promise<BookWithHighlights | null> {
  if (!TOKEN) {
    throw new Error("READWISE_ACCESS_TOKEN not set");
  }

  const bookRes = await fetch(`${READWISE_API}/books/${bookId}`, {
    headers: { Authorization: `Token ${TOKEN}` },
    next: { revalidate: 3600 },
  });

  if (!bookRes.ok) return null;

  const book: ReadwiseBook = await bookRes.json();
  const highlights = await fetchAllPages<ReadwiseHighlight>(
    `/highlights/?book_id=${bookId}&page_size=1000`
  );

  return {
    book,
    highlights: highlights.sort(
      (a, b) =>
        new Date(a.highlighted_at || a.updated).getTime() -
        new Date(b.highlighted_at || b.updated).getTime()
    ),
  };
}

/**
 * Builds aggregated reading data for a specific calendar day.
 *
 * Filters all highlights to those whose `highlighted_at` (or `updated`)
 * date string starts with the given `dateStr` (YYYY-MM-DD), then groups
 * them by book.
 *
 * @param dateStr - An ISO date prefix, e.g. `"2024-12-25"`.
 * @returns The day's reading data with per-book highlight groups.
 */
export async function getDayData(dateStr: string): Promise<DayData> {
  const highlights = await getHighlights();
  const books = await getBooks();
  const bookMap = new Map(books.map((b) => [b.id, b]));

  const dayHighlights = highlights.filter((h) => {
    const hlDate = h.highlighted_at || h.updated;
    return hlDate.startsWith(dateStr);
  });

  const grouped = new Map<number, ReadwiseHighlight[]>();
  for (const hl of dayHighlights) {
    const existing = grouped.get(hl.book_id) || [];
    existing.push(hl);
    grouped.set(hl.book_id, existing);
  }

  const dayBooks = Array.from(grouped.entries())
    .map(([bookId, hls]) => ({
      book: bookMap.get(bookId)!,
      highlights: hls.sort(
        (a, b) =>
          new Date(a.highlighted_at || a.updated).getTime() -
          new Date(b.highlighted_at || b.updated).getTime()
      ),
    }))
    .filter((entry) => entry.book);

  const noteCount = dayHighlights.filter(
    (h) => h.note && h.note.trim()
  ).length;

  return {
    date: dateStr,
    books: dayBooks,
    highlightCount: dayHighlights.length,
    noteCount,
  };
}

/**
 * Builds a chronological archive of all reading days.
 *
 * Each entry summarises one calendar day: how many distinct books were
 * read, how many highlights were captured, and how many of those had
 * personal notes attached.
 *
 * @returns Archive entries sorted newest-first.
 */
export async function getArchive(): Promise<ArchiveEntry[]> {
  const highlights = await getHighlights();
  const dateMap = new Map<
    string,
    { bookIds: Set<number>; highlightCount: number; noteCount: number }
  >();

  for (const hl of highlights) {
    const date = (hl.highlighted_at || hl.updated).slice(0, 10);
    const entry = dateMap.get(date) || {
      bookIds: new Set(),
      highlightCount: 0,
      noteCount: 0,
    };
    entry.bookIds.add(hl.book_id);
    entry.highlightCount++;
    if (hl.note && hl.note.trim()) entry.noteCount++;
    dateMap.set(date, entry);
  }

  return Array.from(dateMap.entries())
    .map(([date, data]) => ({
      date,
      bookCount: data.bookIds.size,
      highlightCount: data.highlightCount,
      noteCount: data.noteCount,
    }))
    .sort((a, b) => b.date.localeCompare(a.date));
}

/**
 * Formats an ISO date string (YYYY-MM-DD) into a human-readable date
 * like "December 25, 2024".
 *
 * @param dateStr - A date in `YYYY-MM-DD` format.
 * @returns A locale-formatted date string.
 */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Formats an ISO datetime string into a human-readable time like "3:42 PM".
 *
 * @param dateStr - A full ISO datetime string.
 * @returns A locale-formatted time string.
 */
export function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
