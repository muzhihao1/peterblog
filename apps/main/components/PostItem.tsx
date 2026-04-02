/**
 * PostItem component for rendering a single blog post in a list.
 *
 * Displays the post title, formatted date, and optional excerpt.
 * The entire article is wrapped in a link to the full blog post page.
 * Posts are separated by a bottom border, with the last item borderless.
 *
 * @param post - A Post object containing slug, frontmatter, and metadata.
 */
import Link from "next/link";
import type { Post } from "@/lib/types";

export function PostItem({ post }: { post: Post }) {
  const date = new Date(post.frontmatter.date);
  const formatted = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <article className="border-b border-border pb-5 mb-5 last:border-b-0">
      <Link href={`/blog/${post.slug}`} className="group">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="font-heading text-[17px] font-semibold text-text-primary group-hover:text-accent">
            {post.frontmatter.title}
          </h3>
          <time className="shrink-0 font-mono text-[10px] text-text-muted">
            {formatted}
          </time>
        </div>
        {post.frontmatter.excerpt && (
          <p className="mt-1.5 font-body text-[13px] leading-relaxed text-text-body">
            {post.frontmatter.excerpt}
          </p>
        )}
      </Link>
    </article>
  );
}
