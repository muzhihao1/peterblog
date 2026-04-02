"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
 * On desktop (md+), nav links render inline to the right of the brand mark.
 * On mobile (<md), a hamburger button toggles a vertical dropdown menu
 * that slides in below the header bar. Clicking any link closes the menu.
 *
 * Uses `usePathname()` from Next.js to highlight the active nav item.
 */
export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const currentPath = usePathname();

  /** Close the mobile menu when a link is tapped. */
  const handleLinkClick = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-content-wide items-center justify-between px-10 py-5 max-md:px-5">
        {/* Brand mark */}
        <Link href="/" className="flex items-baseline gap-2">
          <span className="font-heading text-lg font-bold text-text-primary">
            Peter Mu
          </span>
          <span className="font-mono text-section-label uppercase text-text-muted">
            Lab
          </span>
        </Link>

        {/* Desktop navigation */}
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

        {/* Mobile hamburger button */}
        <button
          type="button"
          className="hidden font-mono text-2xl text-text-primary max-md:block"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? "\u00D7" : "\u2261"}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <nav className="hidden border-t border-border bg-bg/95 backdrop-blur-md max-md:block">
          <div className="mx-auto flex max-w-content-wide flex-col gap-1 px-10 py-4 max-md:px-5">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleLinkClick}
                className={`rounded px-3 py-2 font-mono text-nav-item uppercase ${
                  currentPath === item.href
                    ? "bg-accent/10 text-text-primary"
                    : "text-text-muted hover:text-text-primary"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <a
              href={readingUrl}
              onClick={handleLinkClick}
              className="rounded px-3 py-2 font-mono text-nav-item uppercase text-accent"
            >
              Reading &rarr;
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
