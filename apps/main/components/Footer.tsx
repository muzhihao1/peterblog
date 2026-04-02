/**
 * Minimal site footer with copyright notice.
 *
 * Renders a centered copyright line using the current year.
 * Styled with the monospace font at a small size to stay unobtrusive.
 */
export function Footer() {
  return (
    <footer className="border-t border-border py-6 text-center">
      <p className="font-mono text-[10px] tracking-wide text-text-muted">
        &copy; {new Date().getFullYear()} Peter Mu &middot; Built with curiosity
      </p>
    </footer>
  );
}
