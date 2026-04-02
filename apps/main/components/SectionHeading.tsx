/**
 * SectionHeading component for labeling content sections.
 *
 * Renders a styled uppercase monospace heading used as a section
 * label throughout the site (e.g., "Recent Writing", "Featured Project").
 * Uses the design system's section-label font size and muted label color.
 */
export function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-5 font-mono text-section-label uppercase text-text-label">
      {children}
    </h2>
  );
}
