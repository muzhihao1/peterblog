"use client";

import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/readwise";

/**
 * Date navigation bar with left/right arrow buttons and a formatted date heading.
 *
 * Allows the user to navigate between reading days by clicking the arrow
 * buttons, which push a new `?date=` query parameter to the URL.
 *
 * @param date - The currently displayed date in YYYY-MM-DD format.
 */
export function DateNav({ date }: { date: string }) {
  const router = useRouter();

  const navigate = (offset: number) => {
    const currentDate = new Date(date + "T00:00:00");
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + offset);
    const dateStr = newDate.toISOString().slice(0, 10);
    router.push(`/?date=${dateStr}`);
  };

  return (
    <div className="mb-2 flex items-center justify-between">
      <button
        onClick={() => navigate(-1)}
        className="font-mono text-sm text-text-muted hover:text-text-primary"
      >
        &larr;
      </button>
      <h1 className="font-heading text-[28px] font-bold text-text-primary">
        {formatDate(date)}
      </h1>
      <button
        onClick={() => navigate(1)}
        className="font-mono text-sm text-text-muted hover:text-text-primary"
      >
        &rarr;
      </button>
    </div>
  );
}
