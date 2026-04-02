import { formatTime } from "@/lib/readwise";

/**
 * Renders a single reading highlight as a left-bordered quote block.
 *
 * Displays the highlighted text in quotation marks with an optional
 * timestamp showing when the highlight was captured.
 *
 * @param text - The highlighted passage text.
 * @param highlightedAt - ISO datetime string when the highlight was made, or null.
 */
export function HighlightItem({
  text,
  highlightedAt,
}: {
  text: string;
  highlightedAt: string | null;
}) {
  return (
    <div className="mb-4 border-l-2 border-border pl-4">
      <p className="font-body text-[13px] leading-[1.7] text-text-primary">
        &ldquo;{text}&rdquo;
      </p>
      {highlightedAt && (
        <p className="mt-1.5 font-mono text-[9px] text-text-muted">
          {formatTime(highlightedAt)}
        </p>
      )}
    </div>
  );
}
