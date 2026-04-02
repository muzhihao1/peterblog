/**
 * Today page — shows reading highlights for a specific calendar day.
 *
 * Defaults to the most recent day with highlights (from the archive),
 * or accepts a `?date=YYYY-MM-DD` query parameter to view any day.
 * Server component that fetches data at request time with force-dynamic
 * to avoid build-time API calls when no Readwise token is available.
 */
import type { Metadata } from "next";
import { getDayData, getArchive } from "@/lib/readwise";
import { DateNav } from "@/components/DateNav";
import { DayTimeline } from "@/components/DayTimeline";

export const metadata: Metadata = { title: "Today" };
export const dynamic = "force-dynamic";

export default async function TodayPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { date } = await searchParams;

  let dateStr = date;
  if (!dateStr) {
    try {
      const archive = await getArchive();
      dateStr =
        archive.length > 0
          ? archive[0].date
          : new Date().toISOString().slice(0, 10);
    } catch {
      dateStr = new Date().toISOString().slice(0, 10);
    }
  }

  let dayData;
  try {
    dayData = await getDayData(dateStr);
  } catch {
    dayData = {
      date: dateStr,
      books: [],
      highlightCount: 0,
      noteCount: 0,
    };
  }

  return (
    <div className="mx-auto max-w-content px-10 py-10 max-md:px-5">
      <DateNav date={dateStr} />
      <p className="mb-8 text-center font-mono text-section-label uppercase text-text-muted">
        {dayData.books.length} books &middot; {dayData.highlightCount}{" "}
        highlights &middot; {dayData.noteCount} notes
      </p>
      <DayTimeline data={dayData} />
    </div>
  );
}
