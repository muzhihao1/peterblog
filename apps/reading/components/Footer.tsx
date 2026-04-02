/**
 * Minimal footer for the reading sub-site.
 * Shows a single line indicating the highlight source.
 */
export function Footer() {
  return (
    <footer className="border-t border-border py-4 text-center">
      <p className="font-mono text-[9px] tracking-wide text-text-muted">
        Highlights synced from Readwise
      </p>
    </footer>
  );
}
