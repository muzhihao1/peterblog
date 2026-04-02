/**
 * Archive page — chronological list of all reading days grouped by month.
 *
 * Fetches the full archive summary from Readwise and groups entries by
 * year-month. Each row links to the Today page for that specific date.
 * Uses force-dynamic to avoid build-time API calls.
 */
import type { Metadata } from "next";
import type { ArchiveEntry } from "@/lib/types";
import { getArchive } from "@/lib/readwise";
import { ArchiveRow } from "@/components/ArchiveRow";

export const metadata: Metadata = { title: "Archive" };
export const dynamic = "force-dynamic";

export default async function ArchivePage() {
  let archive: ArchiveEntry[];
  try {
    archive = await getArchive();
  } catch {
    archive = [];
  }

  const grouped = new Map<string, typeof archive>();
  for (const entry of archive) {
    const yearMonth = entry.date.slice(0, 7);
    const existing = grouped.get(yearMonth) || [];
    existing.push(entry);
    grouped.set(yearMonth, existing);
  }

  return (
    <div className="mx-auto max-w-content px-10 py-10 max-md:px-5">
      <h1 className="mb-8 font-heading text-[28px] font-bold text-text-primary">
        Archive
      </h1>
      {archive.length === 0 ? (
        <p className="text-center font-body text-sm text-text-muted">
          No reading data available.
        </p>
      ) : (
        Array.from(grouped.entries()).map(([yearMonth, entries]) => {
          const d = new Date(yearMonth + "-01T00:00:00");
          const label = d.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
          });
          return (
            <div key={yearMonth} className="mb-8">
              <h2 className="mb-3 font-mono text-section-label uppercase text-text-label">
                {label}
              </h2>
              <div>
                {entries.map((entry) => (
                  <ArchiveRow key={entry.date} entry={entry} />
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
