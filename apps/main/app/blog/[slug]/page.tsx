/**
 * Individual blog post page (dynamic route).
 *
 * Uses generateStaticParams to pre-render all posts at build time.
 * Renders the post title, formatted date, reading time, optional tags,
 * and the full MDX content body.
 *
 * In Next.js 16, `params` is a Promise and must be awaited before
 * accessing its properties.
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/content";
import { MdxContent } from "@/components/MdxContent";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return { title: post.frontmatter.title, description: post.frontmatter.excerpt };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const date = new Date(post.frontmatter.date);
  const formatted = date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  return (
    <article className="mx-auto max-w-content px-10 py-16 max-md:px-5">
      <header className="mb-8">
        <h1 className="font-heading text-[32px] font-bold leading-tight text-text-primary">
          {post.frontmatter.title}
        </h1>
        <div className="mt-3 flex items-center gap-3 font-mono text-[11px] text-text-muted">
          <time>{formatted}</time>
          <span>·</span>
          <span>{post.readingTime}</span>
        </div>
        {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {post.frontmatter.tags.map((tag) => (
              <span key={tag} className="rounded bg-bg-tag px-2 py-0.5 font-mono text-[10px] text-text-muted">
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>
      <MdxContent source={post.content} />
    </article>
  );
}
