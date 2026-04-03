"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Navigation items for the reading site header.
 * Maps each label to its corresponding route.
 */
const navItems = [
  { label: "Today", href: "/" },
  { label: "Archive", href: "/archive" },
  { label: "Books", href: "/books" },
];

/**
 * URL for the main petermu.com site.
 * Falls back to production domain when the env var is not set.
 */
const mainUrl =
  process.env.NEXT_PUBLIC_MAIN_URL || "https://petermu.com";

/**
 * Sticky site header for the reading sub-site.
 *
 * Renders the "Peter Mu / Reading Journal" brand mark on the left
 * and navigation links on the right. Uses `usePathname` to highlight
 * the currently active route. Includes a back-link to the main site.
 */
export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-content-wide items-center justify-between px-10 py-4 max-md:px-5">
        <Link href="/" className="flex items-baseline gap-1.5">
          <span className="font-heading text-lg font-bold text-text-primary">
            Peter Mu
          </span>
          <span className="font-mono text-[9px] uppercase tracking-[1.5px] text-text-muted">
            Reading Journal
          </span>
        </Link>

        <nav className="flex items-center gap-5">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`font-mono text-nav-item uppercase ${
                pathname === item.href
                  ? "border-b-2 border-accent pb-0.5 text-text-primary"
                  : "text-text-muted hover:text-text-primary"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <a
            href={mainUrl}
            className="font-mono text-nav-item uppercase text-accent"
          >
            &larr; petermu.com
          </a>
        </nav>
      </div>
    </header>
  );
}
