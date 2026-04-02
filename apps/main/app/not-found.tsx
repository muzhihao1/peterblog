import Link from "next/link";

/**
 * Custom 404 page displayed when a route does not match any known page.
 *
 * Shows a minimal, centered layout with a large "404" heading,
 * a brief explanation, and a link back to the homepage.
 */
export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-content flex-col items-center justify-center px-10 py-32 max-md:px-5">
      <h1 className="font-heading text-[48px] font-bold text-text-primary">
        404
      </h1>
      <p className="mt-2 font-body text-sm text-text-muted">
        This page doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="mt-6 font-mono text-nav-item uppercase text-accent"
      >
        &larr; Back home
      </Link>
    </div>
  );
}
