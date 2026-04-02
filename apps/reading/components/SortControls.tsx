"use client";

/**
 * Available sort modes for the book grid.
 * - `recent`: Sort by most recently highlighted.
 * - `highlights`: Sort by number of highlights (descending).
 * - `title`: Sort alphabetically by title.
 */
export type SortMode = "recent" | "highlights" | "title";

/**
 * Toolbar with sort buttons, a search input, and a year filter dropdown.
 *
 * Provides controls for filtering and ordering the book grid. The active
 * sort button is visually highlighted. All state is managed by the parent
 * component via the callback props.
 *
 * @param sort - The currently active sort mode.
 * @param onSortChange - Callback when a sort button is clicked.
 * @param search - The current search query string.
 * @param onSearchChange - Callback when the search input changes.
 * @param years - Available years for the year filter dropdown.
 * @param selectedYear - The currently selected year, or null for "all".
 * @param onYearChange - Callback when the year filter changes.
 */
export function SortControls({
  sort,
  onSortChange,
  search,
  onSearchChange,
  years,
  selectedYear,
  onYearChange,
}: {
  sort: SortMode;
  onSortChange: (s: SortMode) => void;
  search: string;
  onSearchChange: (s: string) => void;
  years: number[];
  selectedYear: number | null;
  onYearChange: (y: number | null) => void;
}) {
  const sortOptions: { label: string; value: SortMode }[] = [
    { label: "Recent", value: "recent" },
    { label: "Highlights", value: "highlights" },
    { label: "Title", value: "title" },
  ];

  return (
    <div className="mb-6 flex items-center justify-between gap-4 max-md:flex-col max-md:items-stretch">
      <div className="flex gap-1">
        {sortOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onSortChange(opt.value)}
            className={`rounded-full px-2.5 py-1 font-mono text-[10px] uppercase ${
              sort === opt.value
                ? "bg-text-primary text-bg"
                : "text-text-muted hover:text-text-primary"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-32 rounded border border-border bg-bg-card px-2.5 py-1 font-mono text-[11px] text-text-body outline-none focus:border-accent"
        />
        <select
          value={selectedYear ?? "all"}
          onChange={(e) =>
            onYearChange(
              e.target.value === "all" ? null : Number(e.target.value)
            )
          }
          className="rounded border border-border bg-bg-card px-2 py-1 font-mono text-[10px] text-text-body outline-none"
        >
          <option value="all">All</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
