import Link from "next/link";

/**
 * Navigation items displayed in the main header.
 * Each item maps to a top-level route in the main site.
 */
const navItems = [
  { label: "Home", href: "/" },
  { label: "Blog", href: "/blog" },
  { label: "Projects", href: "/projects" },
  { label: "Tools", href: "/tools" },
  { label: "About", href: "/about" },
];

/**
 * External URL for the reading sub-site.
 * Falls back to the production reading domain if the env var is not set.
 */
const readingUrl =
  process.env.NEXT_PUBLIC_READING_URL || "https://reading.petermu.com";

/**
 * Sticky site header with frosted-glass effect and primary navigation.
 *
 * Renders the "Peter Mu / Lab" brand mark on the left and the main nav
 * links on the right. The active link is determined by matching `currentPath`
 * against each nav item's `href`.
 *
 * @param currentPath - The current route path used to highlight the active nav item.
 */
export function Header({ currentPath = "/" }: { currentPath?: string }) {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-content-wide items-center justify-between px-10 py-5 max-md:px-5">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="font-heading text-lg font-bold text-text-primary">
            Peter Mu
          </span>
          <span className="font-mono text-section-label uppercase text-text-muted">
            Lab
          </span>
        </Link>
        <nav className="flex items-center gap-6 max-md:hidden">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`font-mono text-nav-item uppercase ${
                currentPath === item.href
                  ? "border-b-2 border-accent pb-0.5 text-text-primary"
                  : "text-text-muted hover:text-text-primary"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <a
            href={readingUrl}
            className="font-mono text-nav-item uppercase text-accent"
          >
            Reading &rarr;
          </a>
        </nav>
      </div>
    </header>
  );
}
